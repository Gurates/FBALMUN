type Field = { label: string; max: number; required?: boolean };
const field = (label: string, max: number, required = false): Field => ({ label, max, required });
const contact = {
  full_name: field('Full name', 100, true), school: field('School', 150, true),
  email: field('Email', 100, true), phone: field('Phone', 25, true),
};
const individual = { ...contact, grade: field('Grade', 20, true) };
const extra = { message: field('Additional information', 2000), references_text: field('References', 1000) };
const experience = { org_exp_list: field('Experience', 3000) };
export const applicationFields: Record<string, Record<string, Field>> = {
  song: { song_title: field('Song name', 120, true), artist: field('Artist', 120) },
  delegate: { ...individual, exp_list: field('MUN experience', 3000), committee_preference_1: field('1st committee', 32, true), committee_preference_2: field('2nd committee', 32, true), committee_preference_3: field('3rd committee', 32, true), motivation_letter: field('Motivation letter', 5000, true), message: extra.message, references: extra.references_text },
  delegation: { ...contact, delegation_name: field('Delegation name', 150, true), expected_members: field('Expected members', 3, true), all_emails: field('Member emails', 3000, true), all_phones: field('Member phones', 1500, true), message: extra.message },
  chairboard: { ...individual, exp_list: field('MUN experience', 3000), pref1: field('1st committee', 32, true), pref2: field('2nd committee', 32, true), pref3: field('3rd committee', 32, true), motivation_letter: field('Motivation letter', 5000, true), crisis_directive: field('Crisis directive', 3000), ga_procedure: field('GA procedure', 3000), q_ai_suspicion: field('AI suspicion response', 2000, true), q_final_documents: field('Final documents response', 3000, true), q_directive_help: field('Directive help response', 2000), q_resolution_paper: field('Resolution paper response', 3000), q_disagreement: field('Disagreement response', 3000, true), ...extra },
  admin: { ...individual, ...experience, ...extra },
  press: { ...individual, ...experience, camera_model: field('Camera model', 150), ...extra },
};
const committees = ['unwomen','wha','imo','specpol','bilderberg','swiss-assembly','scotus','wars-of-the-roses','fkk-pakistan-india'];

export function validateApplication(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid application.');
  if (Object.keys(input).some(key => !['type', 'data', 'requestId'].includes(key))) throw new Error('Unexpected request field.');
  const { type, data, requestId } = input as Record<string, unknown>;
  if (typeof type !== 'string' || !Object.hasOwn(applicationFields, type) || typeof requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) throw new Error('Invalid application type or request ID.');
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid form data.');
  const source = data as Record<string, unknown>;
  const fields = applicationFields[type];
  if (Object.keys(source).some(key => !Object.hasOwn(fields, key))) throw new Error('Unexpected form field.');
  const clean: Record<string, string | number> = {};
  for (const [key, rules] of Object.entries(fields)) {
    const value = source[key];
    if (key === 'expected_members') {
      if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 500) throw new Error('Expected members must be between 1 and 500.');
      clean[key] = value; continue;
    }
    if (value !== undefined && typeof value !== 'string') throw new Error(`Invalid ${rules.label.toLowerCase()}.`);
    const text = ((value as string | undefined) || '').trim();
    if ((rules.required && !text) || text.length > rules.max || text.includes('\u0000')) throw new Error(`Please check ${rules.label.toLowerCase()}.`);
    clean[key] = text;
  }
  if (type === 'song') return { type, data: clean, requestId };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(clean.email)) || String(clean.phone).length < 7) throw new Error('Please check your email and phone number.');
  if (type !== 'delegation' && !['Prep','9th Grade','10th Grade','11th Grade','12th Grade'].includes(String(clean.grade))) throw new Error('Invalid grade.');
  if (type === 'delegate' || type === 'chairboard') {
    const prefs = (type === 'delegate' ? ['committee_preference_1','committee_preference_2','committee_preference_3'] : ['pref1','pref2','pref3']).map(key => String(clean[key]));
    if (prefs.some(value => !committees.includes(value)) || new Set(prefs).size !== 3) throw new Error('Choose three different committees.');
    if (String(clean.motivation_letter).length < 150) throw new Error('Motivation letter must be at least 150 characters.');
  }
  return { type, data: clean, requestId };
}

export async function handleApplicationRequest(method: string | undefined, headers: Record<string, string | undefined>, body: string, env: Record<string, string | undefined>, send: typeof fetch = fetch) {
  const reply = (statusCode: number, payload: Record<string, unknown>) => ({ statusCode, headers: { 'Content-Type':'application/json', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'Allow':'POST' }, body: JSON.stringify(payload) });
  if (method !== 'POST') return reply(405, { error: 'Method not allowed.' });
  if (headers['sec-fetch-site'] === 'cross-site') return reply(403, {error:'Cross-site submissions are not allowed.'});
  if (headers.origin) {
    try {
      const origin = new URL(headers.origin);
      if (!['http:', 'https:'].includes(origin.protocol) || origin.host !== headers.host) return reply(403, {error:'Cross-site submissions are not allowed.'});
    } catch { return reply(403, {error:'Invalid origin.'}); }
  }
  if ((headers['content-type'] || '').split(';')[0].trim().toLowerCase() !== 'application/json') return reply(415, {error:'JSON content is required.'});
  if (Buffer.byteLength(body, 'utf8') > 65536) return reply(413, {error:'Application is too large.'});
  let application: ReturnType<typeof validateApplication>;
  try { application = validateApplication(JSON.parse(body)); } catch (error) { return reply(400, {error: error instanceof SyntaxError ? 'Invalid JSON.' : (error as Error).message}); }
  const url = env.APPLICATIONS_WEBHOOK_URL || '';
  const secret = env.APPLICATIONS_WEBHOOK_SECRET || '';
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url) || secret.length < 32) return reply(503, {error:'Applications are temporarily unavailable. Please try again later.'});
  try {
    const result = await send(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...application, secret}), signal:AbortSignal.timeout(25000), redirect:'follow' });
    const payload = await result.json() as { success?: boolean; requestId?: string } | null;
    if (!result.ok || payload?.success !== true || payload?.requestId !== application.requestId) return reply(502, {error:'Your application could not be saved. Please try again.'});
    return reply(200, {success:true, requestId:application.requestId});
  } catch { return reply(502, {error:'We couldn’t confirm your submission. Please try again.'}); }
}
