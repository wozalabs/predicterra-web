// Section entrances.
//
// [data-reveal]          fades and rises a few pixels the first time it enters
//                        the viewport. Inside [data-reveal-group] the children
//                        are staggered.
// [data-render]          titles and labels are typed in once they are well in
//                        view, like a terminal: the original letters appear one
//                        at a time, left to right, at a constant rate, behind a
//                        thin orange caret that blinks twice at the end and goes
//                        away. Text keeps its own colour throughout. When it is
//                        done the original markup is put back untouched.
// [data-render-step]     same effect, replayed every time its [data-step]
//                        becomes active (3D section titles).
//
// Rendering waits for the web font, so lines never reflow mid-effect (a title
// set in the fallback font can wrap onto an extra line, then jump back).
// Content is only hidden once this script runs, so nothing is lost without
// JavaScript. Reduced motion: fade only, no render effect.

const REVEAL_STAGGER_MS = 70;
const RENDER_START_MS = 100;
const CHAR_STEP_MS = 24;
const MAX_SWEEP_MS = 750;
/** Caret blinks at the end of the line before disappearing. */
const CARET_TAIL_MS = 800;

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
        span.className = 'rc';
        span.textContent = ch;
        word.append(span);
      }
      frag.append(word);
    }
    node.replaceWith(frag);
  }

  el.style.setProperty('--rstep', `${Math.round(step)}ms`);
  el.dataset.renderReady = '';
  el.classList.add('render');
  el.__original = original;
}

function play(el: RenderEl) {
  if (el.__busy || el.dataset.renderReady === undefined) return;
  el.__busy = true;

  // Letters and caret are driven from one clock, so the caret always sits
  // exactly after the newest letter (no frame where it is missing or doubled).
  const chars = Array.from(el.querySelectorAll<HTMLElement>('.rc'));
  const step = parseFloat(el.style.getPropertyValue('--rstep')) || CHAR_STEP_MS;
  const caret = document.createElement('span');
  caret.className = 'render-caret';
  caret.setAttribute('aria-hidden', 'true');
  const restorePosition = getComputedStyle(el).position === 'static';
  if (restorePosition) el.style.position = 'relative';
  el.append(caret);
  el.classList.add('render--go');

  const finish = () => {
    if (el.__original !== undefined) el.innerHTML = el.__original;
    el.classList.remove('render', 'render--go');
    el.style.removeProperty('--rstep');
    if (restorePosition) el.style.removeProperty('position');
    delete el.dataset.renderReady;
    el.__busy = false;
  };

  const t0 = performance.now() + RENDER_START_MS;
  let shown = 0;
  const frame = (now: number) => {
    const n = Math.max(0, Math.min(chars.length, Math.floor((now - t0) / step) + 1));
    for (; shown < n; shown++) chars[shown].style.opacity = '1';
    if (n > 0) {
      const base = el.getBoundingClientRect();
      const r = chars[n - 1].getBoundingClientRect();
      caret.style.height = `${r.height * 0.74}px`;
      caret.style.transform = `translate(${r.right - base.left + 1}px, ${r.top - base.top + r.height * 0.16}px)`;
      caret.style.opacity = '1';
    }
    if (n < chars.length) {
      requestAnimationFrame(frame);
    } else {
      caret.classList.add('render-caret--blink');
      window.setTimeout(finish, CARET_TAIL_MS);
    }
  };
  requestAnimationFrame(frame);
}
