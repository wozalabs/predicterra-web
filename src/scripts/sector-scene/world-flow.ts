/**
 * Platform, "Start with the data you already run": a circuit board with
 * Predicterra as the chip in the middle. Five sources of data sit on the left
 * (what goes in) and run into the chip along PCB traces; five results leave it
 * on the right (what comes out). Orange pulses travel along one conductor per
 * trace, inwards on the left and outwards on the right. Same ground, light,
 * shadows, camera springs and pointer tilt as the home's 3D trace
 * (world-trail.ts), so the two scrolls feel identical.
 *
 * Stops: 0 the whole board · 1 what goes in · 2 Predicterra · 3 what comes out
 * · 4 one result as a structured object (the risk event, card in the page).
 */
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  HemisphereLight,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshLambertMaterial,
  OrthographicCamera,
  PCFShadowMap,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type Vector4,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { plan, frame, box, beam, cylinder, tower, chip, building, moduleRow, silos, type Bucket } from './geometry';
import { createGroundMaterial, createFireMaterial, createFlowMaterial, HAZARD_SLOTS } from './materials';
import { scenePalette } from './palette';

type P = [number, number];

/** Anchors the page labels follow: in0–in4, out0–out4 and the chip. */
export type FlowAnchor = `in${0 | 1 | 2 | 3 | 4}` | `out${0 | 1 | 2 | 3 | 4}` | 'core';

export interface FlowWorld {
  setFocus(f: number): void;
  resize(width: number, height: number): void;
  tick(dt: number): boolean;
  project(id: FlowAnchor): { x: number; y: number };
  setPointer(x: number, y: number): void;
  setTheme(): void;
  snap(): void;
  dispose(): void;
}

const DEG = Math.PI / 180;
/** Rows of the sources and results (plan v), top to bottom on screen. */
const ROWS = [-28, -14, 0, 14, 28];
const IN_U = -40;
const OUT_U = 40;
const CHIP = 14;

// Per stop: board, inputs, chip, outputs, the risk event.
const STOP_TARGET: P[] = [
  [0, 0],
  [IN_U + 6, -2],
  [0, 0],
  [OUT_U + 6, -3],
  // Right of the tower, so it sits left of centre with its card beside it.
  [OUT_U + 9, ROWS[0] + 2],
];
const STOP_LIFT = [1, 3, 1, 3.5, 4.5];
const STOP_VIEW = [76, 50, 24, 50, 26];
const STOP_AZIMUTH = [45, 38, 50, 52, 42];
const STOP_ELEVATION = [40, 33, 44, 34, 36];
const STOPS = STOP_TARGET.length;
const TILT_ELEVATION = 3.5;
const TILT_AZIMUTH = 2.5;

const CAM_DIR = new Vector3();
const SCREEN_RIGHT = new Vector3();
const SCREEN_UP = new Vector3();
function setBasis(az: number, el: number) {
  CAM_DIR.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
  SCREEN_RIGHT.set(Math.cos(az), 0, -Math.sin(az));
  SCREEN_UP.crossVectors(CAM_DIR, SCREEN_RIGHT).normalize();
}

export function createFlowWorld(canvas: HTMLCanvasElement, opts: { reducedMotion: boolean; lowPower: boolean }): FlowWorld {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  scene.background = new Color(scenePalette().bg);

  /* ---------------- Lights (as the home's trace) ---------------- */
  scene.add(new HemisphereLight(0xffffff, 0xc4c4c4, 2.0));
  scene.add(new AmbientLight(0xffffff, 0.55));
  const sun = new DirectionalLight(0xffffff, 1.6);
  sun.castShadow = true;
  const shadowSize = opts.lowPower ? 2048 : 4096;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 220;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 3;
  const sc = sun.shadow.camera;
  sc.left = -62;
  sc.right = 62;
  sc.top = 62;
  sc.bottom = -62;
  const lightOffset = plan(-1, -0.55).normalize().multiplyScalar(70).add(new Vector3(0, 95, 0));
  scene.add(sun, sun.target);

  /* ---------------- Ground ---------------- */
  const groundMat = createGroundMaterial({ pixel: Math.max(1, Math.round(1.5 * dpr)) });
  const ground = new Mesh(new PlaneGeometry(420, 420), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const statics: Bucket = [];
  const accent: Bucket = [];

  /* ---------------- Predicterra: the chip ---------------- */
  const core = chip(statics, 0, 0, accent, CHIP, 9);
  const west = core.sides.find((s) => s.n[0] === -1)!;
  const east = core.sides.find((s) => s.n[0] === 1)!;
  // The five live pins on each side (every other pin); the rest get short stubs.
  const livePins = [0, 2, 4, 6, 8];

  /* ---------------- Traces ---------------- */
  // PCB style: straight out of the source, a 45° jog to the pin's row, straight into the pin.
  const traceIn = (k: number): P[] => {
    const [pu, pv] = west.tips[livePins[k]];
    const v = ROWS[k];
    const jog = Math.abs(v - pv);
    const a = pu - 5;
    return [
      [IN_U + 4.2, v],
      [a - jog, v],
      [a, pv],
      [pu, pv],
    ];
  };
  const traceOut = (k: number): P[] => {
    const [pu, pv] = east.tips[livePins[k]];
    const v = ROWS[k];
    const jog = Math.abs(v - pv);
    const a = pu + 5;
    return [
      [pu, pv],
      [a, pv],
      [a + jog, v],
      [OUT_U - 4.2, v],
    ];
  };
  const ins = ROWS.map((_, k) => traceIn(k));
  const outs = ROWS.map((_, k) => traceOut(k));

  // Stubs on the unused pins, and decorative traces off the top and bottom sides.
  const stubs: P[][] = [];
  for (const side of [west, east]) {
    side.tips.forEach((t, k) => {
      if (livePins.includes(k)) return;
      stubs.push([t, [t[0] + side.n[0] * 2.2, t[1]]]);
    });
  }
  for (const side of core.sides.filter((s) => s.n[1] !== 0)) {
    side.tips.forEach(([u, v], k) => {
      const reach = 8 + ((k * 7) % 5) * 3;
      const lean = (k - 4) * 1.6;
      stubs.push([
        [u, v],
        [u, v + side.n[1] * 3],
        [u + lean, v + side.n[1] * (3 + Math.abs(lean))],
        [u + lean, v + side.n[1] * reach],
      ]);
    });
  }
  // Square pads where every trace ends and bends.
  for (const path of [...ins, ...outs]) {
    path.slice(0, -1).forEach(([u, v], i) => {
      const pad = i === 0 ? 0.9 : 0.6;
      statics.push(box(pad, 0.07, pad, plan(u, v, 0.04), Math.PI / 4));
    });
  }

  /* ---------------- What goes in (white) ---------------- */
  const plinth = (u: number, v: number) => statics.push(box(7.4, 0.24, 7.4, plan(u, v, 0.12), Math.PI / 4));
  ROWS.forEach((v) => plinth(IN_U, v));
  {
    // 001 Asset registry: a database, three stacked disks.
    const f = frame(IN_U, ROWS[0]);
    for (let i = 0; i < 3; i++) statics.push(cylinder(2, 2, 0.85, f.at(0, 0.24 + 0.45 + i * 1.05, 0), 32));
  }
  {
    // 002 Locations: a transmission tower.
    tower(statics, IN_U, ROWS[1], -0.38);
  }
  {
    // 003 Thresholds: posts of different heights under one limit bar.
    const f = frame(IN_U, ROWS[2]);
    const hs = [1.6, 2.6, 3.8, 2.2];
    hs.forEach((h, i) => statics.push(box(0.7, h, 0.7, f.at(-2.1 + i * 1.4, 0.24 + h / 2, 0), f.rot)));
    statics.push(box(5.6, 0.16, 0.16, f.at(0, 3.2, 0.5), f.rot));
    statics.push(box(0.16, 3.0, 0.16, f.at(-2.85, 1.7, 0.5), f.rot));
    statics.push(box(0.16, 3.0, 0.16, f.at(2.85, 1.7, 0.5), f.rot));
  }
  {
    // 004 Incident history: a stack of records, a little askew.
    const f = frame(IN_U, ROWS[3]);
    for (let i = 0; i < 6; i++) {
      const yaw = ((i * 37) % 11) / 11 - 0.45;
      statics.push(box(3.6, 0.3, 2.6, f.at(((i * 13) % 5) * 0.1 - 0.2, 0.24 + 0.15 + i * 0.34, 0), f.rot + yaw * 0.35));
    }
  }
  {
    // 005 Enterprise systems: server racks.
    const f = frame(IN_U, ROWS[4]);
    for (let i = 0; i < 4; i++) {
      statics.push(box(1.1, 3.4, 2.4, f.at(-2 + i * 1.35, 0.24 + 1.7, 0), f.rot));
      for (let k = 0; k < 4; k++) statics.push(box(1.12, 0.08, 2.0, f.at(-2 + i * 1.35, 0.24 + 0.6 + k * 0.7, 0.25), f.rot));
    }
  }

  /* ---------------- What comes out (white, the result in orange) ---------------- */
  ROWS.forEach((v) => plinth(OUT_U, v));
  {
    // 001 Asset-level risk: a tower at risk, with the hazard field under it.
    tower(accent, OUT_U, ROWS[0], -0.38);
  }
  {
    // 002 Impact forecast: bars rising towards the event, the last one in orange.
    const f = frame(OUT_U, ROWS[1]);
    const hs = [0.8, 1.2, 1.7, 2.4, 3.4];
    hs.forEach((h, i) => (i === hs.length - 1 ? accent : statics).push(box(0.85, h, 1.6, f.at(-2.4 + i * 1.2, 0.24 + h / 2, 0), f.rot)));
  }
  {
    // 003 Dependency map: nodes linked in a cascade from one orange origin.
    const f = frame(OUT_U, ROWS[2]);
    const nodes: [number, number][] = [
      [-2.4, -1.6],
      [0, -2.2],
      [2.4, -0.8],
      [-1, 1.2],
      [1.6, 2],
      [-2.8, 1.8],
    ];
    const links = [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [2, 4],
      [3, 5],
    ];
    const at = (n: number, y: number) => f.at(nodes[n][0], y, nodes[n][1]);
    links.forEach(([a, b]) => statics.push(beam(at(a, 0.75), at(b, 0.75), 0.12)));
    nodes.forEach((_, i) => (i === 0 ? accent : statics).push(cylinder(0.55, 0.55, 1, at(i, 0.74), 18)));
  }
  {
    // 004 Operational action: a crew truck dispatched, beacon in orange.
    const f = frame(OUT_U, ROWS[3], 0.2);
    statics.push(box(3.4, 1.7, 1.8, f.at(-0.6, 0.24 + 0.35 + 0.85, 0), f.rot));
    statics.push(box(1.4, 1.3, 1.8, f.at(1.9, 0.24 + 0.35 + 0.65, 0), f.rot));
    accent.push(box(0.5, 0.25, 0.9, f.at(1.9, 0.24 + 0.35 + 1.45, 0), f.rot));
    for (const x of [-1.6, 0.6, 1.9]) for (const z of [-0.95, 0.95]) statics.push(cylinder(0.35, 0.35, 0.3, f.at(x, 0.24 + 0.35, z), 14));
  }
  {
    // 005 Audit-ready evidence: a neat stack of reports under an orange seal.
    const f = frame(OUT_U, ROWS[4]);
    for (let i = 0; i < 5; i++) statics.push(box(3.4, 0.28, 2.6, f.at(0, 0.24 + 0.14 + i * 0.3, 0), f.rot));
    accent.push(cylinder(0.6, 0.6, 0.18, f.at(0.6, 0.24 + 1.6, 0.3), 24));
  }

  /* ---------------- Context: sparse buildings around the board ---------------- */
  const rand = mulberry32(23);
  for (let u = -100; u <= 100; u += 11) {
    for (let v = -70; v <= 70; v += 10) {
      const ju = u + (rand() - 0.5) * 6;
      const jv = v + (rand() - 0.5) * 5;
      if (Math.abs(ju) < 52 && Math.abs(jv) < 40) continue;
      const kind = rand();
      if (kind < 0.26) building(statics, ju, jv, 2 + rand() * 4, 0.6 + rand() * 1.6, 1.6 + rand() * 3, rand() < 0.5 ? 0 : Math.PI / 2);
      else if (kind < 0.42) moduleRow(statics, ju, jv, 3 + Math.floor(rand() * 5), rand() < 0.5 ? 0 : Math.PI / 2);
      else if (kind < 0.48) silos(statics, ju, jv);
    }
  }

  const whiteMat = new MeshLambertMaterial({ color: 0xffffff });
  const fireMat = createFireMaterial();
  const merged = mergeGeometries(statics, false);
  const mergedAccent = mergeGeometries(accent, false);
  [...statics, ...accent].forEach((g) => g.dispose());
  for (const [geo, mat] of [
    [merged, whiteMat],
    [mergedAccent, fireMat],
  ] as const) {
    const m = new Mesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
  }

  /* ---------------- Lines ---------------- */
  const lineMat = new LineBasicMaterial({ color: new Color('#BDBDBD') });
  const decoMat = new LineBasicMaterial({ color: new Color('#D2D2D2') });
  const inMat = createFlowMaterial();
  const outMat = createFlowMaterial();
  for (const m of [inMat, outMat]) {
    m.uniforms.uMinAlpha.value = 0.2;
    m.uniforms.uSpeed.value = 7;
    m.uniforms.uPeriod.value = 16;
  }
  // Path order sets the pulse direction: towards the chip on the left, away from it on the right.
  ins.forEach((p) => addBundle(scene, p, lineMat, inMat, 3, 0.24));
  outs.forEach((p) => addBundle(scene, p, lineMat, outMat, 3, 0.24));
  stubs.forEach((p) => addBundle(scene, p, decoMat, null, 1, 0));
  // Long decorative traces across the board, like the home's circuit.
  for (const [v, n] of [
    [-46, 5],
    [46, 4],
  ] as const) {
    addBundle(scene, [[-120, v], [-60, v], [-50, v + Math.sign(v) * 10], [60, v + Math.sign(v) * 10], [70, v], [120, v]], decoMat, null, n, 0.22);
  }

  /* ---------------- Anchors, hazard, stops ---------------- */
  const anchors = new Map<FlowAnchor, Vector3>();
  // Labels sit on the outer side of each plinth, at one height, so tall and
  // short objects line up and no label covers its neighbour.
  ROWS.forEach((v, k) => {
    anchors.set(`in${k}` as FlowAnchor, plan(IN_U - 4.4, v, 1));
    anchors.set(`out${k}` as FlowAnchor, plan(OUT_U + 4.4, v, 1));
  });
  anchors.set('core', core.anchor.clone().add(new Vector3(0, 0.8, 0)));

  const hz = groundMat.uniforms.uHazards.value as Vector4[];
  const risk = plan(OUT_U, ROWS[0]);
  hz[0].set(risk.x, risk.z, 8, 0);
  const hazardTarget = new Array(HAZARD_SLOTS).fill(0);

  /* ---------------- Camera (springs as in world-trail.ts) ---------------- */
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 600);
  let width = 1;
  let height = 1;
  const stopWorld = STOP_TARGET.map(([u, v]) => plan(u, v));
  const goal = { target: new Vector3(), view: STOP_VIEW[0], az: STOP_AZIMUTH[0], el: STOP_ELEVATION[0] };
  const cur = { target: new Vector3(), view: STOP_VIEW[0], az: STOP_AZIMUTH[0], el: STOP_ELEVATION[0] };
  const vel = { target: new Vector3(), view: 0, az: 0, el: 0 };
  const tiltGoal = { x: 0, y: 0 };
  const tilt = { x: 0, y: 0, vx: 0, vy: 0 };

  function goalFor(f: number) {
    const i = Math.min(STOPS - 2, Math.floor(f));
    // Past the last stop (t > 1) the camera keeps drifting the same way while
    // the next section covers the stage, so the scroll never stops dead.
    const t = f - i;
    const tc = Math.min(1, t);
    goal.target.lerpVectors(stopWorld[i], stopWorld[i + 1], t);
    goal.target.y = STOP_LIFT[i] + (STOP_LIFT[i + 1] - STOP_LIFT[i]) * tc;
    // Dolly out a little mid-flight so each move reads as travel.
    const bump = Math.sin(Math.PI * tc) * 6;
    goal.view = STOP_VIEW[i] + (STOP_VIEW[i + 1] - STOP_VIEW[i]) * tc + bump;
    const e = tc * tc * (3 - 2 * tc);
    goal.az = STOP_AZIMUTH[i] + (STOP_AZIMUTH[i + 1] - STOP_AZIMUTH[i]) * e;
    goal.el = STOP_ELEVATION[i] + (STOP_ELEVATION[i + 1] - STOP_ELEVATION[i]) * e;
  }
  goalFor(0);
  cur.target.copy(goal.target);

  function applyCamera() {
    setBasis((cur.az + tilt.x * TILT_AZIMUTH) * DEG, (cur.el - tilt.y * TILT_ELEVATION) * DEG);
    const aspect = width / height;
    const viewH = Math.max(cur.view, (cur.view * 0.95) / aspect);
    const viewW = viewH * aspect;
    camera.left = -viewW / 2;
    camera.right = viewW / 2;
    camera.top = viewH / 2;
    camera.bottom = -viewH / 2;
    // The copy sits on the left (top on phones): the subject moves right (down).
    const shiftX = aspect > 1.1 ? viewW * 0.14 : 0;
    const shiftY = aspect < 0.9 ? viewH * 0.2 : 0;
    const t = cur.target.clone().addScaledVector(SCREEN_RIGHT, -shiftX).addScaledVector(SCREEN_UP, shiftY);
    camera.position.copy(t).addScaledVector(CAM_DIR, 200);
    camera.lookAt(t);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    sun.target.position.copy(cur.target);
    sun.position.copy(cur.target).add(lightOffset);
    sun.target.updateMatrixWorld();
  }

  function setFocus(f: number) {
    const focus = Math.max(0, Math.min(STOPS - 1 + 0.6, f));
    goalFor(focus);
    // The hazard field shows from "what comes out" on.
    hazardTarget[0] = Math.round(focus) >= 3 ? 1 : 0;
  }

  function resize(w: number, h: number) {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setSize(width, height, false);
    applyCamera();
  }

  let time = 0;
  const acc = new Vector3();
  function tick(dt: number) {
    dt = Math.min(dt, 1 / 20);
    time += dt;
    let moving = false;
    if (opts.reducedMotion) {
      cur.target.copy(goal.target);
      cur.view = goal.view;
      cur.az = goal.az;
      cur.el = goal.el;
    } else {
      const omega = (2 * Math.PI) / 0.45;
      acc.subVectors(cur.target, goal.target).multiplyScalar(-omega * omega).addScaledVector(vel.target, -2 * omega);
      vel.target.addScaledVector(acc, dt);
      cur.target.addScaledVector(vel.target, dt);
      vel.view += (-omega * omega * (cur.view - goal.view) - 2 * omega * vel.view) * dt;
      cur.view += vel.view * dt;
      vel.az += (-omega * omega * (cur.az - goal.az) - 2 * omega * vel.az) * dt;
      cur.az += vel.az * dt;
      vel.el += (-omega * omega * (cur.el - goal.el) - 2 * omega * vel.el) * dt;
      cur.el += vel.el * dt;
      const w = (2 * Math.PI) / 0.9;
      tilt.vx += (-w * w * (tilt.x - tiltGoal.x) - 2 * w * tilt.vx) * dt;
      tilt.vy += (-w * w * (tilt.y - tiltGoal.y) - 2 * w * tilt.vy) * dt;
      tilt.x += tilt.vx * dt;
      tilt.y += tilt.vy * dt;
      moving = vel.target.lengthSq() > 1e-5 || Math.abs(vel.view) > 1e-3;
    }
    applyCamera();
    for (let k = 0; k < HAZARD_SLOTS; k++) {
      const v = hz[k];
      const next = v.w + (hazardTarget[k] - v.w) * Math.min(1, dt * 4);
      v.w = Math.abs(next - hazardTarget[k]) < 0.002 ? hazardTarget[k] : next;
      if (v.w !== hazardTarget[k]) moving = true;
    }
    if (!opts.reducedMotion) {
      groundMat.uniforms.uTime.value = time;
      inMat.uniforms.uTime.value = time;
      outMat.uniforms.uTime.value = time;
    }
    renderer.render(scene, camera);
    return moving;
  }

  const _v = new Vector3();
  function project(id: FlowAnchor) {
    _v.copy(anchors.get(id)!).project(camera);
    return { x: ((_v.x + 1) / 2) * width, y: ((1 - _v.y) / 2) * height };
  }

  function setPointer(x: number, y: number) {
    if (opts.reducedMotion) return;
    tiltGoal.x = Math.max(-1, Math.min(1, x));
    tiltGoal.y = Math.max(-1, Math.min(1, y));
  }

  function setTheme() {
    const p = scenePalette();
    renderer.setClearColor(new Color(p.bg), 1);
    (scene.background as Color).set(p.bg);
    groundMat.uniforms.uBase.value.set(p.bg);
    groundMat.uniforms.uGridDot.value.set(p.gridDot);
    groundMat.uniforms.uShadow.value.set(p.shadow);
    groundMat.uniforms.uAccent.value.set(p.hazard);
    whiteMat.color.set(p.asset);
    lineMat.color.set(p.line);
    decoMat.color.set(p.deco);
    inMat.uniforms.uIdle.value.set(p.idle);
    outMat.uniforms.uIdle.value.set(p.idle);
  }
  setTheme();

  function snap() {
    cur.target.copy(goal.target);
    cur.view = goal.view;
    cur.az = goal.az;
    cur.el = goal.el;
    vel.target.set(0, 0, 0);
    vel.view = vel.az = vel.el = 0;
    applyCamera();
  }

  function dispose() {
    renderer.dispose();
    merged.dispose();
    mergedAccent.dispose();
    whiteMat.dispose();
    fireMat.dispose();
    groundMat.dispose();
    inMat.dispose();
    outMat.dispose();
    lineMat.dispose();
    decoMat.dispose();
    scene.traverse((o) => {
      if ((o as Line).isLine) (o as Line).geometry.dispose();
    });
  }

  setBasis(STOP_AZIMUTH[0] * DEG, STOP_ELEVATION[0] * DEG);
  return { setFocus, resize, tick, project, setPointer, setTheme, snap, dispose };
}

/** Parallel lines along a plan polyline; the middle one carries the orange pulses. */
function addBundle(
  scene: Scene,
  path: P[],
  lineMat: LineBasicMaterial,
  accentMat: ReturnType<typeof createFlowMaterial> | null,
  count: number,
  spacing: number,
) {
  // Drop repeated points (a straight trace has no jog), so the offsets stay finite.
  path = path.filter((q, i) => i === 0 || q[0] !== path[i - 1][0] || q[1] !== path[i - 1][1]);
  const accentIndex = Math.floor(count / 2);
  for (let k = 0; k < count; k++) {
    const off = (k - (count - 1) / 2) * spacing;
    const pts = (off ? offsetPolyline(path, off) : path).map(([u, v]) => plan(u, v, 0.03));
    const geo = new BufferGeometry().setFromPoints(pts);
    if (accentMat && k === accentIndex) {
      const dist = new Float32Array(pts.length);
      for (let i = 1; i < pts.length; i++) dist[i] = dist[i - 1] + pts[i].distanceTo(pts[i - 1]);
      geo.setAttribute('aDist', new BufferAttribute(dist, 1));
      const line = new Line(geo, accentMat);
      line.renderOrder = 2;
      scene.add(line);
    } else {
      scene.add(new Line(geo, lineMat));
    }
  }
}

function offsetPolyline(pts: P[], d: number): P[] {
  const out: P[] = [];
  const n = pts.length;
  const normal = (a: P, b: P): P => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  };
  for (let i = 0; i < n; i++) {
    let nx: number;
    let ny: number;
    if (i === 0) [nx, ny] = normal(pts[0], pts[1]);
    else if (i === n - 1) [nx, ny] = normal(pts[n - 2], pts[n - 1]);
    else {
      const a = normal(pts[i - 1], pts[i]);
      const b = normal(pts[i], pts[i + 1]);
      const mx = a[0] + b[0];
      const my = a[1] + b[1];
      const ml = Math.hypot(mx, my) || 1;
      const cos = (mx / ml) * a[0] + (my / ml) * a[1];
      nx = mx / ml / cos;
      ny = my / ml / cos;
    }
    out.push([pts[i][0] + nx * d, pts[i][1] + ny * d]);
  }
  return out;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
