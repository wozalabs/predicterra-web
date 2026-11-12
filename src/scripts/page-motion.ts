/**
 * Scroll-driven moments for the inner pages. Every one has a static layout
 * without JavaScript or with reduced motion; the script only upgrades it.
 *
 * [data-lit]        statement lit word by word as it scrolls in (words: .w)
 * [data-progress]   writes --p (0 → 1) while the element crosses the viewport
 * [data-hscroll]    pinned stage whose track ([data-hs-track]) moves sideways;
 *                   [data-hs-bar] follows the active column's [data-span]
 * [data-stepper]    pinned stage that walks through its [data-step-item]s
 * [data-spy]        marks the item nearest the middle of the viewport, and the
 *                   matching [data-spy-node] (same index) inside the container
 */
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
  const wide = window.matchMedia('(min-width: 64rem)');

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

  // Statements lit word by word.
  document.querySelectorAll<HTMLElement>('[data-lit]').forEach((lit) => {
    const words = Array.from(lit.querySelectorAll<HTMLElement>('.w'));
    if (!words.length) return;
    lit.parentElement?.classList.add('lit-on');
    whileNear(lit, () => {
      const vh = window.innerHeight;
      const top = lit.getBoundingClientRect().top;
      const p = clamp01((vh * 0.9 - top) / (vh * 0.55));
      const on = p * words.length;
      words.forEach((w, i) => w.style.setProperty('--o', Math.min(1, Math.max(0.16, on - i + 0.16)).toFixed(3)));
    });
  });

  // Horizontal pinned tracks (wide screens only, and only if a column fits the screen).
  document.querySelectorAll<HTMLElement>('[data-hscroll]').forEach((sec) => {
    const stage = sec.querySelector<HTMLElement>('[data-hs-stage]')!;
    const track = sec.querySelector<HTMLElement>('[data-hs-track]')!;
    const cols = Array.from(track.children) as HTMLElement[];
    const bar = sec.querySelector<HTMLElement>('[data-hs-bar]');
    const spans = cols.map((c) => (c.dataset.span ?? '0,1').split(',').map(Number));
    const cover = sec.hasAttribute('data-hs-cover');
    let travel = 0;
    let on = false;

    const size = () => {
      sec.classList.remove('is-pinned');
      sec.style.height = '';
      track.style.transform = '';
      on = false;
      if (!wide.matches) return;
      sec.classList.add('is-pinned');
      const vh = window.innerHeight;
      // Too tall for the screen: keep the static grid.
      if (stage.scrollHeight > vh + 2) {
        sec.classList.remove('is-pinned');
        return;
      }
      travel = Math.max(0, track.scrollWidth - track.clientWidth);
      sec.style.height = `${vh + travel * 1.15 + (cover ? vh : 0)}px`;
      on = true;
    };

    const update = () => {
      if (!on) return;
      const vh = window.innerHeight;
      const span = sec.offsetHeight - vh - (cover ? vh : 0);
      const p = clamp01(-sec.getBoundingClientRect().top / Math.max(1, span));
      const n = cols.length;
      const pos = dwell(p * (n - 1 + 0.4) - 0.2, n, 0.3);
      track.style.transform = `translate3d(${(-travel * (pos / (n - 1))).toFixed(1)}px, 0, 0)`;
      const k = Math.min(n - 1, Math.round(pos));
      cols.forEach((c, i) => c.toggleAttribute('data-on', i === k));
      if (bar) {
        const a = Math.floor(pos);
        const b = Math.min(n - 1, a + 1);
        const t = pos - a;
        const lo = spans[a][0] + (spans[b][0] - spans[a][0]) * t;
        const hi = spans[a][1] + (spans[b][1] - spans[a][1]) * t;
        bar.style.setProperty('--lo', lo.toFixed(4));
        bar.style.setProperty('--hi', hi.toFixed(4));
      }
    };

    const refresh = () => (size(), update());
    document.fonts?.ready.then(refresh);
    refresh();
    wide.addEventListener('change', refresh);
    window.addEventListener('resize', refresh, { passive: true });
    whileNear(sec, update, '10% 0px');
  });

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
