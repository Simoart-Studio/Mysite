'use client';

/**
 * Izoluje element jak okno modalne: wszystko poza nim (rodzeństwo na każdym poziomie aż do <body>)
 * dostaje `inert` — bez fokusu, klików i czytnika ekranu. Zwraca funkcję przywracającą stan.
 * Elementy, które były `inert` już wcześniej, zostają nietknięte.
 */
export function isolate(el: HTMLElement) {
  const touched: HTMLElement[] = [];
  let node: HTMLElement | null = el;
  while (node && node !== document.body) {
    const parent: HTMLElement | null = node.parentElement;
    if (!parent) break;
    for (const sib of Array.from(parent.children)) {
      if (sib === node || !(sib instanceof HTMLElement) || sib.inert) continue;
      if (sib.tagName === 'SCRIPT' || sib.tagName === 'STYLE') continue;
      sib.inert = true;
      touched.push(sib);
    }
    node = parent;
  }
  return () => touched.forEach((s) => { s.inert = false; });
}
