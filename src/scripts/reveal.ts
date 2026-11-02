// Section entrances.
//
// [data-reveal]          fades and rises a few pixels the first time it enters
//                        the viewport. Inside [data-reveal-group] the children
//                        are staggered.
// [data-render]          titles and labels "render" in once they are well in
//                        view: characters appear in a loose left-to-right sweep,
//                        hold in orange for a moment (some start as a small
//                        orange pixel), then snap to their normal colour. When
//                        it is done the original markup is put back untouched.
// [data-render-step]     same effect, replayed every time its [data-step]
//                        becomes active (3D section titles).
//
// Rendering waits for the web font, so lines never reflow mid-effect (a title
// set in the fallback font can wrap onto an extra line, then jump back).
// Content is only hidden once this script runs, so nothing is lost without
// JavaScript. Reduced motion: fade only, no render effect.

const REVEAL_STAGGER_MS = 70;
const RENDER_START_MS = 100;
const CHAR_STEP_MS = 22;
const MAX_SWEEP_MS = 700;
const CHAR_JITTER_MS = 200;
const CHAR_MS = 700;
const BLOCK_CHANCE = 0.12;

type RenderEl = HTMLElement & { __original?: string; __busy?: boolean };

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
        prepare(el);
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

/** Wraps every character in a span (words kept together) and keeps the original markup. */
function prepare(el: RenderEl) {
  if (el.__busy || el.dataset.renderReady !== undefined) return;
  const original = el.innerHTML;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  const count = nodes.reduce((n, t) => n + (t.textContent ?? '').replace(/\s+/g, '').length, 0);
  const step = Math.min(CHAR_STEP_MS, MAX_SWEEP_MS / Math.max(count, 1));

  let index = 0;
  for (const node of nodes) {
    const text = node.textContent ?? '';
    if (!text.trim()) continue;
    // One inline wrapper per text node, so flex/grid parents (labels, eyebrows)
    // still see a single item and keep the spaces between words.
    const frag = document.createElement('span');
    frag.className = 'rt';
    for (const part of text.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(part);
        continue;
      }
      const word = document.createElement('span');
      word.className = 'rw';
      for (const ch of part) {
        const span = document.createElement('span');
        span.className = Math.random() < BLOCK_CHANCE ? 'rc rc--block' : 'rc';
        span.textContent = ch;
        const delay = RENDER_START_MS + index * step + Math.random() * CHAR_JITTER_MS;
        span.style.setProperty('--d', `${Math.round(delay)}ms`);
        word.append(span);
        index++;
      }
      frag.append(word);
    }
    node.replaceWith(frag);
  }

  el.dataset.renderReady = '';
  el.dataset.renderTotal = String(RENDER_START_MS + index * step + CHAR_JITTER_MS + CHAR_MS);
  el.classList.add('render');
  el.__original = original;
}

function play(el: RenderEl) {
  if (el.__busy || el.dataset.renderReady === undefined) return;
  el.__busy = true;
  // The keyframes end without a colour, so each character returns to its own
  // colour (black, white on video, theme-scrubbed in Solutions).
  el.classList.add('render--go');
  const total = Number(el.dataset.renderTotal || 0) + 60;
  window.setTimeout(() => {
    if (el.__original !== undefined) el.innerHTML = el.__original;
    el.classList.remove('render', 'render--go');
    delete el.dataset.renderReady;
    el.__busy = false;
  }, total);
}
