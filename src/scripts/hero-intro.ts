// Hero entrance: the video band resolves from big pixels to the live footage.
//
// A canvas sits over the video. Each frame the current video frame (or the
// poster until the video has data) is drawn into a tiny canvas and scaled up
// with nearest-neighbour sampling, so it reads as big square pixels. The pixel
// size steps down in fixed jumps, starting at a whole grid cell and halving
// towards a few pixels, then the canvas fades out and is removed.
// Reduced motion: no canvas, the video simply shows.

const START_MS = 220;
const STEP_MS = 115;
/** Pixel size as a fraction of one grid cell, biggest first. */
const STEPS = [1, 1 / 2, 1 / 3, 1 / 4, 1 / 6, 1 / 9, 1 / 14, 1 / 22];
const FADE_MS = 260;

export function mountHeroIntro(band: HTMLElement) {
  const canvas = band.querySelector<HTMLCanvasElement>('[data-hero-pixels]');
  const video = band.querySelector<HTMLVideoElement>('[data-hero-video]');
  if (!canvas || !video) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  if (reduce || !ctx) {
    canvas.remove();
    return;
  }

  const poster = new Image();
  if (video.poster) poster.src = video.poster;
  const cols = () => parseFloat(getComputedStyle(band).getPropertyValue('--cols')) || 8;

  /** Draws `src` cover-fitted into a w × h canvas. */
  const draw = (src: CanvasImageSource, sw: number, sh: number, w: number, h: number) => {
    const scale = Math.max(w / sw, h / sh);
    const cw = w / scale;
    const ch = h / scale;
    ctx.drawImage(src, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, w, h);
  };

  let t0 = 0;
  let done = false;
  const frame = () => {
    if (done) return;
    const now = performance.now();
    if (!t0) t0 = now;
    const elapsed = now - t0 - START_MS;
    const step = Math.max(0, Math.floor(elapsed / STEP_MS));

    const rect = band.getBoundingClientRect();
    const cell = rect.width / cols();
    const block = Math.max(2, cell * STEPS[Math.min(step, STEPS.length - 1)]);
    const w = Math.max(1, Math.round(rect.width / block));
    const h = Math.max(1, Math.round(rect.height / block));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.imageSmoothingEnabled = true; // average the area each big pixel covers
    if (video.readyState >= 2 && video.videoWidth) {
      draw(video, video.videoWidth, video.videoHeight, w, h);
    } else if (poster.complete && poster.naturalWidth) {
      draw(poster, poster.naturalWidth, poster.naturalHeight, w, h);
    } else {
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(0, 0, w, h);
    }

    if (step >= STEPS.length) {
      done = true;
      canvas.classList.add('is-done');
      window.setTimeout(() => canvas.remove(), FADE_MS + 40);
      return;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
