/**
 * Figures count in as they come into view: every digit rolls up to its value
 * with a vertical motion blur, the digits on the left settling first. The
 * real digits stay in the layout (transparent) while the rolling strips sit
 * over them, so the figure never changes size; once settled the plain text
 * is put back. Prefixes, separators and units stay still. Reduced motion:
 * the figures are simply there.
 */
const FILTER_ID = 'odo-motion-blur';

function ensureFilter() {
  if (document.getElementById(FILTER_ID)) return;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  const filter = document.createElementNS(ns, 'filter');
  filter.id = FILTER_ID;
  filter.setAttribute('x', '-20%');
  filter.setAttribute('y', '-50%');
  filter.setAttribute('width', '140%');
  filter.setAttribute('height', '200%');
  const blur = document.createElementNS(ns, 'feGaussianBlur');
  blur.setAttribute('stdDeviation', '0 4');
  filter.append(blur);
  svg.append(filter);
  document.body.append(svg);
}

function roll(el: HTMLElement) {
  const text = el.textContent ?? '';
  const digits = [...text].filter((c) => /\d/.test(c)).length;
  if (!digits) return;
  ensureFilter();

  // Screen readers keep the real figure; the rolling copy is hidden from them.
  el.textContent = '';
  const sr = document.createElement('span');
  sr.className = 'visually-hidden';
  sr.textContent = text;
  const shown = document.createElement('span');
  shown.setAttribute('aria-hidden', 'true');
  el.append(sr, shown);

  const strips: { strip: HTMLElement; box: HTMLElement; i: number; len: number }[] = [];
  let i = 0;
  for (const c of text) {
    if (!/\d/.test(c)) {
      shown.append(c);
      continue;
    }
    const d = Number(c);
    const box = document.createElement('span');
    box.className = 'odo';
    const hold = document.createElement('span');
    hold.className = 'odo__d';
    hold.textContent = c;
    const strip = document.createElement('span');
    strip.className = 'odo__s';
    // One full turn ending on the digit (later digits turn once more).
    const turns = i >= digits - 2 ? 2 : 1;
    const len = turns * 10;
    for (let k = 1; k <= len; k++) {
      const s = document.createElement('span');
      s.textContent = String((d + k) % 10);
      strip.append(s);
    }
    box.append(hold, strip);
    shown.append(box);
    strips.push({ strip, box, i, len });
    i++;
  }

  let done = 0;
  for (const { strip, box, i, len } of strips) {
    const h = box.getBoundingClientRect().height;
    // A gap between the digits on the strip, so only one shows at a time.
    const gap = Math.round(h * 0.6);
    
    // Strip digits keep the figure's own line height, so they sit exactly where
    // the real digit does.
    strip.querySelectorAll<HTMLElement>('span').forEach((s) => (s.style.marginBottom = `${gap}px`));
    // Exact distance from the first digit on the strip to the last (laid out
    // positions, so rounding never adds up into an offset).
    const travel =
      (strip.lastElementChild as HTMLElement).getBoundingClientRect().top -
      (strip.firstElementChild as HTMLElement).getBoundingClientRect().top;
    const duration = 900 + i * 140;
    strip.style.filter = `url(#${FILTER_ID})`;
    const anim = strip.animate(
      [{ transform: 'translateY(0)' }, { transform: `translateY(${-travel}px)` }],
      { duration, easing: 'cubic-bezier(0.33, 1, 0.68, 1)', fill: 'forwards' },
    );
    // The blur eases off just before the digit settles.
    window.setTimeout(() => (strip.style.filter = ''), duration * 0.62);
    anim.onfinish = () => {
      if (++done === strips.length) el.textContent = text;
    };
  }
}

export function mountCount() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        roll(e.target as HTMLElement);
      }
    },
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));
}
