// FBALMUN application receiver. Run setupSheets once, then deploy as a Web App.
// Script Properties: SPREADSHEET_ID and APPLICATIONS_WEBHOOK_SECRET.
// Execute as: Me. Access: Anyone. The shared secret authenticates the server.
const TAB_NAMES = { delegate: 'Delegates', delegation: 'Delegations', chairboard: 'Chairboard', admin: 'Admin Staff', press: 'Press', song: 'Song Requests' };

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return jsonResponse({success: false, error: 'Method not allowed.', receiverVersion: 'fbalmun-sheets-song-v2'});
}

function secretsMatch(left, right) {
  const a = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, left, Utilities.Charset.UTF_8);
  const b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, right, Utilities.Charset.UTF_8);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0;
}

function safeCell(value) {
  if (typeof value === 'number') return value;
  const text = String(value || '');
  // Spreadsheet cells must never execute formulas supplied by visitors.
  return /^[\s\uFEFF]*[=+\-@]/.test(text) ? "'" + text : text;
}

function sheetHeaders(type) {
  return ['Submission ID', 'Submission hash', 'Submitted at', 'Status'].concat(Object.keys(APPLICATION_FIELDS[type]).map(key => APPLICATION_FIELDS[type][key].label));
}

function ensureSheet(book, type) {
  const sheet = book.getSheetByName(TAB_NAMES[type]) || book.insertSheet(TAB_NAMES[type]);
  const headers = sheetHeaders(type);
  if (sheet.getMaxColumns() < headers.length) sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#4a0e14').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.hideColumns(1, 2);
    sheet.setColumnWidths(3, headers.length - 2, 190);
    sheet.getRange(1, 3, sheet.getMaxRows(), headers.length - 2).setWrap(true).setVerticalAlignment('top').setFontSize(11);
    Object.keys(APPLICATION_FIELDS[type]).forEach((key, index) => {
      if (APPLICATION_FIELDS[type][key].max >= 1000) sheet.setColumnWidth(index + 5, 420);
    });
    sheet.setRowHeight(1, 32);
    sheet.getRange(1, 3, sheet.getMaxRows(), headers.length - 2).createFilter();
  } else {
    const current = sheet.getRange(1,1,1,headers.length).getDisplayValues()[0];
    if (JSON.stringify(current) !== JSON.stringify(headers)) throw new Error('Unexpected spreadsheet columns');
  }
  return sheet;
}

function setupSheets() {
  const properties = PropertiesService.getScriptProperties();
  if ((properties.getProperty('APPLICATIONS_WEBHOOK_SECRET') || '').length < 32) throw new Error('Configure a shared secret of at least 32 characters');
  const book = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID'));
  Object.keys(TAB_NAMES).forEach(type => ensureSheet(book, type));
}

function doPost(event) {
  let lock;
  try {
    const raw = event && event.postData && event.postData.contents;
    if (!raw || raw.length > 65536) return jsonResponse({success:false,error:'Invalid request.'});
    const input = JSON.parse(raw);
    if (!input || typeof input !== 'object' || Array.isArray(input)) return jsonResponse({success:false,error:'Invalid request.'});
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty('APPLICATIONS_WEBHOOK_SECRET') || '';
    if (secret.length < 32 || typeof input.secret !== 'string' || input.secret.length > 512 || !secretsMatch(secret,input.secret)) return jsonResponse({success:false,error:'Unauthorized.'});
    if (Object.keys(input).some(key => !['type','data','requestId','secret'].includes(key))) return jsonResponse({success:false,error:'Invalid request.'});
    if (!Object.prototype.hasOwnProperty.call(APPLICATION_FIELDS,input.type) || typeof input.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId)) return jsonResponse({success:false,error:'Invalid request.'});
    if (!input.data || typeof input.data !== 'object' || Array.isArray(input.data)) return jsonResponse({success:false,error:'Invalid data.'});
    const fields = APPLICATION_FIELDS[input.type];
    if (Object.keys(input.data).some(key => !Object.prototype.hasOwnProperty.call(fields,key))) return jsonResponse({success:false,error:'Invalid fields.'});
    const values = Object.keys(fields).map(key => {
      const value = input.data[key];
      if (key === 'expected_members') {
        if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 500) throw new Error('Invalid members');
        return value;
      }
      if (typeof value !== 'string' || value.length > fields[key].max || value.indexOf('\u0000') !== -1 || (fields[key].required && !value.trim())) throw new Error('Invalid value');
      return value;
    });
    const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify(values),Utilities.Charset.UTF_8).map(byte => (byte & 255).toString(16).padStart(2,'0')).join('');
    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return jsonResponse({success:false,error:'Please retry.'});
    const book = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID'));
    const sheet = ensureSheet(book,input.type);
    const existing = sheet.getLastRow() > 1 ? sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(input.requestId).matchEntireCell(true).useRegularExpression(false).findNext() : null;
    if (existing) {
      if (sheet.getRange(existing.getRow(),2).getValue() !== hash) return jsonResponse({success:false,error:'Submission conflict.'});
      return jsonResponse({success:true,requestId:input.requestId});
    }
    const timestamp = Utilities.formatDate(new Date(),'Europe/Istanbul',"yyyy-MM-dd HH:mm:ss");
    const row = [input.requestId,hash,timestamp,'Pending'].concat(values.map(safeCell));
    // Plain text preserves phone numbers and prevents automatic conversions.
    sheet.getRange(sheet.getLastRow()+1,1,1,row.length).setNumberFormat('@').setValues([row]);
    SpreadsheetApp.flush();
    return jsonResponse({success:true,requestId:input.requestId});
  } catch (_) {
    // Never return spreadsheet IDs, rows, credentials, or submitted personal data.
    return jsonResponse({success:false,error:'The application could not be saved.'});
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
