const APPLICATION_FIELDS = {
  "delegate": {
    "full_name": {
      "label": "Full name",
      "max": 100,
      "required": true
    },
    "school": {
      "label": "School",
      "max": 150,
      "required": true
    },
    "email": {
      "label": "Email",
      "max": 100,
      "required": true
    },
    "phone": {
      "label": "Phone",
      "max": 25,
      "required": true
    },
    "grade": {
      "label": "Grade",
      "max": 20,
      "required": true
    },
    "exp_list": {
      "label": "MUN experience",
      "max": 3000,
      "required": false
    },
    "committee_preference_1": {
      "label": "1st committee",
      "max": 32,
      "required": true
    },
    "committee_preference_2": {
      "label": "2nd committee",
      "max": 32,
      "required": true
    },
    "committee_preference_3": {
      "label": "3rd committee",
      "max": 32,
      "required": true
    },
    "motivation_letter": {
      "label": "Motivation letter",
      "max": 5000,
      "required": true
    },
    "message": {
      "label": "Additional information",
      "max": 2000,
      "required": false
    },
    "references": {
      "label": "References",
      "max": 1000,
      "required": false
    }
  },
  "delegation": {
    "full_name": {
      "label": "Full name",
      "max": 100,
      "required": true
    },
    "school": {
      "label": "School",
      "max": 150,
      "required": true
    },
    "email": {
      "label": "Email",
      "max": 100,
      "required": true
    },
    "phone": {
      "label": "Phone",
      "max": 25,
      "required": true
    },
    "delegation_name": {
      "label": "Delegation name",
      "max": 150,
      "required": true
    },
    "expected_members": {
      "label": "Expected members",
      "max": 3,
      "required": true
    },
    "all_emails": {
      "label": "Member emails",
      "max": 3000,
      "required": true
    },
    "all_phones": {
      "label": "Member phones",
      "max": 1500,
      "required": true
    },
    "message": {
      "label": "Additional information",
      "max": 2000,
      "required": false
    }
  },
  "chairboard": {
    "full_name": {
      "label": "Full name",
      "max": 100,
      "required": true
    },
    "school": {
      "label": "School",
      "max": 150,
      "required": true
    },
    "email": {
      "label": "Email",
      "max": 100,
      "required": true
    },
    "phone": {
      "label": "Phone",
      "max": 25,
      "required": true
    },
    "grade": {
      "label": "Grade",
      "max": 20,
      "required": true
    },
    "exp_list": {
      "label": "MUN experience",
      "max": 3000,
      "required": false
    },
    "pref1": {
      "label": "1st committee",
      "max": 32,
      "required": true
    },
    "pref2": {
      "label": "2nd committee",
      "max": 32,
      "required": true
    },
    "pref3": {
      "label": "3rd committee",
      "max": 32,
      "required": true
    },
    "motivation_letter": {
      "label": "Motivation letter",
      "max": 5000,
      "required": true
    },
    "crisis_directive": {
      "label": "Crisis directive",
      "max": 3000,
      "required": false
    },
    "ga_procedure": {
      "label": "GA procedure",
      "max": 3000,
      "required": false
    },
    "q_ai_suspicion": {
      "label": "AI suspicion response",
      "max": 2000,
      "required": true
    },
    "q_final_documents": {
      "label": "Final documents response",
      "max": 3000,
      "required": true
    },
    "q_directive_help": {
      "label": "Directive help response",
      "max": 2000,
      "required": false
    },
    "q_resolution_paper": {
      "label": "Resolution paper response",
      "max": 3000,
      "required": false
    },
    "q_disagreement": {
      "label": "Disagreement response",
      "max": 3000,
      "required": true
    },
    "message": {
      "label": "Additional information",
      "max": 2000,
      "required": false
    },
    "references_text": {
      "label": "References",
      "max": 1000,
      "required": false
    }
  },
  "admin": {
    "full_name": {
      "label": "Full name",
      "max": 100,
      "required": true
    },
    "school": {
      "label": "School",
      "max": 150,
      "required": true
    },
    "email": {
      "label": "Email",
      "max": 100,
      "required": true
    },
    "phone": {
      "label": "Phone",
      "max": 25,
      "required": true
    },
    "grade": {
      "label": "Grade",
      "max": 20,
      "required": true
    },
    "org_exp_list": {
      "label": "Experience",
      "max": 3000,
      "required": false
    },
    "message": {
      "label": "Additional information",
      "max": 2000,
      "required": false
    },
    "references_text": {
      "label": "References",
      "max": 1000,
      "required": false
    }
  },
  "press": {
    "full_name": {
      "label": "Full name",
      "max": 100,
      "required": true
    },
    "school": {
      "label": "School",
      "max": 150,
      "required": true
    },
    "email": {
      "label": "Email",
      "max": 100,
      "required": true
    },
    "phone": {
      "label": "Phone",
      "max": 25,
      "required": true
    },
    "grade": {
      "label": "Grade",
      "max": 20,
      "required": true
    },
    "org_exp_list": {
      "label": "Experience",
      "max": 3000,
      "required": false
    },
    "camera_model": {
      "label": "Camera model",
      "max": 150,
      "required": false
    },
    "message": {
      "label": "Additional information",
      "max": 2000,
      "required": false
    },
    "references_text": {
      "label": "References",
      "max": 1000,
      "required": false
    }
  }
};

// FBALMUN application receiver. Run setupSheets once, then deploy as a Web App.
// Script Properties: SPREADSHEET_ID and APPLICATIONS_WEBHOOK_SECRET.
// Execute as: Me. Access: Anyone. The shared secret authenticates the server.
const TAB_NAMES = { delegate: 'Delegates', delegation: 'Delegations', chairboard: 'Chairboard', admin: 'Admin Staff', press: 'Press' };

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return jsonResponse({success: false, error: 'Method not allowed.'});
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
    sheet.hideColumns(2);
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
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty('APPLICATIONS_WEBHOOK_SECRET') || '';
    if (secret.length < 32 || typeof input.secret !== 'string' || input.secret.length > 512 || !secretsMatch(secret,input.secret)) return jsonResponse({success:false,error:'Unauthorized.'});
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
      if (typeof value !== 'string' || value.length > fields[key].max || (fields[key].required && !value.trim())) throw new Error('Invalid value');
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

APPLICATION_FIELDS.song = {
  song_title: {label: 'Song name', max: 120, required: true},
  artist: {label: 'Artist', max: 120, required: false}
};
TAB_NAMES.song = 'Song Requests';

function doGet() {
  return jsonResponse({
    success: false,
    error: 'Method not allowed.',
    receiverVersion: 'fbalmun-sheets-song-v2'
  });
}
