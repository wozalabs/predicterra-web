/**
 * Scroll-linked light → dark → light transition around the dark Solutions section.
 *
 * Darkness d (0..1) rises while Solutions slides in over the 3D stage and falls
 * again while Benefits comes in, so the whole viewport changes theme together
 * instead of showing a hard edge. `--d` (background) and `--dt` (text) are written
 * on every `.theme-scrub` element (only those elements recalculate styles).
 * The header theme is handled in SiteHeader.astro via [data-header-dark].
 */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

export function mountThemeScrub() {
  const dark = document.querySelector<HTMLElement>('[data-theme-dark]');
  if (!dark) return;
  // Next rendered section (skip inline <script> tags Astro may place in between).
  let next = dark.nextElementSibling as HTMLElement | null;
  while (next && next.tagName !== 'SECTION') next = next.nextElementSibling as HTMLElement | null;
  const scrubbed = Array.from(document.querySelectorAll<HTMLElement>('.theme-scrub'));

  let raf = 0;
  let last = '';

  const update = () => {
    raf = 0;
    const vh = window.innerHeight;
    const darkTop = dark.getBoundingClientRect().top;
    const nextTop = next ? next.getBoundingClientRect().top : Infinity;
    const enter = clamp01((vh * 0.85 - darkTop) / (vh * 0.45));
    const leave = clamp01((vh * 0.85 - nextTop) / (vh * 0.45));
    const raw = enter * (1 - leave);
    // Background eases across the window; text flips quickly in the middle so it
    // never sits mid-grey on a mid-grey background for long.
    const d = Math.round(smooth(raw) * 1000) / 1000;
    const dt = Math.round(smooth(clamp01((raw - 0.4) / 0.2)) * 1000) / 1000;
    const key = `${d}|${dt}`;
    if (key === last) return;
    last = key;
    // Lets the header know when this section reads as dark.
    const wasDark = dark.hasAttribute('data-is-dark');
    dark.toggleAttribute('data-is-dark', dt > 0.5);
    if (wasDark !== dt > 0.5) window.dispatchEvent(new Event('header:refresh'));
    scrubbed.forEach((el) => {
      el.style.setProperty('--d', String(d));
      el.style.setProperty('--dt', String(dt));
    });
  };

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  // Only listen while the dark section or its neighbour is near the viewport.
  const nearby = new Set<Element>();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? nearby.add(e.target) : nearby.delete(e.target)));
      if (nearby.size) window.addEventListener('scroll', onScroll, { passive: true });
      else window.removeEventListener('scroll', onScroll);
      update();
    },
    { rootMargin: '50% 0px' },
  );
  io.observe(dark);
  if (next) io.observe(next);
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}
