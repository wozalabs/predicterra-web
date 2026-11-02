// Section entrances.
//
// [data-reveal]          fades and rises a few pixels the first time it enters
//                        the viewport. Inside [data-reveal-group] the children
//                        are staggered.
// [data-render]          titles and labels render in once they are well in
//                        view: characters appear in a loose left-to-right sweep,
//                        hold in orange for a moment (a few start as a small
//                        orange pixel), then snap to their normal colour.
// [data-render-step]     same effect, replayed every time its [data-step]
//                        becomes active (3D section titles).
//
// No layout shift:
// - the text is split into character spans once, while it is still hidden,
//   and the spans stay; the markup is never swapped back afterwards (that swap
//   re-shapes the line and nudges the glyphs at the very end);
// - only opacity and colour animate, and the pixels are absolutely positioned;
// - splitting waits for the web font, so a title never shows in the fallback
//   font on an extra line and then jumps back.
// Content is only hidden once this script runs, so nothing is lost without
// JavaScript. Reduced motion: fade only, no render effect.

const REVEAL_STAGGER_MS = 70;
const RENDER_START_MS = 100;
const CHAR_STEP_MS = 22;
const MAX_SWEEP_MS = 700;
const CHAR_JITTER_MS = 200;
const CHAR_MS = 700;
const BLOCK_CHANCE = 0.12;

type RenderEl = HTMLElement & { __busy?: boolean; __timer?: number };

export function mountReveal() {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Stagger index for grouped items.
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => el.style.setProperty('--ri', String(i)));
  });

  const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  const renders = reduce ? [] : Array.from(document.querySelectorAll<RenderEl>('[data-render], [data-render-step]'));
  renders.forEach(prepare);
  root.classList.add('js-reveal');
  root.classList.remove('js-render-wait');

  const revealIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        revealIO.unobserve(e.target);
        reveal(e.target as HTMLElement);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  reveals.forEach((el) => revealIO.observe(el));

  if (reduce) return;

  // Renders start a little later than reveals, once the text is properly in view.
  const renderIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        renderIO.unobserve(e.target);
        play(e.target as RenderEl);
      }
    },
    { rootMargin: '0px 0px -16% 0px', threshold: 0.6 },
  );

  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  fontsReady.then(() => {
    renders.forEach((el) => {
      // Step titles: the first one plays on entry, the others when their step activates.
      const step = el.closest<HTMLElement>('[data-step]');
      if (el.hasAttribute('data-render-step') && step && !step.hasAttribute('data-active')) return;
      renderIO.observe(el);
    });
  });

  // Replay on 3D step changes.
  const steps = new Set(
    renders.map((el) => (el.hasAttribute('data-render-step') ? el.closest<HTMLElement>('[data-step]') : null)).filter(Boolean),
  ) as Set<HTMLElement>;
  const mo = new MutationObserver((records) => {
    for (const r of records) {
      const step = r.target as HTMLElement;
      if (!step.hasAttribute('data-active')) continue;
      step.querySelectorAll<RenderEl>('[data-render-step]').forEach((el) => {
        renderIO.unobserve(el);
        play(el);
      });
    }
  });
  steps.forEach((step) => mo.observe(step, { attributes: true, attributeFilter: ['data-active'] }));
}

/** Plays the entrance once, then drops the hooks so later transitions are untouched. */
function reveal(el: HTMLElement) {
  el.classList.add('is-in');
  const delay = Number(el.style.getPropertyValue('--ri') || 0) * REVEAL_STAGGER_MS;
  window.setTimeout(() => {
    el.removeAttribute('data-reveal');
    el.classList.remove('is-in');
    el.style.removeProperty('--ri');
  }, delay + 1000);
}

/** Splits the text into character spans, once. Words stay together. */
function prepare(el: RenderEl) {
  if (el.dataset.renderSplit !== undefined) return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    const text = node.textContent ?? '';
    if (!text.trim()) continue;
    // One inline wrapper per text node, so flex/grid parents (labels, eyebrows)
    // still see a single item and keep the spaces between words.
    const wrap = document.createElement('span');
    wrap.className = 'rt';
    for (const part of text.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        wrap.append(part);
        continue;
      }
      const word = document.createElement('span');
      word.className = 'rw';
      for (const ch of part) {
        const span = document.createElement('span');
        span.className = 'rc';
        span.textContent = ch;
        word.append(span);
      }
      wrap.append(word);
    }
    node.replaceWith(wrap);
  }
  el.dataset.renderSplit = '';
  el.classList.add('render');
}

/** New random order (and pixel picks) for each play. */
function shuffle(el: RenderEl) {
  const chars = Array.from(el.querySelectorAll<HTMLElement>('.rc'));
  const step = Math.min(CHAR_STEP_MS, MAX_SWEEP_MS / Math.max(chars.length, 1));
  chars.forEach((span, i) => {
    span.classList.toggle('rc--block', Math.random() < BLOCK_CHANCE);
    span.style.setProperty('--d', `${Math.round(RENDER_START_MS + i * step + Math.random() * CHAR_JITTER_MS)}ms`);
  });
  return RENDER_START_MS + chars.length * step + CHAR_JITTER_MS + CHAR_MS;
}

function play(el: RenderEl) {
  if (el.dataset.renderSplit === undefined) prepare(el);
  window.clearTimeout(el.__timer);
  // Restart cleanly if it is replayed (3D steps): hide, reshuffle, go.
  el.classList.remove('render--go');
  el.classList.add('render');
  const total = shuffle(el);
  void el.offsetWidth;
  el.classList.add('render--go');
  // The keyframes end without a colour, so each character returns to its own
  // colour (black, white on video, theme-scrubbed in Solutions). The spans stay.
  el.__timer = window.setTimeout(() => {
    el.classList.remove('render', 'render--go');
  }, total + 60);
}
