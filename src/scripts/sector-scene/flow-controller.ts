/**
 * Scroll controller for the Platform's data flow (sections/pages/DataFlow.astro).
 * The same scroll as the home's 3D trace (controller.ts, 'trail'): the stage
 * is pinned, scroll maps 1:1 to the camera's travel between stops, the copy
 * layer of the nearest stop shows, the camera glides on past the last stop
 * while the next section slides over and pushes the stage back.
 * Labels on the board follow their 3D anchors; the risk event card sits next
 * to the asset-level risk on the last stop. three.js loads only near the section.
 */
import type { FlowWorld, FlowAnchor } from './world-flow';
import { onThemeChange } from '../theme';

/** Any world the scroll can drive (world-flow.ts, world-twin.ts). */
type World = Omit<FlowWorld, 'project'> & { project(id: string): { x: number; y: number } };
type Load = (canvas: HTMLCanvasElement, opts: { reducedMotion: boolean; lowPower: boolean }) => Promise<World>;

const loadFlow: Load = async (canvas, opts) => {
  const { createFlowWorld } = await import('./world-flow');
  return createFlowWorld(canvas, opts) as unknown as World;
};

/** Extra viewport fraction to hold on the last stop before the cover starts (matches CSS). */
const LAST_HOLD = 0.5;
/** How far (in hops) the camera drifts past the last stop. */
const GLIDE = 0.6;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * `load` builds the world (the data flow by default); `cardAnchor` is the
 * anchor the last stop's card sits beside.
 */
export function mountFlowScene(root: HTMLElement, options: { load?: Load; cardAnchor?: string } = {}) {
  const load = options.load ?? loadFlow;
  const cardAnchor = options.cardAnchor ?? 'out0';
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const host = root.querySelector<HTMLElement>('[data-canvas-host]')!;
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
  const tags = Array.from(root.querySelectorAll<HTMLElement>('[data-anchor]'));
  const card = root.querySelector<HTMLElement>('[data-card]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const narrow = window.matchMedia('(max-width: 47.99rem)');
  const stopCount = steps.length;
  const lastStop = stopCount - 1;

  let world: World | null = null;
  let loading = false;
  let visible = false;
  let raf = 0;
  let last = performance.now();
  let focus = 0;
  let cover = 0;
  let active = -1;
  let width = stage.clientWidth;
  let height = stage.clientHeight;

  /* ---------------- Scroll → focus ---------------- */
  function readScroll() {
    const rect = root.getBoundingClientRect();
    const p = clamp(-rect.top / window.innerHeight, 0, stopCount + LAST_HOLD);
    if (p >= lastStop) {
      const x = p - lastStop;
      focus = lastStop + GLIDE * (1 - Math.exp(-x / GLIDE));
      cover = clamp(x - LAST_HOLD, 0, 1);
    } else {
      focus = p;
      cover = 0;
    }
    applyStep(Math.min(lastStop, Math.round(focus)));
    applyCover();
    world?.setFocus(focus);
  }

  function applyStep(i: number) {
    if (i === active) return;
    active = i;
    steps.forEach((el) => el.toggleAttribute('data-active', Number(el.dataset.step) === i));
    // Each label shows on the stops listed in its data-stops.
    tags.forEach((t) => t.toggleAttribute('data-on', (t.dataset.stops ?? '').split(' ').includes(String(i))));
    card?.toggleAttribute('data-open', i === lastStop);
  }

  function applyCover() {
    if (reduceMotion.matches) {
      stage.style.opacity = String(1 - cover * 0.6);
      return;
    }
    stage.style.transform = cover > 0 ? `scale(${(1 - cover * 0.05).toFixed(4)})` : '';
    stage.style.opacity = cover > 0 ? String(1 - cover * 0.5) : '';
  }

  /* ---------------- Labels + card ---------------- */
  function positionOverlays() {
    if (!world) return;
    for (const t of tags) {
      const { x, y } = world.project(t.dataset.anchor as FlowAnchor | string);
      t.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
    if (card && !narrow.matches) {
      const { x, y } = world.project(cardAnchor);
      const cw = card.offsetWidth;
      const ch = card.offsetHeight;
      const gap = Math.max(60, width * 0.06);
      // Beside the tower at risk: to its right if there is room, else to its left.
      const right = x + gap + cw < width - 16;
      const cx = right ? x + gap : x - gap - cw;
      const cy = clamp(y - ch * 0.2, 80, height - ch - 16);
      card.style.setProperty('--x', `${cx.toFixed(1)}px`);
      card.style.setProperty('--y', `${cy.toFixed(1)}px`);
    }
  }

  /* ---------------- Render loop ---------------- */
  function frame(now: number) {
    raf = 0;
    const dt = (now - last) / 1000;
    last = now;
    let keep = false;
    if (world) keep = world.tick(dt) || !reduceMotion.matches; // pulses run continuously
    positionOverlays();
    if (visible && keep) schedule();
  }

  function schedule() {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
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

  async function loadWorld() {
    if (loading || world) return;
    loading = true;
    try {
      const canvas = document.createElement('canvas');
      if (!canvas.getContext('webgl2')) throw new Error('WebGL2 unavailable');
      const lowPower = narrow.matches || (navigator.hardwareConcurrency ?? 8) <= 4;
      host.appendChild(canvas);
      world = await load(canvas, { reducedMotion: reduceMotion.matches, lowPower });
      world.resize(width, height);
      world.setFocus(focus);
      world.snap();
      world.tick(0);
      positionOverlays();
      requestAnimationFrame(() => host.setAttribute('data-ready', ''));
      root.setAttribute('data-ready', '');
      last = performance.now();
      schedule();
    } catch (err) {
      console.warn('[flow] 3D scene disabled:', err);
      root.setAttribute('data-no-webgl', '');
    }
  }

  onThemeChange(() => {
    world?.setTheme();
    world?.tick(0);
    schedule();
  });

  new IntersectionObserver(([e]) => e.isIntersecting && loadWorld(), { rootMargin: '100% 0px' }).observe(root);

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) {
      last = performance.now();
      window.addEventListener('scroll', onScroll, { passive: true });
      readScroll();
      schedule();
    } else {
      window.removeEventListener('scroll', onScroll);
    }
  }).observe(stage);

  if (finePointer.matches && !reduceMotion.matches) {
    window.addEventListener(
      'pointermove',
      (e) => {
        if (!world || e.pointerType !== 'mouse') return;
        const r = stage.getBoundingClientRect();
        world.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
        schedule();
      },
      { passive: true },
    );
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      last = performance.now();
      schedule();
    }
  });

  new ResizeObserver(onResize).observe(stage);
  readScroll();
}
