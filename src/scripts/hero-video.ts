// Plays the hero video(s) only when they can be seen: the section is the
// active hero layout (menu test switch), the video is on screen, and the
// visitor has not asked for reduced motion or data saving.
let mounted = false;

export function mountHeroVideos() {
  if (mounted) return; // both hero layouts import this; set up once
  mounted = true;
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('[data-hero-video]'));
  if (!videos.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const onScreen = new Map<HTMLVideoElement, boolean>();

  const sync = () => {
    for (const video of videos) {
      const shown = video.getClientRects().length > 0; // false when display: none
      const play = shown && onScreen.get(video) !== false && !reduce.matches && !saveData;
      if (play) {
        if (video.preload === 'none') video.preload = 'auto';
        video.play().catch(() => {});
      } else if (!video.paused) {
        video.pause();
      }
    }
  };

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) onScreen.set(e.target as HTMLVideoElement, e.isIntersecting);
    sync();
  });
  videos.forEach((v) => io.observe(v));
  reduce.addEventListener('change', sync);
  window.addEventListener('hero:change', sync);
  sync();
}
