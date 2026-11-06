// Passive production check: cookies, storage and third-party requests before any consent.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await b.newContext(); const p = await ctx.newPage();
  const hosts = new Map();
  p.on('request', r => { const u = new URL(r.url()); hosts.set(u.host + (u.pathname.startsWith('/_vercel') ? ' ' + u.pathname.split('/').slice(0, 3).join('/') : ''), (hosts.get(u.host) || 0) + 1); });
  await p.goto('https://sp-flow.vercel.app/', { waitUntil: 'networkidle' });
  await p.mouse.wheel(0, 3000); await p.waitForTimeout(3000);
  console.log('cookies:', JSON.stringify(await ctx.cookies()));
  console.log('localStorage:', await p.evaluate(() => JSON.stringify(Object.keys(localStorage))), 'sessionStorage:', await p.evaluate(() => JSON.stringify(Object.keys(sessionStorage))));
  console.log('request hosts:', [...hosts.keys()].join(', '));
  const html = await (await p.request.get('https://sp-flow.vercel.app/')).text();
  console.log('mixed content http:// src:', (html.match(/(src|href)="http:\/\/[^"]+/g) || []).slice(0, 5));
  console.log('sourcemaps referenced:', /sourceMappingURL/.test(html));
  const js = [...html.matchAll(/\/_next\/static\/chunks\/[^"]+\.js/g)].map(m => m[0]).slice(0, 3);
  for (const j of js) { const r = await p.request.get('https://sp-flow.vercel.app' + j + '.map'); console.log('map', j.slice(-30), r.status()); }
  await b.close();
})();
