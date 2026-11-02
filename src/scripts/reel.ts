/**
 * Endless vertical reel for the sector list.
 * Moves at a constant speed, gets a short boost from page scroll, and lights up
 * the row crossing the centre line. Runs only while visible; static with reduced motion.
 */
export function mountReel(reel: HTMLElement) {
  const inner = reel.querySelector<HTMLElement>('[data-reel-inner]');
  const firstList = inner?.firstElementChild as HTMLElement | null;
  if (!inner || !firstList) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rows = Array.from(inner.querySelectorAll<HTMLElement>('[data-reel-row]'));
  const BASE_SPEED = 34; // px per second
  let loop = 1;
  let viewH = 1;
  let tops: number[] = [];
  let heights: number[] = [];
  let offset = 0;
  let boost = 0;
  let raf = 0;
  let last = 0;
  let lastScroll = window.scrollY;
  let visible = false;

  const measure = () => {
    loop = firstList.offsetHeight || 1;
    viewH = reel.clientHeight || 1;
    tops = rows.map((r) => r.offsetTop);
    heights = rows.map((r) => r.offsetHeight);
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    boost *= Math.exp(-dt * 3); // decays in well under a second
    offset = (offset + (BASE_SPEED + boost) * dt) % loop;
    inner.style.transform = `translate3d(0, ${(-offset).toFixed(2)}px, 0)`;

    const centre = viewH / 2;
    for (let i = 0; i < rows.length; i++) {
      const y = tops[i] - offset;
      const mid = y + heights[i] / 2;
      const d = Math.abs(mid - centre);
      const o = Math.max(0.22, 1 - d / (viewH * 0.42));
      rows[i].style.setProperty('--o', o.toFixed(3));
      rows[i].toggleAttribute('data-active', d < heights[i] / 2);
    }
    if (visible) raf = requestAnimationFrame(frame);
  };

  const onScroll = () => {
    const y = window.scrollY;
    boost = Math.min(900, boost + Math.abs(y - lastScroll) * 2.2);
    lastScroll = y;
  };

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) {
      measure();
      last = performance.now();
      lastScroll = window.scrollY;
      window.addEventListener('scroll', onScroll, { passive: true });
      raf = requestAnimationFrame(frame);
    } else if (!visible) {
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener('scroll', onScroll);
    }
  }).observe(reel);

  new ResizeObserver(measure).observe(reel);
  document.addEventListener('visibilitychange', () => {
    last = performance.now();
  });
}
