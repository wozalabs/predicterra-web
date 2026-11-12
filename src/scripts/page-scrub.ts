/**
 * Inner pages: the whole page turns dark while a [data-dark] section is in view,
 * and light again as it leaves (the homepage's light → dark → light transition,
 * for any number of dark sections). `--d` (background) and `--dt` (text) are
 * written on the page wrapper (.pg.theme-scrub), which remixes the tokens for
 * everything inside. The header follows through [data-header-dark="scrub"].
 */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

export function mountPageScrub(root: HTMLElement) {
  const darks = Array.from(root.querySelectorAll<HTMLElement>('[data-dark]'));
  if (!darks.length) return;

  let raf = 0;
  let last = '';

  const update = () => {
    raf = 0;
    const vh = window.innerHeight;
    let raw = 0;
    for (const el of darks) {
      const r = el.getBoundingClientRect();
      const enter = clamp01((vh * 0.85 - r.top) / (vh * 0.45));
      const leave = clamp01((vh * 0.85 - r.bottom) / (vh * 0.45));
      raw = Math.max(raw, enter * (1 - leave));
    }
    const d = Math.round(smooth(raw) * 1000) / 1000;
    // Text flips quickly in the middle, never mid-grey on mid-grey for long.
    const dt = Math.round(smooth(clamp01((raw - 0.4) / 0.2)) * 1000) / 1000;
    const key = `${d}|${dt}`;
    if (key === last) return;
    last = key;
    const was = root.hasAttribute('data-is-dark');
    root.toggleAttribute('data-is-dark', dt > 0.5);
    if (was !== dt > 0.5) window.dispatchEvent(new Event('header:refresh'));
    root.style.setProperty('--d', String(d));
    root.style.setProperty('--dt', String(dt));
  };

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}
