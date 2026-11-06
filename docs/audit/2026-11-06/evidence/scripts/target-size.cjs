const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const [dev, o] of [['desktop', { viewport: { width: 1280, height: 900 } }], ['mobile', devices['iPhone 13']]]) {
    const p = await (await b.newContext(o)).newPage();
    await p.goto('http://localhost:3200/', { waitUntil: 'networkidle' });
    const res = await p.evaluate(() => {
      const els = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea')].filter(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && !e.closest('[inert],[aria-hidden=true]'); });
      const rects = els.map(e => ({ e, r: e.getBoundingClientRect() }));
      const inline = e => { const p = e.parentElement; return getComputedStyle(e).display === 'inline' && p && /\S/.test([...p.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('')); };
      const fails = [];
      for (const { e, r } of rects) {
        if (r.width >= 24 && r.height >= 24) continue;
        if (inline(e) || e.closest('label')) continue;
        const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
        const bad = rects.some(o => { if (o.e === e) return false; const ox = Math.max(o.r.x, Math.min(cx, o.r.right)), oy = Math.max(o.r.y, Math.min(cy, o.r.bottom)); return Math.hypot(cx - ox, cy - oy) < 12; });
        if (bad) fails.push((e.getAttribute('aria-label') || e.textContent).trim().slice(0, 30) + ` ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      return fails;
    });
    console.log(dev, 'targets failing 2.5.8 (size and spacing):', res.length ? res.join(' | ') : 'none');
  }
  await b.close();
})();
