// Pixel-mask hero (test layout).
//
// A canvas sits on top of the video. Each grid cell is either light (painted
// with the page canvas colour, hiding the video) or dark (transparent, the
// video shows through). The pattern is value noise biased towards light at the
// top, drifting slowly. Light cells that touch the video show how many dark
// neighbours they have. Text blocks marked [data-pixel-keep] and the header band
// always stay light; alert pixels always sit on video. The mouse becomes a
// grid-snapped crosshair that also opens a small window into the video.

const ACCENT = '#ff3700';
const STEP_MS = 140; // mask drift: ~7 updates per second, reads as pixel animation
const DRIFT = 0.018; // noise units per step

// ---------- Noise ----------
function hash(x: number, y: number) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

function vnoise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = smooth(x - xi);
  const v = smooth(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number, t: number) {
  return (
    0.6 * vnoise(x + t, y + t * 0.35) +
    0.28 * vnoise(x * 2.1 - t * 0.8 + 11.3, y * 2.1 + 4.7) +
    0.12 * vnoise(x * 4.3 + 23.1, y * 4.3 - t * 0.5 + 7.9)
  );
}

export function mountHeroPixel(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-pixel-canvas]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  const alerts = Array.from(root.querySelectorAll<HTMLElement>('[data-pixel-alert]'));
  const keepEls = Array.from(root.querySelectorAll<HTMLElement>('[data-pixel-keep]'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const styles = getComputedStyle(document.documentElement);
  const lightColor = styles.getPropertyValue('--canvas').trim() || '#fafafa';
  const fontFamily = styles.getPropertyValue('--font-sans').trim() || 'sans-serif';

  root.classList.add('hpx--live');

  let W = 0;
  let H = 0;
  let cell = 30;
  let cols = 0;
  let rows = 0;
  let light = new Uint8Array(0); // 1 = light cell
  let force = new Int8Array(0); // 1 keep light, -1 keep dark, 0 free
  let heat = new Float32Array(0); // pointer window into the video
  let boost = new Float32Array(0); // soft pull towards light around copy blocks
  let time = 0;
  let lastStep = 0;
  let pointer: { c: number; r: number; x: number; y: number } | null = null;
  let visible = false;
  let raf = 0;
  let dirty = true;

  // ---------- Layout ----------
  const toCell = (x: number, y: number) => ({ c: Math.floor(x / cell), r: Math.floor(y / cell) });

  function markRect(x0: number, y0: number, x1: number, y1: number, value: 1 | -1, pad = 0) {
    const c0 = Math.max(0, Math.floor(x0 / cell) - pad);
    const r0 = Math.max(0, Math.floor(y0 / cell) - pad);
    const c1 = Math.min(cols - 1, Math.floor(x1 / cell) + pad);
    const r1 = Math.min(rows - 1, Math.floor(y1 / cell) + pad);
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) force[r * cols + c] = value;
  }

  function layout() {
    const rect = root.getBoundingClientRect();
    if (rect.width === 0) return false;
    W = rect.width;
    H = rect.height;
    cell = W < 768 ? 22 : Math.max(24, Math.min(34, Math.round(W / 48)));
    cols = Math.ceil(W / cell);
    rows = Math.ceil(H / cell);
    root.style.setProperty('--cell', `${cell}px`);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.round(W * dpr);
    canvas!.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    light = new Uint8Array(cols * rows);
    force = new Int8Array(cols * rows);
    heat = new Float32Array(cols * rows);
    boost = new Float32Array(cols * rows);

    // Header band stays light so the logo and menu stay readable.
    const headerH = parseFloat(styles.getPropertyValue('--header-h')) * 16 || 64;
    markRect(0, 0, W, headerH + 4, 1);

    // Copy blocks stay light. Around them the mask is only pulled towards
    // light, so their edge stays ragged instead of a hard box.
    for (const el of keepEls) {
      const r = el.getBoundingClientRect();
      if (!r.width) continue;
      const x0 = r.left - rect.left;
      const y0 = r.top - rect.top;
      const x1 = r.right - rect.left - 1;
      const y1 = r.bottom - rect.top - 1;
      markRect(x0, y0, x1, y1, 1);
      const c0 = Math.floor(x0 / cell);
      const r0 = Math.floor(y0 / cell);
      const c1 = Math.floor(x1 / cell);
      const r1 = Math.floor(y1 / cell);
      for (let rr = Math.max(0, r0 - 4); rr <= Math.min(rows - 1, r1 + 4); rr++) {
        for (let cc = Math.max(0, c0 - 4); cc <= Math.min(cols - 1, c1 + 4); cc++) {
          const d = Math.max(c0 - cc, cc - c1, r0 - rr, rr - r1); // cells outside the block
          if (d > 0) boost[rr * cols + cc] = Math.max(boost[rr * cols + cc], [0, 0.6, 0.32, 0.16, 0.06][d]);
        }
      }
    }

    // Alerts snap to the grid and always sit on video.
    const mobile = W < 768;
    alerts.forEach((li, i) => {
      const fx = Number(mobile ? li.dataset.xm : li.dataset.x);
      const fy = Number(mobile ? li.dataset.ym : li.dataset.y);
      if (!fx || !fy) {
        li.hidden = true;
        return;
      }
      li.hidden = false;
      const c = Math.round(fx * cols);
      const r = Math.round(fy * rows);
      li.style.setProperty('--ax', `${c * cell}px`);
      li.style.setProperty('--ay', `${r * cell}px`);
      li.style.setProperty('--i', String(i));
      // Card opens to the right when it fits, otherwise to the left.
      const cardW = li.querySelector<HTMLElement>('.alert__card')?.offsetWidth || 272;
      li.dataset.side = (c + 2) * cell + cardW < W - 16 ? 'right' : 'left';
      li.dataset.v = fy > 0.7 ? 'up' : 'down';
      markRect(c * cell, r * cell, c * cell + 1, r * cell + 1, -1, 1);
    });

    field();
    dirty = true;
    return true;
  }

  // ---------- Mask ----------
  function field() {
    const s = 5.2 / Math.max(cols, 1); // same pattern scale whatever the cell size
    for (let r = 0; r < rows; r++) {
      const ny = r / rows;
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        if (force[i]) {
          light[i] = force[i] > 0 ? 1 : 0;
          continue;
        }
        const nx = c / cols;
        // Lighter towards the top and the top-left, darker towards the bottom.
        const bias = 0.46 * (0.42 - ny) + 0.1 * (0.5 - nx) * (1 - ny);
        const speckle = (hash(c + 911, r + 37) - 0.5) * 0.14;
        light[i] = fbm(c * s, r * s, time) + bias + speckle + boost[i] > 0.5 ? 1 : 0;
      }
    }
  }

  const isLight = (i: number) => light[i] === 1 && !(force[i] === 0 && heat[i] > 0.35);

  function draw() {
    ctx!.clearRect(0, 0, W, H);
    ctx!.fillStyle = lightColor;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (isLight(r * cols + c)) ctx!.fillRect(c * cell, r * cell, cell, cell);
      }
    }

    // Neighbour counts on light cells along the video edge (not inside copy).
    ctx!.fillStyle = '#a5a5a5';
    ctx!.font = `${Math.round(cell * 0.3)}px ${fontFamily}`;
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        if (force[i] || !isLight(i)) continue;
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const rr = r + dy;
          if (rr < 0 || rr >= rows) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const cc = c + dx;
            if ((dx || dy) && cc >= 0 && cc < cols && !isLight(rr * cols + cc)) n++;
          }
        }
        if (n) ctx!.fillText(String(n), c * cell + cell / 2, r * cell + cell / 2 + 0.5);
      }
    }

    if (pointer && finePointer.matches) drawCrosshair(pointer.c, pointer.r);
  }

  function drawCrosshair(c: number, r: number) {
    const x = c * cell;
    const y = r * cell;

    // Grid-snapped square in brand orange, with ticks reaching to the next cells.
    ctx!.strokeStyle = ACCENT;
    ctx!.lineWidth = 1.5;
    ctx!.strokeRect(x + 0.75, y + 0.75, cell - 1.5, cell - 1.5);
    ctx!.beginPath();
    const mx = x + cell / 2;
    const my = y + cell / 2;
    const gap = cell * 0.2;
    const len = cell * 0.75;
    ctx!.moveTo(x - gap, my);
    ctx!.lineTo(x - gap - len, my);
    ctx!.moveTo(x + cell + gap, my);
    ctx!.lineTo(x + cell + gap + len, my);
    ctx!.moveTo(mx, y - gap);
    ctx!.lineTo(mx, y - gap - len);
    ctx!.moveTo(mx, y + cell + gap);
    ctx!.lineTo(mx, y + cell + gap + len);
    ctx!.stroke();

    // Illustrative coordinates around Bilbao, from the pointer position.
    const lat = 43.42 - (pointer!.y / H) * 0.32;
    const lon = 3.08 - (pointer!.x / W) * 0.48;
    const label = `${lat.toFixed(4)}° N  ${lon.toFixed(4)}° W`;
    ctx!.font = `11px ${fontFamily}`;
    const tw = ctx!.measureText(label).width;
    const flip = x + cell * 2 + tw > W - 8;
    const lx = flip ? x - cell - 6 : x + cell * 2 + 6;
    const ly = y + cell + cell * 0.75;
    ctx!.textAlign = flip ? 'right' : 'left';
    ctx!.textBaseline = 'middle';
    const under = toCell(flip ? lx - tw / 2 : lx + tw / 2, ly);
    const labelOnVideo =
      under.c >= 0 && under.c < cols && under.r >= 0 && under.r < rows && !isLight(under.r * cols + under.c);
    ctx!.fillStyle = labelOnVideo ? '#f1f1f1' : '#1e1e1e';
    ctx!.fillText(label, lx, ly);
  }

  // ---------- Loop ----------
  function frame(now: number) {
    raf = 0;
    if (!visible) return;
    if (!reduce.matches && now - lastStep > STEP_MS) {
      lastStep = now;
      time += DRIFT;
      field();
      dirty = true;
    }
    // Pointer window: cells near the crosshair open onto the video, then close.
    let warm = false;
    for (let i = 0; i < heat.length; i++) {
      if (heat[i] > 0.01) {
        heat[i] *= 0.9;
        warm = true;
      } else heat[i] = 0;
    }
    if (warm) dirty = true;
    if (dirty) {
      draw();
      dirty = false;
    }
    if (!reduce.matches || warm) raf = requestAnimationFrame(frame);
  }

  const start = () => {
    if (!raf && visible) raf = requestAnimationFrame(frame);
  };

  // ---------- Pointer ----------
  root.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const rect = root.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { c, r } = toCell(x, y);
    pointer = { c, r, x, y };
    const R = 1.6;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const cc = c + dx;
        const rr = r + dy;
        if (cc < 0 || rr < 0 || cc >= cols || rr >= rows) continue;
        if (Math.hypot(dx, dy) <= R) heat[rr * cols + cc] = 1;
      }
    }
    dirty = true;
    start();
  });

  root.addEventListener('pointerleave', () => {
    pointer = null;
    dirty = true;
    start();
  });

  // ---------- Alerts ----------
  let active = -1;
  let hovering = false;
  let cycle = 0;

  function open(i: number) {
    active = i;
    alerts.forEach((li, j) => {
      const on = j === i;
      li.classList.toggle('is-open', on);
      li.querySelector('.alert__dot')?.setAttribute('aria-expanded', String(on));
    });
  }

  const shown = () => alerts.map((li, i) => (li.hidden ? -1 : i)).filter((i) => i >= 0);

  function next() {
    const list = shown();
    if (!list.length) return;
    const pos = list.indexOf(active);
    open(list[(pos + 1) % list.length]);
  }

  function startCycle() {
    stopCycle();
    if (reduce.matches || !visible) return;
    cycle = window.setInterval(() => {
      if (!hovering) next();
    }, 4500);
  }

  function stopCycle() {
    if (cycle) window.clearInterval(cycle);
    cycle = 0;
  }

  alerts.forEach((li, i) => {
    const dot = li.querySelector<HTMLButtonElement>('.alert__dot');
    if (!dot) return;
    dot.addEventListener('pointerenter', () => {
      hovering = true;
      open(i);
    });
    dot.addEventListener('pointerleave', () => {
      hovering = false;
    });
    dot.addEventListener('focus', () => open(i));
    dot.addEventListener('click', () => open(i));
  });

  // ---------- Visibility ----------
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting && root.getClientRects().length > 0;
    if (visible) {
      if (!W) layout();
      dirty = true;
      start();
      if (active < 0 && !reduce.matches) next();
      startCycle();
    } else stopCycle();
  }).observe(root);

  // Re-layout on resize and when the hero becomes visible from the menu switch.
  let resizeRaf = 0;
  new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      if (layout()) start();
    });
  }).observe(root);

  // Fonts change the copy blocks' size: lay out again once they are ready.
  document.fonts?.ready.then(() => {
    if (layout()) start();
  });

  reduce.addEventListener('change', () => {
    dirty = true;
    start();
    startCycle();
  });
}
