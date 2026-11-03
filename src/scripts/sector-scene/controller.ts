/**
 * Scroll controller for the pinned 3D sector section.
 * - Maps scroll position to a focus value (overview → sector 1 … 5).
 * - Swaps the copy layers, highlights the active marker, keeps the progress nav in sync.
 * - Lazy-loads three.js only when the section is about to enter the viewport.
 * - Alert cards open on hover (fine pointers), focus, or tap.
 */
import type { World, SectorId } from './world';

const SECTORS: SectorId[] = ['grid', 'substation', 'solar', 'wind', 'oilgas'];
/** Fraction of each scroll segment spent holding on a stop before travelling. */
const HOLD = 0.32;
/** Extra viewport fraction to hold on the last stop before the cover starts (matches CSS). */
const LAST_HOLD = 0.5;
/** Marker positions (fractions of the stage) used when WebGL is unavailable. */
const FALLBACK: Record<SectorId, [number, number]> = {
  grid: [0.6, 0.42],
  substation: [0.62, 0.48],
  solar: [0.6, 0.55],
  wind: [0.62, 0.36],
  oilgas: [0.6, 0.5],
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export type SceneVariant = 'overview' | 'trail';

/**
 * @param variant 'overview' starts on the whole network (stop 0) then visits each sector;
 *                'trail' starts on the first sector and travels along a diagonal trace.
 */
export function mountSectorScene(root: HTMLElement, variant: SceneVariant = 'overview') {
  /** Index of the first sector stop (0 when there is no overview stop). */
  const first = variant === 'overview' ? 1 : 0;
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const host = root.querySelector<HTMLElement>('[data-canvas-host]')!;
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
  const markers = new Map<SectorId, HTMLElement>();
  const cards = new Map<SectorId, HTMLElement>();
  root.querySelectorAll<HTMLElement>('[data-marker]').forEach((m) => markers.set(m.dataset.marker as SectorId, m));
  root.querySelectorAll<HTMLElement>('[data-alert]').forEach((c) => cards.set(c.dataset.alert as SectorId, c));
  const gotoButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-goto]'));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const narrow = window.matchMedia('(max-width: 47.99rem)');

  const stopCount = SECTORS.length + first;
  let world: World | null = null;
  let loading = false;
  let visible = false;
  let raf = 0;
  let last = performance.now();
  let focus = 0;
  let cover = 0;
  let activeIndex = -1;
  let openId: SectorId | null = null;
  let pinnedId: SectorId | null = null;
  let closeTimer = 0;
  // Live 3D view in the asset panel, loaded on first open.
  let preview: typeof import('./asset-preview') | null = null;
  let width = stage.clientWidth;
  let height = stage.clientHeight;
  let needsFrame = true;

  /* ---------------- Scroll → focus ---------------- */
  function readScroll() {
    const rect = root.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = clamp(-rect.top / vh, 0, stopCount + LAST_HOLD);
    const lastStop = stopCount - 1;
    if (p >= lastStop) {
      // Hold the last stop for half a viewport, then the next section slides over.
      focus = lastStop;
      cover = clamp(p - lastStop - LAST_HOLD, 0, 1);
    } else {
      const i = Math.floor(p);
      const t = p - i;
      focus =
        variant === 'trail'
          ? // Continuous: scroll maps 1:1 to the trace, no holds or snapping, so the
            // user can stop anywhere. The camera spring only smooths wheel steps.
            p
          : i + easeInOut(clamp((t - HOLD) / (1 - HOLD), 0, 1));
      cover = 0;
    }
    applyStep(Math.round(focus));
    applyCover();
    world?.setFocus(focus);
    needsFrame = true;
  }

  function applyStep(index: number) {
    if (index === activeIndex) return;
    activeIndex = index;
    steps.forEach((el) => el.toggleAttribute('data-active', Number(el.dataset.step) === index));
    root.toggleAttribute('data-has-focus', index >= first);
    markers.forEach((m, id) => m.toggleAttribute('data-active', SECTORS.indexOf(id) + first === index));
    gotoButtons.forEach((b) => {
      if (Number(b.dataset.goto) === index) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
    // Close alerts that belong to a sector that is no longer in focus.
    if (openId && SECTORS.indexOf(openId) + first !== index && !finePointer.matches) closeAlert();
  }

  function applyCover() {
    // As the next section slides over, push the stage back slightly.
    if (reduceMotion.matches) {
      stage.style.opacity = String(1 - cover * 0.6);
      return;
    }
    const s = 1 - cover * 0.05;
    stage.style.transform = cover > 0 ? `scale(${s.toFixed(4)})` : '';
    stage.style.opacity = cover > 0 ? String(1 - cover * 0.5) : '';
  }

  /* ---------------- Markers + cards ---------------- */
  function positionOverlays() {
    for (const id of SECTORS) {
      const m = markers.get(id)!;
      let x: number;
      let y: number;
      if (world) {
        ({ x, y } = world.project(id));
      } else {
        x = FALLBACK[id][0] * width;
        y = FALLBACK[id][1] * height;
      }
      const off = x < -40 || y < -40 || x > width + 40 || y > height + 40;
      m.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      m.style.visibility = off ? 'hidden' : '';
      if (openId === id) placeCard(id, x, y);
    }
  }

  function placeCard(id: SectorId, x: number, y: number) {
    const card = cards.get(id)!;
    if (narrow.matches) {
      card.style.removeProperty('--x');
      card.style.removeProperty('--y');
      return;
    }
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    const gap = 22;
    const right = x + gap + cw < width - 16;
    const below = y + gap + ch < height - 16;
    const cx = right ? x + gap : x - gap - cw;
    const cy = clamp(below ? y - 10 : y + 10 - ch, 80, height - ch - 16);
    card.style.setProperty('--x', `${cx.toFixed(1)}px`);
    card.style.setProperty('--y', `${cy.toFixed(1)}px`);
    // Scale from the corner closest to the marker (origin-aware popover).
    card.style.setProperty('--origin', `${right ? 0 : 100}% ${below ? 0 : 100}%`);
  }

  function openAlert(id: SectorId) {
    window.clearTimeout(closeTimer);
    if (openId === id) return;
    if (openId) closeAlert(true);
    openId = id;
    const card = cards.get(id)!;
    const btn = markers.get(id)!.querySelector('button')!;
    btn.setAttribute('aria-expanded', 'true');
    needsFrame = true;
    positionOverlays();
    card.toggleAttribute('data-open', true);
    const canvas = card.querySelector<HTMLCanvasElement>('[data-preview]');
    if (canvas) {
      import('./asset-preview').then((m) => {
        preview = m;
        if (openId === id) m.showPreview(id, canvas, { reducedMotion: reduceMotion.matches });
      });
    }
  }

  function closeAlert(immediate = false) {
    if (!openId) return;
    const id = openId;
    const run = () => {
      cards.get(id)?.removeAttribute('data-open');
      preview?.hidePreview();
      markers.get(id)?.querySelector('button')?.setAttribute('aria-expanded', 'false');
      if (openId === id) openId = null;
      if (pinnedId === id) pinnedId = null;
    };
    window.clearTimeout(closeTimer);
    if (immediate) run();
    else closeTimer = window.setTimeout(run, 140);
  }

  for (const id of SECTORS) {
    const marker = markers.get(id)!;
    const btn = marker.querySelector('button')!;
    const card = cards.get(id)!;

    btn.addEventListener('pointerenter', () => finePointer.matches && openAlert(id));
    btn.addEventListener('pointerleave', () => finePointer.matches && pinnedId !== id && closeAlert());
    card.addEventListener('pointerenter', () => openId === id && window.clearTimeout(closeTimer));
    card.addEventListener('pointerleave', () => finePointer.matches && pinnedId !== id && closeAlert());
    btn.addEventListener('focus', () => openAlert(id));
    btn.addEventListener('blur', () => pinnedId !== id && closeAlert());
    btn.addEventListener('click', () => {
      if (pinnedId === id) {
        pinnedId = null;
        closeAlert(true);
      } else {
        openAlert(id);
        pinnedId = id;
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openId) {
      const btn = markers.get(openId)?.querySelector('button');
      pinnedId = null;
      closeAlert(true);
      btn?.blur();
    }
  });

  // Tap outside closes a pinned alert.
  document.addEventListener('pointerdown', (e) => {
    if (!openId) return;
    const t = e.target as Node;
    if (markers.get(openId)?.contains(t) || cards.get(openId)?.contains(t)) return;
    pinnedId = null;
    closeAlert(true);
  });

  /* ---------------- Progress nav ---------------- */
  gotoButtons.forEach((b) =>
    b.addEventListener('click', () => {
      const k = Number(b.dataset.goto);
      const top = root.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top + (k + 0.08) * window.innerHeight,
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
      });
    }),
  );

  /* ---------------- Render loop ---------------- */
  function frame(now: number) {
    raf = 0;
    const dt = (now - last) / 1000;
    last = now;
    let keepGoing = false;
    if (world) {
      const settling = world.tick(dt);
      keepGoing = settling || !reduceMotion.matches; // continuous for turbines / cable flow
    }
    positionOverlays();
    needsFrame = false;
    if (visible && (keepGoing || needsFrame)) schedule();
  }

  function schedule() {
    if (!raf && visible && !document.hidden) {
      raf = requestAnimationFrame(frame);
    }
  }

  function onScroll() {
    readScroll();
    schedule();
  }

  function onResize() {
    width = stage.clientWidth;
    height = stage.clientHeight;
    world?.resize(width, height);
    readScroll();
    schedule();
  }

  /* ---------------- Lazy WebGL ---------------- */
  async function loadWorld() {
    if (loading || world) return;
    loading = true;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      if (!gl) throw new Error('WebGL2 unavailable');
      const lowPower = narrow.matches || (navigator.hardwareConcurrency ?? 8) <= 4;
      const create =
        variant === 'trail'
          ? (await import('./world-trail')).createTrailWorld
          : (await import('./world')).createWorld;
      host.appendChild(canvas);
      world = create(canvas, { reducedMotion: reduceMotion.matches, lowPower });
      world.resize(width, height);
      world.setFocus(focus);
      // Render one frame before fading the canvas in.
      world.tick(0);
      requestAnimationFrame(() => host.setAttribute('data-ready', ''));
      last = performance.now();
      schedule();
    } catch (err) {
      console.warn('[sectors] 3D scene disabled:', err);
      root.setAttribute('data-no-webgl', '');
      positionOverlays();
    }
  }

  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) loadWorld();
    },
    { rootMargin: '100% 0px' },
  ).observe(root);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      last = performance.now();
      window.addEventListener('scroll', onScroll, { passive: true });
      readScroll();
      schedule();
    } else {
      window.removeEventListener('scroll', onScroll);
    }
  }).observe(stage);

  // Decorative tilt: the camera leans slightly with the pointer (fine pointers only).
  const onPointer = (e: PointerEvent) => {
    if (!world?.setPointer || e.pointerType !== 'mouse') return;
    const r = stage.getBoundingClientRect();
    world.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };
  if (finePointer.matches && !reduceMotion.matches) {
    window.addEventListener('pointermove', onPointer, { passive: true });
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      last = performance.now();
      schedule();
    }
  });

  new ResizeObserver(onResize).observe(stage);
  readScroll();
  positionOverlays();
}
