/**
 * Platform, "The Cognitive Twin of the energy system": one stretch of grid
 * (five towers, the line between them, a substation, the trees along the
 * corridor) that gains a level at each stop, so the descriptive and the
 * physical twins read as steps towards the Cognitive Twin:
 *
 *  0  the whole corridor, as a plan
 *  1  descriptive twin: a map. Footprints and the line's route, flat, grey,
 *     seen from above; the page labels name each asset
 *  2  physical twin: the assets rise in grey and a simulated hazard field
 *     (dithered, grey) spreads around the exposed span
 *  3  Cognitive Twin: the assets in full, the tower at risk in the brand's
 *     fire gradient, the hazard in orange and orange pulses running from it
 *     to the substation it feeds; the decision card opens beside it
 *
 * Everything moves with the scroll (the assets grow between 1 and 2, the
 * colour comes between 2 and 3). Same ground, light, shadows, camera springs
 * and pointer tilt as the home's 3D trace and the data flow (world-flow.ts).
 */
import {
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  HemisphereLight,
  Line,
  LineBasicMaterial,
  LineSegments,
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
import { plan, tower, cable, substation, building, tree, type Bucket } from './geometry';
import { createGroundMaterial, createFireMaterial, createFlowMaterial, HAZARD_SLOTS } from './materials';
import { scenePalette } from './palette';
import { isDarkTheme } from '../theme';
import { addBundle, mulberry32 } from './world-flow';

type P = [number, number];

/** Anchors the page labels follow: the five towers, the substation, the risk. */
export type TwinAnchor = `t${0 | 1 | 2 | 3 | 4}` | 'sub' | 'hazard' | 'risk';

export interface TwinWorld {
  setFocus(f: number): void;
  resize(width: number, height: number): void;
  tick(dt: number): boolean;
  project(id: string): { x: number; y: number };
  setPointer(x: number, y: number): void;
  setTheme(): void;
  snap(): void;
  dispose(): void;
}

const DEG = Math.PI / 180;
/** The line: towers along u, the third one exposed. */
const TOWERS: P[] = [
  [-38, 2],
  [-19, 0],
  [0, -1],
  [19, 0],
  [38, 2],
];
const RISK = 2;
const SUB: P = [56, 9];

// Per stop: the corridor, the map, the exposed span, the whole twin.
const STOP_TARGET: P[] = [
  [6, 2],
  [6, 2],
  [2, 0],
  // The tower at risk left of centre, clear of the copy, the substation on the right.
  [12, 2],
];
const STOP_LIFT = [1, 0.5, 4, 3.5];
const STOP_VIEW = [96, 84, 46, 76];
const STOP_AZIMUTH = [45, 40, 52, 46];
// The map is seen almost from above; the twins at the usual angle.
const STOP_ELEVATION = [44, 70, 30, 36];
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

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

export function createTwinWorld(canvas: HTMLCanvasElement, opts: { reducedMotion: boolean; lowPower: boolean }): TwinWorld {
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
  sc.left = -70;
  sc.right = 70;
  sc.top = 70;
  sc.bottom = -70;
  const lightOffset = plan(-1, -0.55).normalize().multiplyScalar(70).add(new Vector3(0, 95, 0));
  scene.add(sun, sun.target);

  /* ---------------- Ground ---------------- */
  const groundMat = createGroundMaterial({ pixel: Math.max(1, Math.round(1.5 * dpr)) });
  const ground = new Mesh(new PlaneGeometry(460, 460), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---------------- The assets ---------------- */
  const statics: Bucket = [];
  const exposed: Bucket = [];
  // Plan footprints for the map (line segments on the ground).
  const marks: Vector3[] = [];
  const square = (u: number, v: number, w: number, d: number) => {
    const c = [plan(u - w / 2, v - d / 2, 0.05), plan(u + w / 2, v - d / 2, 0.05), plan(u + w / 2, v + d / 2, 0.05), plan(u - w / 2, v + d / 2, 0.05)];
    for (let i = 0; i < 4; i++) marks.push(c[i], c[(i + 1) % 4]);
  };

  const tips = TOWERS.map(([u, v], i) => tower(i === RISK ? exposed : statics, u, v, -0.1));
  TOWERS.forEach(([u, v]) => square(u, v, 3, 3));
  // Conductors between neighbouring towers.
  for (let i = 0; i < tips.length - 1; i++) {
    tips[i].tips.forEach((a, k) => statics.push(cable(a, tips[i + 1].tips[k], 0.9)));
  }
  // The route on the map: a dashed centreline between the towers.
  for (let i = 0; i < TOWERS.length - 1; i++) {
    const [u0, v0] = TOWERS[i];
    const [u1, v1] = TOWERS[i + 1];
    const n = 8;
    for (let k = 0; k < n; k += 2) {
      const a = k / n;
      const b = (k + 1) / n;
      marks.push(plan(u0 + (u1 - u0) * a, v0 + (v1 - v0) * a, 0.05), plan(u0 + (u1 - u0) * b, v0 + (v1 - v0) * b, 0.05));
    }
  }

  const sub = substation(statics, SUB[0], SUB[1]);
  square(SUB[0], SUB[1], 15.6, 10.6);

  // Trees along the corridor, thicker around the exposed span.
  const rand = mulberry32(41);
  for (let i = 0; i < 26; i++) {
    const near = i < 12;
    const u = near ? TOWERS[RISK][0] + (rand() - 0.5) * 16 : -60 + rand() * 120;
    const side = rand() < 0.5 ? -1 : 1;
    const v = near ? side * (2.6 + rand() * 5) : side * (6 + rand() * 14);
    if (Math.abs(u - SUB[0]) < 10 && Math.abs(v - SUB[1]) < 8) continue;
    const h = 2 + rand() * 1.6;
    tree(statics, u, v, h);
    // A dot on the map for each tree.
    const p = plan(u, v, 0.05);
    marks.push(plan(u - 0.4, v, 0.05), plan(u + 0.4, v, 0.05), p.clone().setY(0.05), p.clone().setY(0.05));
  }

  // Context: sparse buildings outside the corridor.
  for (let u = -110; u <= 120; u += 12) {
    for (let v = -80; v <= 80; v += 11) {
      const ju = u + (rand() - 0.5) * 6;
      const jv = v + (rand() - 0.5) * 5;
      if (Math.abs(jv) < 26 && ju > -70 && ju < 80) continue;
      if (rand() < 0.3) {
        const w = 2 + rand() * 4;
        const d = 1.6 + rand() * 3;
        const yaw = rand() < 0.5 ? 0 : Math.PI / 2;
        building(statics, ju, jv, w, 0.6 + rand() * 1.6, d, yaw);
        if (yaw === 0) square(ju, jv, w, d);
        else square(ju, jv, d, w);
      }
    }
  }

  const assetMat = new MeshLambertMaterial({ color: 0xffffff });
  const fireMat = createFireMaterial();
  const merged = mergeGeometries(statics, false);
  const mergedExposed = mergeGeometries(exposed, false);
  [...statics, ...exposed].forEach((g) => g.dispose());
  const assets = new Mesh(merged, assetMat);
  // The exposed tower: grey with the rest until the Cognitive Twin, then on fire.
  const exposedGrey = new Mesh(mergedExposed, assetMat);
  const exposedFire = new Mesh(mergedExposed, fireMat);
  for (const m of [assets, exposedGrey, exposedFire]) {
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
  }

  // The map: footprints, the route and the trees as lines on the ground.
  const mapMat = new LineBasicMaterial({ color: new Color('#BDBDBD'), transparent: true });
  const map = new LineSegments(new BufferGeometry().setFromPoints(marks), mapMat);
  map.renderOrder = 1;
  scene.add(map);

  /* ---------------- The link to the substation (Cognitive Twin) ---------------- */
  const lineMat = new LineBasicMaterial({ color: new Color('#BDBDBD') });
  const flowMat = createFlowMaterial();
  flowMat.uniforms.uMinAlpha.value = 0.25;
  flowMat.uniforms.uSpeed.value = 7;
  flowMat.uniforms.uPeriod.value = 16;
  const link = new Scene();
  // From the exposed tower, along the line, to the substation's gate.
  const linkPath: P[] = [
    [TOWERS[RISK][0], TOWERS[RISK][1] + 4],
    [TOWERS[3][0], TOWERS[3][1] + 4],
    [TOWERS[4][0], TOWERS[4][1] + 4],
    [SUB[0] - 12, TOWERS[4][1] + 4],
    [SUB[0] - 8, SUB[1]],
  ];
  addBundle(link, linkPath, lineMat, flowMat, 3, 0.3);
  const linkLines = [...link.children];
  linkLines.forEach((l) => scene.add(l));

  /* ---------------- Anchors, hazard, stops ---------------- */
  const anchors = new Map<string, Vector3>();
  TOWERS.forEach(([u, v], i) => anchors.set(`t${i}`, plan(u, v, 0.4)));
  anchors.set('sub', plan(SUB[0], SUB[1] + 6, 0.4));
  anchors.set('hazard', plan(TOWERS[RISK][0] - 6, TOWERS[RISK][1] + 7, 0.4));
  anchors.set('risk', tips[RISK].top.clone());
  void sub;

  const hz = groundMat.uniforms.uHazards.value as Vector4[];
  const riskAt = plan(TOWERS[RISK][0], TOWERS[RISK][1]);
  hz[0].set(riskAt.x, riskAt.z, 11, 0);
  const hazardTarget = new Array(HAZARD_SLOTS).fill(0);

  /* ---------------- Scroll-linked levels ---------------- */
  // grow: the assets rise (map → physical); cog: the colour arrives (physical → cognitive).
  const level = { grow: 0, cog: 0 };
  const levelGoal = { grow: 0, cog: 0 };
  const grey = new Color();
  const full = new Color();
  const hazardGrey = new Color();
  const hazardFull = new Color();

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
    const t = f - i;
    const tc = Math.min(1, t);
    goal.target.lerpVectors(stopWorld[i], stopWorld[i + 1], t);
    goal.target.y = STOP_LIFT[i] + (STOP_LIFT[i + 1] - STOP_LIFT[i]) * tc;
    const bump = Math.sin(Math.PI * tc) * 6;
    goal.view = STOP_VIEW[i] + (STOP_VIEW[i + 1] - STOP_VIEW[i]) * tc + bump;
    const e = smooth(tc);
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
    // Grow over the second half of the way to the physical twin; colour over
    // the second half of the way to the Cognitive Twin.
    levelGoal.grow = smooth(clamp01((focus - 1.3) / 0.6));
    levelGoal.cog = smooth(clamp01((focus - 2.3) / 0.6));
    hazardTarget[0] = focus >= 1.6 ? 1 : 0;
  }

  function resize(w: number, h: number) {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setSize(width, height, false);
    applyCamera();
  }

  function applyLevels() {
    // Flat footprints on the map, standing assets from the physical twin on.
    const sy = 0.02 + 0.98 * level.grow;
    for (const m of [assets, exposedGrey, exposedFire]) m.scale.y = sy;
    mapMat.opacity = 1 - 0.65 * level.grow;
    assetMat.color.copy(grey).lerp(full, level.cog);
    exposedFire.visible = level.cog > 0.5;
    exposedGrey.visible = !exposedFire.visible;
    (groundMat.uniforms.uAccent.value as Color).copy(hazardGrey).lerp(hazardFull, level.cog);
    const on = level.cog > 0.5;
    linkLines.forEach((l) => (l.visible = on));
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
      level.grow = levelGoal.grow;
      level.cog = levelGoal.cog;
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
      const k = Math.min(1, dt * 6);
      for (const key of ['grow', 'cog'] as const) {
        const next = level[key] + (levelGoal[key] - level[key]) * k;
        level[key] = Math.abs(next - levelGoal[key]) < 0.001 ? levelGoal[key] : next;
        if (level[key] !== levelGoal[key]) moving = true;
      }
    }
    applyLevels();
    applyCamera();
    for (let k = 0; k < HAZARD_SLOTS; k++) {
      const v = hz[k];
      const next = v.w + (hazardTarget[k] - v.w) * Math.min(1, dt * 4);
      v.w = Math.abs(next - hazardTarget[k]) < 0.002 ? hazardTarget[k] : next;
      if (v.w !== hazardTarget[k]) moving = true;
    }
    if (!opts.reducedMotion) {
      groundMat.uniforms.uTime.value = time;
      flowMat.uniforms.uTime.value = time;
    }
    renderer.render(scene, camera);
    return moving;
  }

  const _v = new Vector3();
  function project(id: string) {
    const a = anchors.get(id);
    if (!a) return { x: -9999, y: -9999 };
    _v.copy(a);
    // The tower's top follows the assets as they rise.
    if (id === 'risk') _v.y *= 0.02 + 0.98 * level.grow;
    _v.project(camera);
    return { x: ((_v.x + 1) / 2) * width, y: ((1 - _v.y) / 2) * height };
  }

  function setPointer(x: number, y: number) {
    if (opts.reducedMotion) return;
    tiltGoal.x = Math.max(-1, Math.min(1, x));
    tiltGoal.y = Math.max(-1, Math.min(1, y));
  }

  function setTheme() {
    const p = scenePalette();
    const dark = isDarkTheme();
    renderer.setClearColor(new Color(p.bg), 1);
    (scene.background as Color).set(p.bg);
    groundMat.uniforms.uBase.value.set(p.bg);
    groundMat.uniforms.uGridDot.value.set(p.gridDot);
    groundMat.uniforms.uShadow.value.set(p.shadow);
    // The earlier twins in a dull grey, the Cognitive Twin in the scene's own asset colour.
    grey.set(dark ? '#262626' : '#D4D4D4');
    full.set(p.asset);
    hazardGrey.set(dark ? '#2E2E2E' : '#B8B8B8');
    hazardFull.set('#FF3700');
    mapMat.color.set(dark ? '#4A4A4A' : '#A9A9A9');
    lineMat.color.set(p.line);
    flowMat.uniforms.uIdle.value.set(p.idle);
    applyLevels();
  }
  setTheme();

  function snap() {
    cur.target.copy(goal.target);
    cur.view = goal.view;
    cur.az = goal.az;
    cur.el = goal.el;
    vel.target.set(0, 0, 0);
    vel.view = vel.az = vel.el = 0;
    level.grow = levelGoal.grow;
    level.cog = levelGoal.cog;
    applyLevels();
    applyCamera();
  }

  function dispose() {
    renderer.dispose();
    merged.dispose();
    mergedExposed.dispose();
    assetMat.dispose();
    fireMat.dispose();
    groundMat.dispose();
    flowMat.dispose();
    lineMat.dispose();
    mapMat.dispose();
    map.geometry.dispose();
    scene.traverse((o) => {
      if ((o as Line).isLine) (o as Line).geometry.dispose();
    });
  }

  setBasis(STOP_AZIMUTH[0] * DEG, STOP_ELEVATION[0] * DEG);
  return { setFocus, resize, tick, project, setPointer, setTheme, snap, dispose };
}
