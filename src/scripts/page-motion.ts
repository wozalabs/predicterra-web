/**
 * Scroll-driven moments for the inner pages. Every one has a static layout
 * without JavaScript or with reduced motion; the script only upgrades it.
 *
 * [data-lit]        statement lit word by word as it scrolls in (words: .w)
 * [data-progress]   writes --p (0 → 1) while the element crosses the viewport
 * [data-stepper]    pinned stage that walks through its [data-step-item]s
 * [data-spy]        marks the item nearest the middle of the viewport, and the
 *                   matching [data-spy-node] (same index) inside the container
 */
import { mountLit } from './lit';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Calls `fn` on scroll (one rAF per frame) only while `el` is near the viewport. */
function whileNear(el: Element, fn: () => void, margin = '25% 0px') {
  let raf = 0;
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(() => ((raf = 0), fn()));
  };
  new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        window.addEventListener('scroll', onScroll, { passive: true });
        fn();
      } else window.removeEventListener('scroll', onScroll);
    },
    { rootMargin: margin },
  ).observe(el);
  window.addEventListener('resize', onScroll, { passive: true });
}

/** Position through n stops from raw progress, with a rest at each stop. */
function dwell(raw: number, n: number, rest = 0.35) {
  if (raw <= 0) return 0;
  const k = Math.min(n - 1, Math.floor(raw));
  return k >= n - 1 ? n - 1 : k + smooth(clamp01((raw - k - rest) / (1 - rest)));
}

export function mountPageMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Progress lines and drawings: complete straight away with reduced motion.
  document.querySelectorAll<HTMLElement>('[data-progress]').forEach((el) => {
    if (reduce) return el.style.setProperty('--p', '1');
    whileNear(el, () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp01((vh * 0.92 - r.top) / (Math.min(r.height, vh) * 0.55 + vh * 0.25));
      el.style.setProperty('--p', p.toFixed(3));
    });
  });

  // Section that follows the active item (sticky schema next to its rows).
  document.querySelectorAll<HTMLElement>('[data-spy]').forEach((box) => {
    const items = Array.from(box.querySelectorAll<HTMLElement>('[data-spy-item]'));
    const nodes = Array.from(box.querySelectorAll<HTMLElement>('[data-spy-node]'));
    let current = -1;
    whileNear(box, () => {
      const mid = window.innerHeight * 0.5;
      let best = 0;
      let dist = Infinity;
      items.forEach((it, i) => {
        const r = it.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < dist) ((dist = d), (best = i));
      });
      if (best === current) return;
      current = best;
      items.forEach((it, i) => it.toggleAttribute('data-on', i === best));
      nodes.forEach((n, i) => n.toggleAttribute('data-on', i === best));
    });
  });

  if (reduce) return;

  // Statements lit word by word (scripts/lit.ts).
  mountLit();

  // Pinned steppers: the stage holds while the steps take turns.
  document.querySelectorAll<HTMLElement>('[data-stepper]').forEach((sec) => {
    const items = Array.from(sec.querySelectorAll<HTMLElement>('[data-step-item]'));
    const n = items.length;
    const mq = window.matchMedia(sec.dataset.stepper || '(min-width: 48rem)');
    let on = false;
    const size = () => {
      on = mq.matches;
      sec.classList.toggle('is-pinned', on);
      sec.style.height = on ? `${window.innerHeight * (1 + n * 0.75)}px` : '';
      if (!on) items.forEach((it) => (it.removeAttribute('data-on'), it.removeAttribute('data-past')));
    };
    const update = () => {
      if (!on) return;
      const vh = window.innerHeight;
      const p = clamp01(-sec.getBoundingClientRect().top / Math.max(1, sec.offsetHeight - vh));
      const pos = dwell(p * (n - 1 + 0.5) - 0.15, n, 0.4);
      sec.style.setProperty('--p', (pos / (n - 1)).toFixed(4));
      const k = Math.round(pos);
      items.forEach((it, i) => {
        it.toggleAttribute('data-on', i === k);
        it.toggleAttribute('data-past', i < k);
      });
    };
    const refresh = () => (size(), update());
    refresh();
    mq.addEventListener('change', refresh);
    window.addEventListener('resize', refresh, { passive: true });
    whileNear(sec, update, '10% 0px');
  });
}
