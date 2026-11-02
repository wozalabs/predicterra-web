// Section entrances.
//
// [data-reveal]        fades and rises a few pixels the first time it enters
//                      the viewport. Inside [data-reveal-group] the children
//                      are staggered.
// [data-render]        titles "render" in: characters appear in a loose
//                      left-to-right sweep, briefly in orange (some as a solid
//                      pixel first), then settle to their normal colour. When
//                      it is done the original markup is put back untouched.
//
// Content is only hidden once this script runs (html.js-reveal), so nothing
// is lost without JavaScript. Reduced motion: fade only, no render effect.

const REVEAL_STAGGER_MS = 70;
const CHAR_STEP_MS = 16;
const CHAR_JITTER_MS = 200;
const CHAR_MS = 720;
const BLOCK_CHANCE = 0.12;

export function mountReveal() {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Stagger index for grouped items.
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => el.style.setProperty('--ri', String(i)));
  });

  const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  const renders = reduce ? [] : Array.from(document.querySelectorAll<HTMLElement>('[data-render]'));
  renders.forEach(prepare);
  root.classList.add('js-reveal');

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        if (el.hasAttribute('data-render')) play(el);
        if (el.hasAttribute('data-reveal')) reveal(el);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  [...reveals, ...renders].forEach((el) => io.observe(el));
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
function prepare(el: HTMLElement) {
  if (el.dataset.renderReady) return;
  const original = el.innerHTML;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  let index = 0;
  for (const node of nodes) {
    const text = node.textContent ?? '';
    if (!text.trim()) continue;
    const frag = document.createDocumentFragment();
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
        const delay = index * CHAR_STEP_MS + Math.random() * CHAR_JITTER_MS;
        span.style.setProperty('--d', `${Math.round(delay)}ms`);
        word.append(span);
        index++;
      }
      frag.append(word);
    }
    node.replaceWith(frag);
  }

  el.dataset.renderReady = '';
  el.dataset.renderTotal = String(index * CHAR_STEP_MS + CHAR_JITTER_MS + CHAR_MS);
  el.classList.add('render');
  (el as HTMLElement & { __original?: string }).__original = original;
}

function play(el: HTMLElement) {
  // The keyframes end without a colour, so each character eases back to its
  // own colour (black, white on the CTA accent, theme-scrubbed in Solutions).
  el.classList.add('render--go');
  const total = Number(el.dataset.renderTotal || 0) + 60;
  window.setTimeout(() => {
    const original = (el as HTMLElement & { __original?: string }).__original;
    if (original !== undefined) el.innerHTML = original;
    el.classList.remove('render', 'render--go');
  }, total);
}
