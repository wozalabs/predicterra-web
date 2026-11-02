/**
 * Isometric energy network rendered with three.js.
 * White, untextured assets; dithered shadows; scroll-driven camera focus.
 */
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
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
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import {
  plan,
  tower,
  substation,
  solarPlant,
  windTurbine,
  rotorGeometry,
  oilGas,
  building,
  moduleRow,
  silos,
  cable,
  type Bucket,
} from './geometry';
import { createGroundMaterial, createFlowMaterial, HAZARD_SLOTS } from './materials';

export type SectorId = 'grid' | 'substation' | 'solar' | 'wind' | 'oilgas';
export const SECTOR_ORDER: SectorId[] = ['grid', 'substation', 'solar', 'wind', 'oilgas'];

interface Stop {
  target: Vector3;
  /** Visible world height (orthographic). */
  view: number;
}

export interface World {
  /** f: 0 = overview, 1..5 = sector stops; fractional values interpolate. */
  setFocus(f: number): void;
  resize(width: number, height: number): void;
  /** Advances animation and renders. Returns true while the camera is still settling. */
  tick(dt: number): boolean;
  /** Screen-space position (CSS px) of each sector's alert anchor. */
  project(id: SectorId): { x: number; y: number };
  dispose(): void;
  /** Optional decorative tilt from the pointer, x/y in −1..1. */
  setPointer?(x: number, y: number): void;
}

/* Camera: 45° azimuth, ~34° elevation (near-isometric). */
const AZIMUTH = Math.PI / 4;
const ELEVATION = (34 * Math.PI) / 180;
const CAM_DIR = new Vector3(
  Math.sin(AZIMUTH) * Math.cos(ELEVATION),
  Math.sin(ELEVATION),
  Math.cos(AZIMUTH) * Math.cos(ELEVATION),
);
const SCREEN_RIGHT = new Vector3(Math.cos(AZIMUTH), 0, -Math.sin(AZIMUTH));
const SCREEN_UP = new Vector3().crossVectors(CAM_DIR, SCREEN_RIGHT).normalize();

export function createWorld(
  canvas: HTMLCanvasElement,
  opts: { reducedMotion: boolean; lowPower: boolean },
): World {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  const dpr = Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(new Color('#F0F0F0'), 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  scene.background = new Color('#F0F0F0');

  /* ---------------- Lights ---------------- */
  scene.add(new HemisphereLight(0xffffff, 0xc4c4c4, 2.0));
  scene.add(new AmbientLight(0xffffff, 0.55));
  const sun = new DirectionalLight(0xffffff, 1.6);
  sun.castShadow = true;
  const shadowSize = opts.lowPower ? 2048 : 4096;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 260;
  const sc = sun.shadow.camera;
  sc.left = -95;
  sc.right = 95;
  sc.top = 95;
  sc.bottom = -95;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 3;
  // Light from upper-left and slightly behind: shadows fall right and towards the viewer.
  const lightDir = plan(-1, -0.55).normalize();
  sun.position.set(lightDir.x * 90 + 6, 120, lightDir.z * 90);
  sun.target.position.set(6, 0, 0);
  scene.add(sun, sun.target);

  /* ---------------- Ground ---------------- */
  const groundMat = createGroundMaterial({ pixel: Math.max(1, Math.round(1.5 * dpr)) });
  const ground = new Mesh(new PlaneGeometry(420, 420), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---------------- Assets ---------------- */
  const statics: Bucket = [];

  // 01 Grid: transmission line from the west into the substation.
  const towerSpots: [number, number][] = [
    [-46, 13],
    [-38, 9.5],
    [-30, 6],
    [-22, 2.5],
    [-14, -1],
  ];
  const towers = towerSpots.map(([u, v]) => tower(statics, u, v, -0.41));
  for (let i = 0; i < towers.length - 1; i++) {
    towers[i].tips.forEach((a, k) => statics.push(cable(a, towers[i + 1].tips[k], 0.75)));
  }
  const gridFocus = towers[2];

  // 02 Substation
  const sub = substation(statics, -2, -6);
  towers[towers.length - 1].tips.slice(0, 2).forEach((a, k) => {
    statics.push(cable(a, sub.entry.clone().add(new Vector3(0, -k * 0.6, k * 0.6)), 0.5));
  });

  // 03 Solar (two blocks)
  const solarA = solarPlant(statics, 16, 14, 6, 4);
  solarPlant(statics, 16, 28, 6, 3);

  // 04 Wind (turbines face the camera so the rotor reads broadside)
  const facing = AZIMUTH + 0.18;
  const turbineSpots: [number, number, number][] = [
    [14, -22, 10.5],
    [24, -18, 11],
    [8, -12, 9.5],
    [32, -26, 10],
    [-4, -24, 9.8],
  ];
  const turbines = turbineSpots.map(([u, v, h]) => windTurbine(statics, u, v, facing, h));
  const windFocus = turbines[1];

  // 05 Oil & gas
  const og = oilGas(statics, 42, 4);

  // Context: buildings, container rows, silos (deterministic pseudo-random)
  const rand = mulberry32(7);
  const keepOut: [number, number, number][] = [
    [-30, 6, 9],
    [-2, -6, 11],
    [16, 21, 18],
    [16, -20, 16],
    [44, 4, 14],
  ];
  const free = (u: number, v: number, r: number) =>
    keepOut.every(([ku, kv, kr]) => Math.hypot(u - ku, v - kv) > kr + r);
  for (let u = -70; u <= 80; u += 11) {
    for (let v = -48; v <= 52; v += 10) {
      const ju = u + (rand() - 0.5) * 6;
      const jv = v + (rand() - 0.5) * 5;
      if (!free(ju, jv, 3)) continue;
      const kind = rand();
      if (kind < 0.3) {
        building(statics, ju, jv, 2 + rand() * 4, 0.6 + rand() * 1.6, 1.6 + rand() * 3, rand() < 0.5 ? 0 : Math.PI / 2);
      } else if (kind < 0.5) {
        moduleRow(statics, ju, jv, 3 + Math.floor(rand() * 5), rand() < 0.5 ? 0 : Math.PI / 2);
      } else if (kind < 0.58) {
        silos(statics, ju, jv);
      }
    }
  }

  const whiteMat = new MeshLambertMaterial({ color: 0xffffff });
  const merged = mergeGeometries(statics, false);
  statics.forEach((g) => g.dispose());
  const world = new Mesh(merged, whiteMat);
  world.castShadow = true;
  world.receiveShadow = true;
  scene.add(world);

  // Rotors (animated)
  const rotorGeo = mergeGeometries(rotorGeometry(), false);
  const rotors: Group[] = turbines.map((t, i) => {
    const pivot = new Group();
    pivot.position.copy(t.hub);
    pivot.rotation.y = t.facing;
    const rotor = new Mesh(rotorGeo, whiteMat);
    rotor.castShadow = true;
    rotor.receiveShadow = true;
    rotor.rotation.z = i * 0.7;
    pivot.add(rotor);
    scene.add(pivot);
    return pivot;
  });

  /* ---------------- Cable bundles on the ground ---------------- */
  const flowMat = createFlowMaterial();
  const lineMat = new LineBasicMaterial({ color: new Color('#BDBDBD') });
  const bundles: [number, number][][] = [
    // solar → substation
    [
      [9, 10],
      [9, 3],
      [5, -1],
      [3, -1],
    ],
    // wind → substation
    [
      [20, -16],
      [12, -8],
      [6, -8],
      [5, -7],
    ],
    // oil & gas → substation
    [
      [33, 6],
      [24, 6],
      [18, 0],
      [7, 0],
      [5, -2],
    ],
    // substation → east (off map)
    [
      [-8, -12],
      [-8, -20],
      [-16, -28],
      [-40, -28],
      [-48, -36],
    ],
    // decorative trunk south
    [
      [-12, 4],
      [-12, 18],
      [-2, 28],
      [4, 40],
      [4, 60],
    ],
  ];
  for (const path of bundles) addBundle(scene, path, lineMat, flowMat);

  /* ---------------- Anchors and stops ---------------- */
  const anchors: Record<SectorId, Vector3> = {
    grid: gridFocus.top.clone().add(new Vector3(0, 0.6, 0)),
    substation: sub.anchor.clone(),
    solar: solarA.anchor.clone().add(new Vector3(0, 0.6, 0)),
    wind: windFocus.top.clone().add(new Vector3(0, 0.4, 0)),
    oilgas: og.anchor.clone().add(new Vector3(0, 0.4, 0)),
  };

  const groundOf = (p: Vector3) => new Vector3(p.x, 0, p.z);
  const stops: Stop[] = [
    { target: plan(8, 0), view: 84 },
    { target: groundOf(anchors.grid).add(new Vector3(0, 4, 0)), view: 26 },
    { target: groundOf(anchors.substation).add(new Vector3(0, 1.5, 0)), view: 24 },
    { target: groundOf(anchors.solar), view: 30 },
    { target: groundOf(anchors.wind).add(new Vector3(0, 5, 0)), view: 32 },
    { target: groundOf(anchors.oilgas).add(new Vector3(0, 3, 0)), view: 30 },
  ];

  // Hazard zones in world XZ: (x, z, radius)
  const hz = groundMat.uniforms.uHazards.value as { set(x: number, y: number, z: number, w: number): void; w: number }[];
  const hazardSpots: [number, number, number][] = [
    [plan(-31, 9).x, plan(-31, 9).z, 9],
    [plan(-3, -4).x, plan(-3, -4).z, 11],
    [plan(16, 14).x, plan(16, 14).z, 12],
    [plan(23, -17).x, plan(23, -17).z, 11],
    [plan(46, 2).x, plan(46, 2).z, 13],
  ];
  hazardSpots.forEach(([x, z, r], i) => hz[i].set(x, z, r, 0));
  const hazardTarget = new Array(HAZARD_SLOTS).fill(0);

  /* ---------------- Camera ---------------- */
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 600);
  let width = 1;
  let height = 1;

  // Critically damped springs (response ≈ 0.55 s) on target + view.
  const cur = { target: stops[0].target.clone(), view: stops[0].view };
  const vel = { target: new Vector3(), view: 0 };
  const goal = { target: stops[0].target.clone(), view: stops[0].view };
  let focusF = 0;

  function applyCamera() {
    const aspect = width / height;
    // Keep enough width on portrait screens.
    const minWidth = Math.min(cur.view * 1.05, 70);
    const viewH = Math.max(cur.view, minWidth / aspect);
    const viewW = viewH * aspect;
    camera.left = -viewW / 2;
    camera.right = viewW / 2;
    camera.top = viewH / 2;
    camera.bottom = -viewH / 2;

    // Push the focus to the right of centre on wide screens (copy sits on the left).
    // Landscape: copy sits on the left, so push the focus right.
    // Portrait: copy sits at the top, so push the focus down.
    const shiftX = aspect > 1.1 ? viewW * (0.2 - 0.06 * Math.min(1, focusF)) : 0;
    const shiftY = aspect < 0.9 ? viewH * (0.14 - 0.1 * Math.min(1, focusF)) : 0;
    const t = cur.target
      .clone()
      .addScaledVector(SCREEN_RIGHT, -shiftX)
      .addScaledVector(SCREEN_UP, shiftY);
    camera.position.copy(t).addScaledVector(CAM_DIR, 200);
    camera.lookAt(t);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }

  function setFocus(f: number) {
    focusF = Math.max(0, Math.min(stops.length - 1, f));
    const i = Math.min(stops.length - 2, Math.floor(focusF));
    const t = focusF - i;
    const a = stops[i];
    const b = stops[i + 1];
    goal.target.lerpVectors(a.target, b.target, t);
    // Dolly out a little mid-flight so travelling between assets reads as a move.
    const bump = i === 0 ? 0 : Math.sin(Math.PI * t) * 7;
    goal.view = a.view + (b.view - a.view) * t + bump;

    const active = Math.round(focusF);
    for (let k = 0; k < HAZARD_SLOTS; k++) hazardTarget[k] = active === k + 1 ? 1 : 0;
  }

  function resize(w: number, h: number) {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setSize(width, height, false);
    applyCamera();
  }

  let time = 0;
  function tick(dt: number) {
    dt = Math.min(dt, 1 / 20);
    time += dt;
    let moving = false;

    if (opts.reducedMotion) {
      cur.target.copy(goal.target);
      cur.view = goal.view;
    } else {
      const omega = (2 * Math.PI) / 0.55;
      // Semi-implicit Euler on x'' = -ω²(x - goal) - 2ω x'
      const acc = new Vector3()
        .subVectors(cur.target, goal.target)
        .multiplyScalar(-omega * omega)
        .addScaledVector(vel.target, -2 * omega);
      vel.target.addScaledVector(acc, dt);
      cur.target.addScaledVector(vel.target, dt);
      const accV = -omega * omega * (cur.view - goal.view) - 2 * omega * vel.view;
      vel.view += accV * dt;
      cur.view += vel.view * dt;
      moving = vel.target.lengthSq() > 1e-5 || Math.abs(vel.view) > 1e-3;
    }
    applyCamera();

    // Hazard fields ease in/out.
    for (let k = 0; k < HAZARD_SLOTS; k++) {
      const v = hz[k];
      const next = v.w + (hazardTarget[k] - v.w) * Math.min(1, dt * 4);
      v.w = Math.abs(next - hazardTarget[k]) < 0.002 ? hazardTarget[k] : next;
      if (v.w !== hazardTarget[k]) moving = true;
    }

    if (!opts.reducedMotion) {
      rotors.forEach((r, i) => (r.children[0].rotation.z -= dt * (0.9 + i * 0.07)));
      groundMat.uniforms.uTime.value = time;
      flowMat.uniforms.uTime.value = time;
    }

    renderer.render(scene, camera);
    return moving;
  }

  const _v = new Vector3();
  function project(id: SectorId) {
    _v.copy(anchors[id]).project(camera);
    return { x: ((_v.x + 1) / 2) * width, y: ((1 - _v.y) / 2) * height };
  }

  function dispose() {
    renderer.dispose();
    merged.dispose();
    rotorGeo.dispose();
    whiteMat.dispose();
    groundMat.dispose();
    flowMat.dispose();
    lineMat.dispose();
    scene.traverse((o) => {
      if ((o as Line).isLine) (o as Line).geometry.dispose();
    });
  }

  setFocus(0);
  return { setFocus, resize, tick, project, dispose };
}

/** Parallel cable bundle along a plan-space polyline; one cable is orange and animated. */
function addBundle(
  scene: Scene,
  path: [number, number][],
  lineMat: LineBasicMaterial,
  flowMat: ReturnType<typeof createFlowMaterial>,
) {
  const count = 7;
  const spacing = 0.22;
  const accentIndex = 2;
  for (let k = 0; k < count; k++) {
    const off = (k - (count - 1) / 2) * spacing;
    const pts = offsetPolyline(path, off).map(([u, v]) => plan(u, v, 0.03));
    const geo = new BufferGeometry().setFromPoints(pts);
    if (k === accentIndex) {
      const dist = new Float32Array(pts.length);
      for (let i = 1; i < pts.length; i++) dist[i] = dist[i - 1] + pts[i].distanceTo(pts[i - 1]);
      geo.setAttribute('aDist', new BufferAttribute(dist, 1));
      const line = new Line(geo, flowMat);
      line.renderOrder = 2;
      scene.add(line);
    } else {
      scene.add(new Line(geo, lineMat));
    }
  }
}

/** Offsets a 2D polyline by `d` using mitred joints. */
function offsetPolyline(pts: [number, number][], d: number): [number, number][] {
  const out: [number, number][] = [];
  const n = pts.length;
  const normal = (a: [number, number], b: [number, number]) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l] as [number, number];
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
