// Clean hero entrance: the footage assembles as a mosaic of big pixels.
//
// While html.hero-intro is set, the section shows the page background and this
// canvas carries the image. Each step the current video frame (or the poster
// until the video has data) is sampled onto a coarse grid and only part of the
// blocks are drawn, so the light background shows through the gaps. Steps go
// from few, big blocks with many gaps to small blocks with none, sweeping
// loosely from the top left. Then the real video and scrim fade in under the
// canvas and the canvas fades out.

/** Blocks across the width and share of blocks drawn, per step. */
const STEPS: [number, number][] = [
  [6, 0.3],
  [9, 0.5],
  [13, 0.66],
  [19, 0.8],
  [28, 0.92],
  [44, 1],
];
const START_MS = 120;
const STEP_MS = 130;
const HOLD_LAST_MS = 160;

const hash = (x: number, y: number, s: number) => {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 2147483647)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export function mountHeroMosaic(root: HTMLElement) {
  const html = document.documentElement;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-hero-mosaic]');
  const video = root.querySelector<HTMLVideoElement>('[data-hero-video]');
  const ctx = canvas?.getContext('2d', { willReadFrequently: true });
  const finish = () => html.classList.remove('hero-intro');
  if (!canvas || !video || !ctx || !html.classList.contains('hero-intro')) {
    finish();
    return;
  }

  const poster = new Image();
  if (video.poster) poster.src = video.poster;

  const source = (): [CanvasImageSource, number, number] | null => {
    if (video.readyState >= 2 && video.videoWidth) return [video, video.videoWidth, video.videoHeight];
    if (poster.complete && poster.naturalWidth) return [poster, poster.naturalWidth, poster.naturalHeight];
    return null;
  };

  const t0 = performance.now();
  let last = -1;
  const frame = () => {
    const elapsed = performance.now() - t0 - START_MS;
    const step = Math.min(STEPS.length - 1, Math.max(0, Math.floor(elapsed / STEP_MS)));
    const rect = root.getBoundingClientRect();
    const [across, fill] = STEPS[step];
    const cols = across;
    const rows = Math.max(1, Math.round((rect.height / rect.width) * across));
    const src = source();

    if (src && (step !== last || video.readyState >= 2)) {
      last = step;
      if (canvas.width !== cols || canvas.height !== rows) {
        canvas.width = cols;
        canvas.height = rows;
      }
      // Cover-fit the frame onto the block grid (one canvas pixel per block).
      const [img, sw, sh] = src;
      const scale = Math.max(cols / sw, rows / sh);
      const cw = cols / scale;
      const ch = rows / scale;
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, cols, rows);
      ctx.drawImage(img, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, cols, rows);
      if (fill < 1) {
        // Leave gaps: a block is drawn when its random value, nudged so the top
        // left fills first, is under this step's fill share.
        const data = ctx.getImageData(0, 0, cols, rows);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const sweep = (c / cols) * 0.6 + (r / rows) * 0.4;
            const v = hash(c, r, step) * 0.7 + sweep * 0.3;
            if (v > fill) data.data[(r * cols + c) * 4 + 3] = 0;
          }
        }
        ctx.putImageData(data, 0, 0);
      }
    }

    if (elapsed < STEPS.length * STEP_MS + HOLD_LAST_MS) {
      requestAnimationFrame(frame);
    } else {
      // Hand off: video and scrim fade in, the canvas fades out (CSS).
      finish();
      window.setTimeout(() => canvas.remove(), 600);
    }
  };
  requestAnimationFrame(frame);
}
