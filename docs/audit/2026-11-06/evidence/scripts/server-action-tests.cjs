// Tests the contact Server Action through the real form (local prod build, no SMTP creds).
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext()).newPage();
  let actionReq = null;
  p.on('request', r => { if (r.method() === 'POST' && r.headers()['next-action']) actionReq = { url: r.url(), headers: r.headers() }; });
  await p.goto('http://localhost:3200/#contact', { waitUntil: 'networkidle' });
  await p.fill('#cf-name', 'Test'); await p.fill('#cf-email', 'a@b.pl'); await p.fill('#cf-message', 'Hej');
  await p.check('#cf-consent', { force: true });
  await p.click('button[type=submit]'); await p.waitForTimeout(2500);
  const ui = await p.locator('#contact').innerText();
  console.log('UI after submit:', ui.match(/Formularz jest chwilowo[^\n]*|Nie udało[^\n]*|Dziękuję[^\n]*/)?.[0]);
  if (!actionReq) { console.log('no action captured'); process.exit(1); }
  const id = actionReq.headers['next-action'];
  fs.writeFileSync('ev/action-id.txt', id);
  const post = async (fields, file) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) fd.append('1_' + k, v);
    if (file) fd.append('1_attachment', new Blob([file.data], { type: file.type }), file.name);
    fd.append('0', '["$K1"]');
    const t0 = Date.now();
    const r = await fetch('http://localhost:3200/', { method: 'POST', headers: { 'Next-Action': id, Accept: 'text/x-component' }, body: fd });
    const txt = await r.text();
    return { status: r.status, ms: Date.now() - t0, body: (txt.split('\n').find(l => l.startsWith('1:')) || txt).slice(0, 160) };
  };
  const ok = { name: 'Jan', email: 'jan@x.pl', message: 'Treść', consent: 'on' };
  const cases = {
    'brak zgody': { ...ok, consent: '' },
    'zły email': { ...ok, email: 'nie-email' },
    'email z przecinkiem (2 adresy)': { ...ok, email: 'a@x.pl,b@y.pl' },
    'CRLF w imieniu': { ...ok, name: 'Jan\r\nBcc: ofiara@x.pl' },
    'XSS w wiadomości': { ...ok, message: '<script>alert(1)</script>' },
    'bardzo długa wiadomość (100k)': { ...ok, message: 'A'.repeat(100000) },
    'honeypot wypełniony': { ...ok, website: 'http://spam' },
    'nieznane pole __proto__': { ...ok, __proto__x: '1', role: 'admin' },
  };
  const out = {};
  for (const [k, f] of Object.entries(cases)) out[k] = await post(f);
  out['plik .exe udający PDF (MIME z klienta)'] = await post(ok, { data: Buffer.from('MZ\x90\x00 fake exe'), type: 'application/pdf', name: 'faktura.pdf.exe' });
  out['plik HTML z MIME text/html'] = await post(ok, { data: Buffer.from('<h1>x</h1>'), type: 'text/html', name: 'a.html' });
  out['plik 6 MB'] = await post(ok, { data: Buffer.alloc(6 * 1024 * 1024), type: 'application/pdf', name: 'big.pdf' });
  // rate limit probe: 30 sequential valid requests
  let statuses = {}; const t0 = Date.now();
  for (let i = 0; i < 30; i++) { const r = await post(ok); statuses[r.status] = (statuses[r.status] || 0) + 1; }
  out['30 żądań pod rząd'] = { statuses, ms: Date.now() - t0 };
  // GET-free: cross-origin POST (CSRF-like) with foreign Origin
  const r = await fetch('http://localhost:3200/', { method: 'POST', headers: { 'Next-Action': id, Origin: 'https://evil.example', Accept: 'text/x-component' }, body: (() => { const f = new FormData(); for (const [k, v] of Object.entries(ok)) f.append('1_' + k, v); f.append('0', '["$K1"]'); return f; })() });
  out['POST z obcym Origin'] = { status: r.status, body: (await r.text()).slice(0, 120) };
  fs.writeFileSync('ev/server-action-tests.json', JSON.stringify(out, null, 2));
  for (const [k, v] of Object.entries(out)) console.log(k, '=>', JSON.stringify(v).slice(0, 200));
  await b.close();
})();
