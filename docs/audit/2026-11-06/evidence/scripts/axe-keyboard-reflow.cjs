// axe-core WCAG 2.2 AA scan + keyboard/a11y probes on local prod build.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const axeSrc = fs.readFileSync(__dirname + '/node_modules/axe-core/axe.min.js', 'utf8');
const out = {};
(async () => {
  const b = await chromium.launch();
  for (const [dev, opt] of [['desktop', { viewport: { width: 1280, height: 900 } }], ['mobile', devices['iPhone 13']]]) {
    for (const path of ['/', '/works', '/works/barberspace', '/polityka-prywatnosci', '/nie-istnieje']) {
      const p = await (await b.newContext(opt)).newPage();
      await p.goto('http://localhost:3200' + path, { waitUntil: 'networkidle' });
      // scroll through to trigger reveals
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await p.waitForTimeout(800);
      await p.addScriptTag({ content: axeSrc });
      const r = await p.evaluate(async () => await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
      out[`${dev} ${path}`] = r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, help: v.help, target: v.nodes.slice(0, 3).map(n => n.target.join(' ')) }));
      console.log(dev, path, 'violations:', r.violations.length, r.violations.map(v => `${v.id}(${v.impact},${v.nodes.length})`).join(', '));
      await p.close();
    }
  }
  // keyboard: tab order reaches main controls, focus visible
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await p.goto('http://localhost:3200/', { waitUntil: 'networkidle' });
  const seq = [];
  for (let i = 0; i < 45; i++) {
    await p.keyboard.press('Tab');
    seq.push(await p.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
      return { tag: e.tagName, label: (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 30), outline: cs.outlineStyle !== 'none' || cs.boxShadow !== 'none', w: Math.round(r.width), h: Math.round(r.height) }; }));
  }
  out.keyboard = seq;
  const small = seq.filter(s => s.w < 24 || s.h < 24);
  console.log('tab stops:', seq.length, 'without visible focus style:', seq.filter(s => !s.outline).map(s => s.label).join(' | ') || 'none', '| <24px targets:', small.map(s => s.label + ` ${s.w}x${s.h}`).join(' | ') || 'none');
  // 320px reflow
  const q = await (await b.newContext({ viewport: { width: 320, height: 640 } })).newPage();
  for (const path of ['/', '/works', '/polityka-prywatnosci']) {
    await q.goto('http://localhost:3200' + path, { waitUntil: 'networkidle' });
    const ov = await q.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log('320px', path, 'horizontal overflow px:', ov); out['reflow320 ' + path] = ov;
  }
  // headings
  await q.goto('http://localhost:3200/', { waitUntil: 'networkidle' });
  out.headings = await q.evaluate(() => [...document.querySelectorAll('h1,h2,h3')].map(h => h.tagName + ' ' + h.textContent.trim().slice(0, 40)));
  out.landmarks = await q.evaluate(() => ['header', 'nav', 'main', 'footer'].map(t => t + ':' + document.querySelectorAll(t).length));
  console.log('h1 count:', out.headings.filter(h => h.startsWith('H1')).length, '| landmarks:', out.landmarks.join(' '));
  fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 2));
  await b.close();
})();
