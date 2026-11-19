/**
 * Burnt text (test switch: html[data-text-fx]), after unifygtm.com's
 * "supercharge" headline. The word is split into letters laid exactly over a
 * hidden copy of the word (which keeps the layout, so nothing moves). A hot
 * spot slides along the word in a loop; each letter, by how close it is:
 *  - blurs (up to ~0.03em),
 *  - shifts from the base ember towards the bright orange,
 *  - glows: a tight inner and a wide outer orange text-shadow.
 * Applied to every piece of orange text (text clipped from a gradient
 * background) and anything marked [data-burn]. Medium weight. Reduced
 * motion: the hot spot rests in place. With the switch on "gradient" the
 * original text is put back.
 */
import { onThemeChange } from './theme';

const C = {
  maxDist: 3.2, // em: how far the hot spot reaches
  maxBlur: 0.035, // em
  speed: 2.5, // em per second
  span: 1.6, // em of travel beyond the word before looping
  baseFilter: 'contrast(1.15) saturate(1.1)',
};

type RGB = [number, number, number];
/** Any CSS colour (hex, rgb, named…) as RGB channels, resolved by the browser. */
const rgb = (v: string): RGB => {
  const probe = document.createElement('span');
  probe.style.color = v.trim();
  probe.style.display = 'none';
  document.body.append(probe);
  const m = getComputedStyle(probe).color.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  probe.remove();
  return [m[0], m[1], m[2]];
};
const mix = (a: RGB, b: RGB, t: number) => `rgb(${a.map((c, i) => Math.round(c + (b[i] - c) * t)).join(',')})`;

interface Inst {
  el: HTMLElement;
  text: string;
  chars: HTMLSpanElement[];
  cx: number[];
  cy: number[];
  width: number;
  size: number;
  base: RGB;
  tint: RGB;
  x: number;
  prev: number[];
  visible: boolean;
}

const insts: Inst[] = [];
let raf = 0;
let last = 0;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

function targets() {
  const found = new Set<HTMLElement>(document.querySelectorAll<HTMLElement>('[data-burn]'));
  for (const el of document.body.querySelectorAll<HTMLElement>('*')) {
    if (found.has(el) || el.closest('svg, canvas, video, script, style')) continue;
    const cs = getComputedStyle(el);
    const clip = cs.backgroundClip || cs.getPropertyValue('-webkit-background-clip');
    if (clip === 'text' && cs.backgroundImage.includes('gradient')) found.add(el);
  }
  return [...found].filter((el) => el.children.length === 0 && el.textContent?.trim());
}

function measure(inst: Inst) {
  const { el, chars } = inst;
  const ref = el.firstElementChild as HTMLElement;
  const node = ref.firstChild as Text;
  const box = el.getBoundingClientRect();
  if (!box.width) return false;
  const cs = getComputedStyle(el);
  inst.size = parseFloat(cs.fontSize) || 16;
  inst.base = rgb(cs.getPropertyValue('--burn-base') || cs.color);
  inst.tint = rgb(cs.getPropertyValue('--burn-tint') || 'rgb(254 60 1)');
  const range = document.createRange();
  let i = 0;
  let offset = 0;
  const left0 = ref.getBoundingClientRect().left;
  for (const ch of Array.from(inst.text)) {
    range.setStart(node, offset);
    range.setEnd(node, offset + ch.length);
    const r = range.getBoundingClientRect();
    const span = chars[i];
    span.style.left = `${r.left - box.left}px`;
    span.style.top = `${r.top - box.top}px`;
    inst.cx[i] = r.left - left0 + r.width / 2;
    inst.cy[i] = r.top - box.top + r.height / 2;
    offset += ch.length;
    i++;
  }
  inst.width = ref.getBoundingClientRect().width;
  inst.prev.fill(-1);
  return true;
}

function paint(inst: Inst) {
  const { size, width } = inst;
  const maxDist = size * C.maxDist;
  const loop = width + size * C.span * 2;
  const cy = (inst.cy[0] ?? size / 2);
  for (let i = 0; i < inst.chars.length; i++) {
    // The hot spot and its copy one loop behind, so it wraps around smoothly.
    let p = 0;
    for (const hx of [inst.x, inst.x - loop]) {
      const d = Math.hypot(inst.cx[i] - hx, inst.cy[i] - cy);
      p = Math.max(p, d >= maxDist ? 0 : 1 - d / maxDist);
    }
    const q = Math.round(p * 40) / 40;
    if (q === inst.prev[i]) continue;
    inst.prev[i] = q;
    const s = inst.chars[i].style;
    const blur = Math.round(q * size * C.maxBlur * 20) / 20;
    s.filter = `${blur > 0.01 ? `blur(${blur}px) ` : ''}${C.baseFilter}`;
    const t = Math.min(1, q * 1.15);
    s.color = mix(inst.base, inst.tint, t);
    if (t <= 0.001) {
      s.textShadow = '';
      continue;
    }
    const glow = inst.tint.join(',');
    const inner = (size * (0.015 + t * 0.035)).toFixed(2);
    const outer = (size * (0.06 + t * 0.16)).toFixed(2);
    s.textShadow = `0 0 ${inner}px rgba(${glow},${(0.4 + t * 0.4).toFixed(3)}), 0 0 ${outer}px rgba(${glow},${(0.1 + t * 0.3).toFixed(3)})`;
  }
}

function tick(now: number) {
  raf = 0;
  const dt = Math.min(50, last ? now - last : 16);
  last = now;
  let any = false;
  for (const inst of insts) {
    if (!inst.visible) continue;
    any = true;
    const loop = inst.width + inst.size * C.span * 2;
    inst.x += (inst.size * C.speed * dt) / 1000;
    if (inst.x > inst.width + inst.size * C.span) inst.x -= loop;
    paint(inst);
  }
  if (any && !reduce.matches) raf = requestAnimationFrame(tick);
  else last = 0;
}

function start() {
  if (!raf && !reduce.matches) raf = requestAnimationFrame(tick);
}

function build(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.classList.add('burn');
  el.textContent = '';
  el.setAttribute('aria-label', text.trim());
  el.setAttribute('role', 'text');
  const ref = document.createElement('span');
  ref.className = 'burn__ref';
  ref.setAttribute('aria-hidden', 'true');
  ref.textContent = text;
  el.append(ref);
  const chars = Array.from(text).map((ch) => {
    const s = document.createElement('span');
    s.className = 'burn__ch';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = ch;
    el.append(s);
    return s;
  });
  const inst: Inst = {
    el,
    text,
    chars,
    cx: [],
    cy: [],
    width: 0,
    size: 16,
    base: [0, 0, 0],
    tint: [254, 60, 1],
    x: 0,
    prev: new Array(chars.length).fill(-1),
    visible: false,
  };
  if (!measure(inst)) return;
  // Start with the hot spot over the last third of the word, at rest with reduced motion.
  inst.x = inst.width * 0.7;
  paint(inst);
  insts.push(inst);
  new IntersectionObserver(([e]) => {
    inst.visible = e.isIntersecting;
    if (inst.visible) start();
  }).observe(el);
}

function teardown() {
  while (insts.length) {
    const inst = insts.pop()!;
    inst.el.textContent = inst.text;
    inst.el.classList.remove('burn');
    inst.el.removeAttribute('aria-label');
    inst.el.removeAttribute('role');
  }
}

function enabled() {
  return document.documentElement.dataset.textFx !== 'gradient';
}

export function mountBurn() {
  const list = targets();
  const setup = () => {
    teardown();
    if (enabled()) list.forEach(build);
  };
  const go = () => setup();
  if (document.fonts?.ready) document.fonts.ready.then(go, go);
  else go();
  window.addEventListener('text-fx:change', setup);
  onThemeChange(() => insts.forEach((inst) => measure(inst) && paint(inst)));
  let t = 0;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = window.setTimeout(() => insts.forEach((inst) => measure(inst) && paint(inst)), 150);
  });
}
