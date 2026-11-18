/**
 * Statements lit word by word as they scroll in ([data-lit], words wrapped in
 * .w): every word starts faint and lights up in reading order while the
 * statement crosses the lower half of the screen. Reduced motion: shown lit.
 */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function mountLit(root: ParentNode = document) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.querySelectorAll<HTMLElement>('[data-lit]').forEach((lit) => {
    const words = Array.from(lit.querySelectorAll<HTMLElement>('.w'));
    if (!words.length || reduce) return;
    lit.classList.add('is-lit');
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const top = lit.getBoundingClientRect().top;
      const on = clamp01((vh * 0.9 - top) / (vh * 0.55)) * words.length;
      words.forEach((w, i) => w.style.setProperty('--o', Math.min(1, Math.max(0.16, on - i + 0.16)).toFixed(3)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) window.addEventListener('scroll', onScroll, { passive: true });
        else window.removeEventListener('scroll', onScroll);
        update();
      },
      { rootMargin: '25% 0px' },
    ).observe(lit);
    window.addEventListener('resize', onScroll, { passive: true });
  });
}
