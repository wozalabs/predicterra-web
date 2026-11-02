// Section entrances.
//
// [data-reveal]          fades and rises a few pixels the first time it enters
//                        the viewport. Inside [data-reveal-group] the children
//                        are staggered.
// [data-render]          titles and labels fade in once they are well in view.
// [data-render-step]     same fade, replayed every time its [data-step]
//                        becomes active (3D section titles).
//
// Only opacity animates, so nothing moves. Fading waits for the web font, so a
// title never shows in the fallback font first. Content is only hidden once
// this script runs, so nothing is lost without JavaScript. Reduced motion:
// titles simply appear.

const REVEAL_STAGGER_MS = 70;
const RENDER_MS = 600;

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

/** Hides the text until it plays. */
function prepare(el: RenderEl) {
  el.classList.add('render');
}

function play(el: RenderEl) {
  window.clearTimeout(el.__timer);
  // Restart cleanly when replayed (3D steps).
  el.classList.remove('render--go');
  el.classList.add('render');
  void el.offsetWidth;
  el.classList.add('render--go');
  el.__timer = window.setTimeout(() => el.classList.remove('render', 'render--go'), RENDER_MS + 100);
}
