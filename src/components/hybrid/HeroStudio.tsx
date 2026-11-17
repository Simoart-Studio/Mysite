'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Dices, RotateCcw, Shuffle, X } from 'lucide-react';
import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import { Dust } from '@/components/Dust/Dust';
import { DICE } from '@/components/concept/palette';
import { Die, DieBody, type DieLook, type Material } from './Die';
import { Peeker } from './Peeker';
import { box, dieFlight, flipFrames, DIE_MS, FALL, LAND, type Box } from './heroFlight';
import { prefersReducedMotion } from '@/components/concept/useScrollProgress';
import { lockScroll } from '@/lib/scrollLock';
import { isolate } from '@/lib/isolate';
import { Worker } from './Worker';
import styles from './HeroStudio.module.scss';

const LETTERS = ['S', 'I', 'M', 'O', 'A', 'R', 'T'] as const;
const MATERIALS: { id: Material; label: string }[] = [
  { id: 'mat', label: 'Mat' },
  { id: 'glass', label: 'Szkło' },
  { id: 'neon', label: 'Neon' },
  { id: 'chrome', label: 'Chrom' },
];
const COLOR_NAMES: Record<string, string> = {
  '#EF5B4C': 'Czerwony', '#F4B740': 'Żółty', '#3DB3A2': 'Turkusowy', '#9B6BD6': 'Fioletowy',
  '#F58A3A': 'Pomarańczowy', '#3E7FE0': 'Niebieski', '#86C24A': 'Zielony',
};

const START: DieLook = { color: '#3DB3A2', material: 'mat', radius: 14, letter: 'S' };

/* Wzory do odtworzenia — zabawa: zrób kostkę taką jak na wzorze */
const TARGETS: DieLook[] = [
  { color: '#F58A3A', material: 'mat', radius: 20, letter: 'A' },
  { color: '#3E7FE0', material: 'glass', radius: 10, letter: 'R' },
  { color: '#9B6BD6', material: 'neon', radius: 22, letter: 'O' },
  { color: '#EF5B4C', material: 'chrome', radius: 6, letter: 'S' },
  { color: '#86C24A', material: 'mat', radius: 26, letter: 'T' },
];

type Snap = { h1: Box; lead: Box; actions: Box; line: Box; font: number };

/** Rozmiar czcionki tak, jak go widać — z uwzględnieniem skali trwającej animacji. */
function visualFont(el: HTMLElement) {
  const cs = getComputedStyle(el);
  const m = cs.transform === 'none' ? null : new DOMMatrixReadOnly(cs.transform);
  return parseFloat(cs.fontSize) * (m ? Math.hypot(m.a, m.b) : 1);
}

/** Pierwsza linia nagłówka — tam ląduje kostka. */
function firstLine(h1: HTMLElement): Box {
  const r = document.createRange();
  r.selectNodeContents(h1);
  const first = Array.from(r.getClientRects()).find((x) => x.width > 4);
  return box(first ?? h1.getBoundingClientRect());
}

function score(a: DieLook, t: DieLook) {
  const r = Math.max(0, 1 - Math.max(0, Math.abs(a.radius - t.radius) - 2) / 18);
  return Math.round(
    (a.letter === t.letter ? 30 : 0) + (a.color === t.color ? 25 : 0) + (a.material === t.material ? 25 : 0) + r * 20,
  );
}

export function HeroStudio() {
  const [open, setOpen] = useState(false);
  const [used, setUsed] = useState(false);
  const [look, setLook] = useState<DieLook>(START);
  const [roll, setRoll] = useState(0);
  const [goal, setGoal] = useState(0);
  const [compact, setCompact] = useState(false);
  const section = useRef<HTMLElement>(null);
  const panel = useRef<HTMLElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const compactRef = useRef(false);

  // Wąski ekran: pracownia jako arkusz od dołu nad przygaszonym hero (zamiast panelu bocznego)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    const sync = () => { compactRef.current = mq.matches; setCompact(mq.matches); };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const sheet = open && compact;

  const target = TARGETS[goal % TARGETS.length]!;
  const match = score(look, target);
  const won = match >= 100;

  const h1 = useRef<HTMLHeadingElement>(null);
  const lead = useRef<HTMLParagraphElement>(null);
  const actions = useRef<HTMLDivElement>(null);
  const flyer = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const isOpen = useRef(false);
  const snap = useRef<Snap | null>(null);
  const anims = useRef<Animation[]>([]);

  const set = (patch: Partial<DieLook>) => setLook((l) => ({ ...l, ...patch }));

  /* Zmiana stanu: najpierw zdjęcie geometrii (tak jak ją widać, także w trakcie animacji), potem przełączenie */
  const toggle = useCallback((v: boolean) => {
    setUsed(true);
    if (v === isOpen.current) return;
    isOpen.current = v;
    const a = h1.current, b = lead.current, c = actions.current;
    snap.current = a && b && c && !prefersReducedMotion()
      ? { h1: box(a.getBoundingClientRect()), lead: box(b.getBoundingClientRect()), actions: box(c.getBoundingClientRect()), line: firstLine(a), font: visualFont(a) }
      : null;
    anims.current.forEach((x) => x.cancel());
    anims.current = [];
    setOpen(v);
  }, []);

  // Po przełączeniu układu (przed odmalowaniem): kostka spada na nagłówek, a ten po uderzeniu maleje
  useLayoutEffect(() => {
    const old = snap.current;
    snap.current = null;
    const a = h1.current, b = lead.current, c = actions.current;
    // arkusz na telefonie: jego wysokość wyznacza strefę kostki — musi być znana przed pomiarem miejsca lądowania
    const sec = section.current, pn = panel.current;
    if (open && compactRef.current && sec && pn) sec.style.setProperty('--sheet', `${pn.offsetHeight}px`);
    if (!old || !a || !b || !c) return;
    const run = (el: Element, frames: Keyframe[], ms: number, delay = 0) => {
      anims.current.push(el.animate(frames, { duration: ms, delay, fill: 'backwards', easing: 'linear' }));
    };
    const hitAt = open ? FALL * 1000 : 0;
    const f1 = flipFrames(old.h1, box(a.getBoundingClientRect()), { k: old.font / parseFloat(getComputedStyle(a).fontSize), dent: open ? 9 : 0 });
    const f2 = flipFrames(old.lead, box(b.getBoundingClientRect()));
    const f3 = flipFrames(old.actions, box(c.getBoundingClientRect()));
    run(a, f1.frames, f1.ms, hitAt);
    run(b, f2.frames, f2.ms, hitAt + 40);
    run(c, f3.frames, f3.ms, hitAt + 80);

    const fl = flyer.current, grab = fl?.querySelector('[role="img"]');
    if (!open || !fl || !grab) return;
    const fr = fl.getBoundingClientRect();
    const cx = fr.left + fr.width / 2, cy = fr.top + fr.height / 2;
    const half = grab.getBoundingClientRect().width / 2;
    // styk: spód kostki na wierzchu liter pierwszej linii, w jej lewej części — odbicie w lewo
    const contact = { x: old.line.left + old.line.width * 0.3 - cx, y: old.line.top + old.line.height * 0.2 - cy };
    const hit = { x: contact.x, y: contact.y - half };
    run(fl, dieFlight(hit, half, window.innerHeight, -cy - half * 3), DIE_MS);
    const r = ring.current;
    if (r) {
      const at = `translate(${contact.x}px, ${contact.y}px) translate(-50%, -50%)`;
      anims.current.push(r.animate(
        [{ opacity: 0.95, transform: `${at} scale(0.25)` }, { opacity: 0, transform: `${at} scale(1.9)` }],
        { duration: 650, delay: hitAt, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' },
      ));
    }
  }, [open]);

  useEffect(() => () => anims.current.forEach((x) => x.cancel()), []);

  // Telefon: tylko zabawa — przewijanie zablokowane, reszta strony bez fokusu i klików
  useEffect(() => {
    const el = section.current, pn = panel.current;
    if (!sheet || !el || !pn) return;
    const unlock = lockScroll();
    const restore = isolate(el);
    document.documentElement.dataset.studio = '';
    const ro = new ResizeObserver(() => el.style.setProperty('--sheet', `${pn.offsetHeight}px`));
    ro.observe(pn);
    return () => { ro.disconnect(); restore(); unlock(); delete document.documentElement.dataset.studio; };
  }, [sheet]);

  // Po zamknięciu fokus wraca na to, czym pracownię otwarto — dopiero po odmalowaniu, gdy ikona nie jest już inert
  const refocus = useRef(false);
  const close = useCallback(() => { refocus.current = true; toggle(false); }, [toggle]);
  useEffect(() => {
    if (open || !refocus.current) return;
    refocus.current = false;
    (compactRef.current ? trigger.current : handle.current)?.focus({ preventScroll: true });
  }, [open]);

  // Pracownia zamyka się sama, gdy hero zniknie z ekranu
  useEffect(() => {
    const el = section.current;
    if (!el || !open) return;
    const io = new IntersectionObserver(([e]) => { if (e && e.intersectionRatio < 0.2) toggle(false); }, { threshold: [0, 0.2] });
    io.observe(el);
    return () => io.disconnect();
  }, [open, toggle]);

  // Esc zamyka pracownię i oddaje fokus uchwytowi
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
    <section ref={section} id="top" className={[styles.hero, open && styles.open, sheet && styles.sheet, won && styles.won].filter(Boolean).join(' ')} aria-labelledby="hero-h1">
      {/* telefon: przygaszone hero pod arkuszem pracowni; klik obok zamyka */}
      <div className={styles.scrim} aria-hidden="true" onClick={close} />
      <div className={styles.layout}>
        <div className={styles.dieCol} aria-hidden={!open}>
          {open && (
            <div className={styles.dieDrop} style={{ '--c': look.color } as React.CSSProperties}>
              <span ref={ring} className={styles.hitRing} />
              <div ref={flyer} className={styles.flyer}>
                <span className={styles.glow} />
                <span className={styles.impact} style={{ animationDelay: `${LAND - 0.02}s` }} />
                <Die look={look} roll={roll} size="var(--die-size)" />
                {won && (
                  <span className={styles.confetti}>
                    {Array.from({ length: 22 }, (_, i) => (
                      <i key={i} style={{ '--a': `${(i / 22) * 360}deg`, '--c': DICE[i % DICE.length], '--d': `${0.9 + (i % 5) * 0.12}` } as React.CSSProperties} />
                    ))}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.copy} inert={sheet || undefined}>
          {/* telefon: pracownia jako mała ikona nad nagłówkiem — wyskakuje z dziury wywierconej przez robotnika */}
          <span className={styles.triggerWrap}>
          {!used && !open && <Worker />}
          <button
            ref={trigger}
            type="button"
            className={styles.trigger}
            aria-expanded={open}
            aria-controls="studio-panel"
            aria-label="Otwórz pracownię kostki"
            onClick={() => toggle(true)}
          >
            <Dices size={20} strokeWidth={1.8} aria-hidden="true" />
            {!used && <i className={styles.ping} aria-hidden="true" />}
          </button>
          </span>
          <h1 ref={h1} id="hero-h1" className={styles.h1}>
            Tworzymy spójną wizję, wizje tworzą <Dust>dzieło.</Dust>
          </h1>
          <p ref={lead} className={styles.lead}>Strony, sklepy i aplikacje projektowane od pomysłu po wdrożenie.</p>
          <div ref={actions} data-hero-actions className={styles.actions}>
            <ContactTrigger className="btn btn--green">
              Porozmawiajmy
              <BtnIcon />
            </ContactTrigger>
            <a href="#works" className="btn btn--ghost">
              Projekty
              <BtnIcon dir="down" />
            </a>
          </div>
        </div>
      </div>

      {/*
        Uchwyt panelu bocznego + maskotka wskazująca na niego. Maskotka jest RODZEŃSTWEM przycisku, nie dzieckiem:
        tekst jej dymku nie może trafić do widocznej treści przycisku (zgodność etykiety z treścią, WCAG 2.5.3).
        Wspólne położenie, przesunięcie przy najechaniu i odjazd przy otwarciu ma opakowanie.
      */}
      <div className={`${styles.handleWrap} peek-host`}>
      <button
        ref={handle}
        type="button"
        className={styles.handle}
        aria-expanded={open}
        aria-controls="studio-panel"
        aria-label="Pracownia: zaprojektuj własną kostkę"
        onClick={() => toggle(true)}
      >
        <Dices size={22} strokeWidth={1.8} />
        <span className={styles.handleText}>Pracownia</span>
      </button>
      {/* maskotka zza pudełka: do pierwszego otwarcia; przy otwieraniu chowa się razem z odjeżdżającym uchwytem */}
      {(!used || open) && <Peeker away={open} />}
      </div>

      <aside
        ref={panel}
        id="studio-panel"
        className={styles.panel}
        role={sheet ? 'dialog' : undefined}
        aria-modal={sheet || undefined}
        aria-label="Pracownia kostki"
        inert={!open || undefined}
        aria-hidden={!open}
      >
        <header className={styles.pHead}>
          <span className={styles.pTitle}><Dices size={18} /> Pracownia</span>
          <button type="button" className={styles.icon} aria-label="Zamknij pracownię" onClick={close}>
            <X size={18} />
          </button>
        </header>

        <div className={styles.goal}>
          <span className={styles.goalDie}><DieBody look={target} size="var(--goal-die)" /></span>
          <span className={styles.goalInfo}>
            <span className={styles.goalLabel}>Zrób taką kostkę</span>
            <span className={styles.meter} aria-hidden="true"><i style={{ transform: `scaleX(${match / 100})` }} /></span>
          </span>
          <span className={styles.pct} aria-live="polite">{match}%</span>
          <button type="button" className={styles.icon} aria-label="Nowy wzór" onClick={() => setGoal((g) => g + 1)}>
            <Shuffle size={15} />
          </button>
        </div>

        <fieldset className={styles.group}>
          <legend>Kolor</legend>
          <span className={styles.swatches}>
            {DICE.map((c) => (
              <button
                key={c}
                type="button"
                className={styles.swatch}
                style={{ '--sw': c } as React.CSSProperties}
                aria-label={COLOR_NAMES[c]}
                aria-pressed={look.color === c}
                onClick={() => set({ color: c })}
              />
            ))}
          </span>
        </fieldset>

        <fieldset className={styles.group}>
          <legend>Materiał</legend>
          <span className={styles.materials}>
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={styles.material}
                data-m={m.id}
                style={{ '--c': look.color } as React.CSSProperties}
                aria-pressed={look.material === m.id}
                onClick={() => set({ material: m.id })}
              >
                <i />
                {m.label}
              </button>
            ))}
          </span>
        </fieldset>

        <fieldset className={styles.group}>
          <legend>Litera</legend>
          <span className={styles.keys}>
            {LETTERS.map((l) => (
              <button key={l} type="button" className={styles.key} aria-pressed={look.letter === l} onClick={() => set({ letter: l })}>
                {l}
              </button>
            ))}
          </span>
        </fieldset>

        <label className={`${styles.group} ${styles.range}`}>
          <span className={styles.legend}>Zaokrąglenie</span>
          <input type="range" min={0} max={28} step={1} value={look.radius} onChange={(e) => set({ radius: +e.target.value })} />
        </label>

        <div className={styles.pActions}>
          <button type="button" className="btn btn--green" onClick={() => setRoll((r) => r + 1)}>
            Rzuć kostką
            <span className="btn__icon"><Dices size={18} /></span>
          </button>
          <button type="button" className={styles.icon} aria-label="Przywróć" onClick={() => setLook(START)}>
            <RotateCcw size={16} />
          </button>
        </div>

        {won && (
          <div className={styles.win}>
            <p>Idealna kopia. Masz oko do detali.</p>
            <ContactTrigger className="btn btn--green">
              Zaprojektujmy coś razem
              <BtnIcon />
            </ContactTrigger>
          </div>
        )}
      </aside>
    </section>
  );
}
