/**
 * Variant B of the sector scene: "chip trace".
 * Assets sit on a diagonal towards the bottom right, joined by a circuit-like
 * cable bundle. The camera starts on the first asset and travels along the
 * trace as the user scrolls; the orange conductor fills up behind it.
 * The asset carrying the alert in each sector is painted orange.
 * After the five sectors come two capability stops with nothing at risk:
 * Digitalization (a chip, traces running into its core) and Compliance
 * (a surveyed site: fenced parcel, buffer line, setback to a protected stream).
 */
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
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
  type Vector4,
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
  box,
  chip,
  surveyedSite,
  type Bucket,
  type ChipSide,
} from './geometry';
import { createGroundMaterial, createFlowMaterial, HAZARD_SLOTS } from './materials';
import type { SectorId, World } from './world';

const AZIMUTH = Math.PI / 4;
const DEG = Math.PI / 180;
/** Camera angle at each stop (degrees): small variations make each arrival feel different. */
const STOP_AZIMUTH = [45, 33, 56, 38, 50, 40, 40];
const STOP_ELEVATION = [34, 29, 41, 27, 36, 44, 38];
/** Mouse tilt range (degrees) for the decorative parallax. */
const TILT_ELEVATION = 3.5;
const TILT_AZIMUTH = 2.5;

// Camera basis, recomputed every frame from the current azimuth/elevation.
const CAM_DIR = new Vector3();
const SCREEN_RIGHT = new Vector3();
const SCREEN_UP = new Vector3();
function setBasis(az: number, el: number) {
  CAM_DIR.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
  SCREEN_RIGHT.set(Math.cos(az), 0, -Math.sin(az));
  SCREEN_UP.crossVectors(CAM_DIR, SCREEN_RIGHT).normalize();
}

type P = [number, number];

/** One hop of the trace between two stops, in plan units (u right, v towards the viewer). */
const HOP: P[] = [
  [0, 0],
  [8, 0],
  [8, 12],
  [30, 34],
  [30, 42],
  [32, 42],
];
const HOP_DU = 32;
const HOP_DV = 42;
/** Five sectors, then Digitalization and Compliance. */
const STOPS = 7;

export const TRAIL_ORDER: SectorId[] = ['grid', 'substation', 'solar', 'wind', 'oilgas'];

export function createTrailWorld(
  canvas: HTMLCanvasElement,
  opts: { reducedMotion: boolean; lowPower: boolean },
): World {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(new Color('#F0F0F0'), 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  scene.background = new Color('#F0F0F0');

  /* ---------------- Trace geometry (plan space) ---------------- */
  const stopsPlan: P[] = Array.from({ length: STOPS }, (_, i) => [i * HOP_DU, i * HOP_DV]);
  const route: P[] = [];
  for (let i = 0; i < STOPS - 1; i++) {
    const [su, sv] = stopsPlan[i];
    HOP.forEach(([du, dv], k) => {
      if (i > 0 && k === 0) return; // shared vertex
      route.push([su + du, sv + dv]);
    });
  }
  // Lead-in and lead-out so the trace comes from and goes beyond the frame.
  const fullRoute: P[] = [[-30, -14], [-14, -14], [-8, -8], ...route, [STOPS * HOP_DU - 32 + 20, (STOPS - 1) * HOP_DV], [STOPS * HOP_DU + 40, (STOPS - 1) * HOP_DV + 40]];
  // fullRoute[3] is the first stop; every stop lies on the route.
  const routeWorld = fullRoute.map(([u, v]) => plan(u, v));
  const cum: number[] = [0];
  for (let i = 1; i < routeWorld.length; i++) cum.push(cum[i - 1] + routeWorld[i].distanceTo(routeWorld[i - 1]));
  const stopIndex = stopsPlan.map(([u, v]) => fullRoute.findIndex(([a, b]) => a === u && b === v));
  const stopS = stopIndex.map((i) => cum[i]);


  /* ---------------- Lights ---------------- */
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
  sc.left = -46;
  sc.right = 46;
  sc.top = 46;
  sc.bottom = -46;
  const lightOffset = plan(-1, -0.55).normalize().multiplyScalar(70).add(new Vector3(0, 95, 0));
  scene.add(sun, sun.target);

  /* ---------------- Ground ---------------- */
  const groundMat = createGroundMaterial({ pixel: Math.max(1, Math.round(1.5 * dpr)) });
  const mid = plan((STOPS - 1) * HOP_DU * 0.5, (STOPS - 1) * HOP_DV * 0.5);
  const ground = new Mesh(new PlaneGeometry(520, 520), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(mid.x, 0, mid.z);
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---------------- Assets ---------------- */
  const statics: Bucket = [];
  const risky: Bucket = [];
  const [s0, s1, s2, s3, s4, s5, s6] = stopsPlan;

  // 01 Grid: line of towers crossing the first stop; the middle one is at risk.
  const towerSpots: P[] = [-2, -1, 0, 1, 2].map((k) => [s0[0] - 2 + k * 8, s0[1] + 4 - k * 3.2]);
  const towers = towerSpots.map(([u, v], k) => tower(k === 2 ? risky : statics, u, v, -0.38));
  for (let i = 0; i < towers.length - 1; i++) {
    towers[i].tips.forEach((a, k) => statics.push(cable(a, towers[i + 1].tips[k], 0.75)));
  }

  // 02 Substation: middle transformer at risk.
  const sub = substation(statics, s1[0], s1[1], risky, 1);

  // 03 Solar: a 2×2 group of tables at risk.
  const solar = solarPlant(statics, s2[0] - 1, s2[1], 5, 4, {
    bucket: risky,
    tables: [
      [1, 2],
      [1, 3],
      [2, 2],
      [2, 3],
    ],
  });

  // 04 Wind: the middle turbine is at risk.
  const facing = AZIMUTH + 0.18;
  const turbineSpots: [number, number, number][] = [
    [s3[0] - 9, s3[1] - 5, 10],
    [s3[0], s3[1], 11],
    [s3[0] + 9, s3[1] + 3, 10.5],
    [s3[0] - 2, s3[1] + 10, 9.8],
  ];
  const turbines = turbineSpots.map(([u, v, h], i) => windTurbine(i === 1 ? risky : statics, u, v, facing, h));

  // 05 Oil & gas: one tank at risk.
  const og = oilGas(statics, s4[0] - 2, s4[1], risky, 1);

  // 06 Digitalization: a chip on the trace; the cable bundle runs into its core
  // and traces fan in from every side. Nothing at risk: the orange core is an
  // accent only (no marker, no panel, no hazard field).
  const dig = chip(statics, s5[0], s5[1], risky);
  const { paths: fanIn, live: fanInLive } = chipTraces(dig.sides);
  fanIn.forEach((path) => {
    const end = plan(path[0][0], path[0][1], 0.04);
    statics.push(box(0.55, 0.08, 0.55, end, Math.PI / 4));
  });

  // 07 Compliance: a surveyed site with a measured setback to a protected stream.
  // The fence is the orange accent.
  const site = surveyedSite(statics, s6[0], s6[1], risky);

  // Vias: small square pads on every bend of the trace.
  fullRoute.slice(1, -1).forEach(([u, v]) => {
    const p = plan(u, v, 0.04);
    statics.push(box(1.1, 0.08, 1.1, p, Math.PI / 4));
  });

  // Context: sparse buildings, avoiding stops and the trace.
  const rand = mulberry32(19);
  const segDist = (u: number, v: number) => {
    let d = Infinity;
    for (const path of [fullRoute, ...fanIn, site.stream]) {
      for (let i = 1; i < path.length; i++) d = Math.min(d, distToSeg([u, v], path[i - 1], path[i]));
    }
    return d;
  };
  // Clear radius around each stop (the chip's traces and the site's woodland reach further).
  const clearR = [16, 16, 16, 16, 16, 12, 24];
  const hopLen = Math.hypot(HOP_DU, HOP_DV);
  // The band runs two hops past the last stop: the camera glides there under the next section.
  for (let u = -60; u <= (STOPS + 2) * HOP_DU + 40; u += 11) {
    for (let v = -50; v <= (STOPS + 2) * HOP_DV + 20; v += 10) {
      const ju = u + (rand() - 0.5) * 6;
      const jv = v + (rand() - 0.5) * 5;
      // keep to a band around the diagonal
      const along = (ju * HOP_DU + jv * HOP_DV) / Math.hypot(HOP_DU, HOP_DV);
      const across = Math.abs(ju * HOP_DV - jv * HOP_DU) / Math.hypot(HOP_DU, HOP_DV);
      if (across > 60 || along < -40 || along > (STOPS + 1) * hopLen + 60) continue;
      if (stopsPlan.some(([a, b], k) => Math.hypot(ju - a, jv - b) < clearR[k])) continue;
      if (segDist(ju, jv) < 5) continue;
      const kind = rand();
      if (kind < 0.3) {
        building(statics, ju, jv, 2 + rand() * 4, 0.6 + rand() * 1.6, 1.6 + rand() * 3, rand() < 0.5 ? 0 : Math.PI / 2);
      } else if (kind < 0.48) {
        moduleRow(statics, ju, jv, 3 + Math.floor(rand() * 5), rand() < 0.5 ? 0 : Math.PI / 2);
      } else if (kind < 0.55) {
        silos(statics, ju, jv);
      }
    }
  }

  const whiteMat = new MeshLambertMaterial({ color: 0xffffff });
  const riskMat = new MeshLambertMaterial({ color: new Color('#FF3700') });
  const merged = mergeGeometries(statics, false);
  const mergedRisk = mergeGeometries(risky, false);
  [...statics, ...risky].forEach((g) => g.dispose());
  for (const [geo, mat] of [
    [merged, whiteMat],
    [mergedRisk, riskMat],
  ] as const) {
    const m = new Mesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
  }

  const rotorGeo = mergeGeometries(rotorGeometry(), false);
  const rotors: Group[] = turbines.map((t, i) => {
    const pivot = new Group();
    pivot.position.copy(t.hub);
    pivot.rotation.y = t.facing;
    const rotor = new Mesh(rotorGeo, i === 1 ? riskMat : whiteMat);
    rotor.castShadow = true;
    rotor.receiveShadow = true;
    rotor.rotation.z = i * 0.7;
    pivot.add(rotor);
    scene.add(pivot);
    return pivot;
  });

  /* ---------------- Cable bundles ---------------- */
  const trailMat = createFlowMaterial();
  trailMat.uniforms.uMinAlpha.value = 0.8;
  trailMat.uniforms.uSpeed.value = 9;
  trailMat.uniforms.uPeriod.value = 22;
  const lineMat = new LineBasicMaterial({ color: new Color('#BDBDBD') });
  const decoMat = new LineBasicMaterial({ color: new Color('#D2D2D2') });
  addBundle(scene, fullRoute, lineMat, trailMat, 9, 0.22);
  // Decorative traces running alongside, like a circuit board.
  const shifted = (du: number, dv: number) => fullRoute.map(([u, v]) => [u + du, v + dv] as P);
  addBundle(scene, shifted(24, -16), decoMat, null, 5, 0.22);
  addBundle(scene, shifted(-20, 18), decoMat, null, 4, 0.22);
  addBundle(scene, shifted(46, -30), decoMat, null, 3, 0.22);

  // Chip traces: grey, with one live trace per side whose pulses run into the core.
  const coreMat = createFlowMaterial();
  coreMat.uniforms.uMinAlpha.value = 0.12;
  coreMat.uniforms.uSpeed.value = 7;
  coreMat.uniforms.uPeriod.value = 18;
  fanIn.forEach((path, k) => {
    const pts = path.map(([u, v]) => plan(u, v, 0.03));
    const geo = new BufferGeometry().setFromPoints(pts);
    if (fanInLive.has(k)) {
      // Distance grows towards the chip, so the pulses travel inwards.
      const dist = new Float32Array(pts.length);
      for (let i = 1; i < pts.length; i++) dist[i] = dist[i - 1] + pts[i].distanceTo(pts[i - 1]);
      geo.setAttribute('aDist', new BufferAttribute(dist, 1));
      const line = new Line(geo, coreMat);
      line.renderOrder = 2;
      scene.add(line);
    } else {
      scene.add(new Line(geo, lineMat));
    }
  });

  // The protected stream: a flat ribbon slightly darker than the ground.
  const streamMat = new MeshLambertMaterial({ color: new Color('#D6D6D6'), side: DoubleSide });
  const streamGeo = ribbon(site.stream, 2.2, 0.02);
  const streamMesh = new Mesh(streamGeo, streamMat);
  streamMesh.receiveShadow = true;
  scene.add(streamMesh);

  /* ---------------- Anchors, hazards, stops ---------------- */
  const anchors: Record<SectorId, Vector3> = {
    grid: towers[2].top.clone().add(new Vector3(0, 0.6, 0)),
    substation: sub.anchor.clone(),
    solar: solar.anchor.clone().add(new Vector3(0, 0.8, 0)),
    wind: turbines[1].top.clone().add(new Vector3(0, 0.4, 0)),
    oilgas: og.anchor.clone().add(new Vector3(0, 0.4, 0)),
  };
  const lift = [4.2, 1.8, 0.6, 5, 2.4, 0.8, 1.2];
  const views = [24, 22, 24, 28, 24, 30, 32];

  const hz = groundMat.uniforms.uHazards.value as Vector4[];
  TRAIL_ORDER.forEach((id, i) => {
    const a = anchors[id];
    hz[i].set(a.x, a.z, [7, 8, 8, 8, 9][i], 0);
  });
  const hazardTarget = new Array(HAZARD_SLOTS).fill(0);

  /* ---------------- Camera ---------------- */
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 600);
  let width = 1;
  let height = 1;
  let focusF = 0;
  const goal = { target: new Vector3(), view: views[0], s: stopS[0], az: STOP_AZIMUTH[0], el: STOP_ELEVATION[0] };
  const cur = { target: new Vector3(), view: views[0], s: stopS[0], az: STOP_AZIMUTH[0], el: STOP_ELEVATION[0] };
  const vel = { target: new Vector3(), view: 0, s: 0, az: 0, el: 0 };
  // Pointer tilt (−1..1), followed by a softer spring.
  const tiltGoal = { x: 0, y: 0 };
  const tilt = { x: 0, y: 0, vx: 0, vy: 0 };

  const stopWorld = stopsPlan.map(([u, v]) => plan(u, v));

  function goalFor(f: number) {
    const i = Math.min(STOPS - 2, Math.floor(f));
    // Past the last stop t > 1: the camera keeps gliding along the last hop's
    // direction (and the conductor keeps filling) while the next section covers
    // the stage, so the scroll never stalls. View, lift and angles hold.
    const t = f - i;
    const tc = Math.min(1, t);
    // The conductor fills along the circuit route…
    goal.s = stopS[i] + (stopS[i + 1] - stopS[i]) * t;
    // …but the camera travels in a straight line between stops, with no zoom bump,
    // so the move reads as one linear diagonal glide (no zig-zag at the bends).
    goal.target.lerpVectors(stopWorld[i], stopWorld[i + 1], t);
    goal.target.y = lift[i] + (lift[i + 1] - lift[i]) * tc;
    goal.view = views[i] + (views[i + 1] - views[i]) * tc;
    // Angle variations between stops, eased so they settle as each asset arrives.
    const e = tc * tc * (3 - 2 * tc);
    goal.az = STOP_AZIMUTH[i] + (STOP_AZIMUTH[i + 1] - STOP_AZIMUTH[i]) * e;
    goal.el = STOP_ELEVATION[i] + (STOP_ELEVATION[i + 1] - STOP_ELEVATION[i]) * e;
  }
  goalFor(0);
  cur.target.copy(goal.target);

  function applyCamera() {
    setBasis(
      (cur.az + tilt.x * TILT_AZIMUTH) * DEG,
      (cur.el - tilt.y * TILT_ELEVATION) * DEG,
    );
    const aspect = width / height;
    const viewH = Math.max(cur.view, (cur.view * 0.95) / aspect);
    const viewW = viewH * aspect;
    camera.left = -viewW / 2;
    camera.right = viewW / 2;
    camera.top = viewH / 2;
    camera.bottom = -viewH / 2;
    const shiftX = aspect > 1.1 ? viewW * 0.12 : 0;
    const shiftY = aspect < 0.9 ? viewH * 0.08 : 0;
    const t = cur.target.clone().addScaledVector(SCREEN_RIGHT, -shiftX).addScaledVector(SCREEN_UP, shiftY);
    camera.position.copy(t).addScaledVector(CAM_DIR, 200);
    camera.lookAt(t);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    // The shadow frustum follows the camera so it stays sharp.
    sun.target.position.copy(cur.target);
    sun.position.copy(cur.target).add(lightOffset);
    sun.target.updateMatrixWorld();
  }

  function setFocus(f: number) {
    // Up to two hops past the last stop (the glide under the next section).
    focusF = Math.max(0, Math.min(STOPS + 1, f));
    goalFor(focusF);
    const active = Math.round(focusF);
    for (let k = 0; k < HAZARD_SLOTS; k++) hazardTarget[k] = active === k ? 1 : 0;
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
      cur.s = goal.s;
      cur.az = goal.az;
      cur.el = goal.el;
    } else {
      const omega = (2 * Math.PI) / 0.45;
      acc.subVectors(cur.target, goal.target).multiplyScalar(-omega * omega).addScaledVector(vel.target, -2 * omega);
      vel.target.addScaledVector(acc, dt);
      cur.target.addScaledVector(vel.target, dt);
      vel.view += (-omega * omega * (cur.view - goal.view) - 2 * omega * vel.view) * dt;
      cur.view += vel.view * dt;
      vel.s += (-omega * omega * (cur.s - goal.s) - 2 * omega * vel.s) * dt;
      cur.s += vel.s * dt;
      vel.az += (-omega * omega * (cur.az - goal.az) - 2 * omega * vel.az) * dt;
      cur.az += vel.az * dt;
      vel.el += (-omega * omega * (cur.el - goal.el) - 2 * omega * vel.el) * dt;
      cur.el += vel.el * dt;
      // Softer, slower spring for the pointer tilt (decorative motion).
      const w = (2 * Math.PI) / 0.9;
      tilt.vx += (-w * w * (tilt.x - tiltGoal.x) - 2 * w * tilt.vx) * dt;
      tilt.vy += (-w * w * (tilt.y - tiltGoal.y) - 2 * w * tilt.vy) * dt;
      tilt.x += tilt.vx * dt;
      tilt.y += tilt.vy * dt;
      moving = vel.target.lengthSq() > 1e-5 || Math.abs(vel.view) > 1e-3;
    }
    applyCamera();
    // The orange conductor fills up to just past the current position.
    trailMat.uniforms.uReveal.value = cur.s + 2.5;

    for (let k = 0; k < HAZARD_SLOTS; k++) {
      const v = hz[k];
      const next = v.w + (hazardTarget[k] - v.w) * Math.min(1, dt * 4);
      v.w = Math.abs(next - hazardTarget[k]) < 0.002 ? hazardTarget[k] : next;
      if (v.w !== hazardTarget[k]) moving = true;
    }
    if (!opts.reducedMotion) {
      rotors.forEach((r, i) => (r.children[0].rotation.z -= dt * (0.9 + i * 0.07)));
      groundMat.uniforms.uTime.value = time;
      trailMat.uniforms.uTime.value = time;
      coreMat.uniforms.uTime.value = time;
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
    mergedRisk.dispose();
    rotorGeo.dispose();
    whiteMat.dispose();
    riskMat.dispose();
    groundMat.dispose();
    trailMat.dispose();
    coreMat.dispose();
    streamGeo.dispose();
    streamMat.dispose();
    lineMat.dispose();
    decoMat.dispose();
    scene.traverse((o) => {
      if ((o as Line).isLine) (o as Line).geometry.dispose();
    });
  }

  setFocus(0);
  function setPointer(x: number, y: number) {
    if (opts.reducedMotion) return;
    tiltGoal.x = Math.max(-1, Math.min(1, x));
    tiltGoal.y = Math.max(-1, Math.min(1, y));
  }

  setBasis(STOP_AZIMUTH[0] * DEG, STOP_ELEVATION[0] * DEG);
  return { setFocus, resize, tick, project, dispose, setPointer };
}

function addBundle(
  scene: Scene,
  path: P[],
  lineMat: LineBasicMaterial,
  accentMat: ReturnType<typeof createFlowMaterial> | null,
  count: number,
  spacing: number,
) {
  const accentIndex = Math.floor(count / 2);
  for (let k = 0; k < count; k++) {
    const off = (k - (count - 1) / 2) * spacing;
    const pts = offsetPolyline(path, off).map(([u, v]) => plan(u, v, 0.03));
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

function distToSeg(p: P, a: P, b: P) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
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

/**
 * Traces running into the chip from every side, PCB style: straight out of
 * each pin, a 45° jog to gather into a tight group, then straight out to the
 * edge of the board. Sides that the main cable bundle uses keep a clear band
 * around it and lean away from the route. Paths run from the outer end to the
 * pin, so distance grows towards the core.
 */
function chipTraces(sides: ChipSide[]) {
  const R = 26; // how far the traces reach from the chip centre
  const GAP = 0.4;
  const paths: P[][] = [];
  const live = new Set<number>();
  for (const side of sides) {
    const [nu, nv] = side.n;
    const [tu, tv] = side.t;
    // Where the main route crosses this side (it enters from −v at u = −2 and leaves through +u at v = 0).
    const keepOut: [number, number] | null = nv === -1 ? [-3.3, -0.7] : nu === 1 ? [-1.3, 1.3] : null;
    const lean = nv === -1 ? 6 : nu === 1 ? -6 : 0;
    const centre: P = [
      side.tips[0][0] - nu * side.reach - tu * side.offsets[0],
      side.tips[0][1] - nv * side.reach - tv * side.offsets[0],
    ];
    const at = (d: number, t: number): P => [centre[0] + nu * d + tu * t, centre[1] + nv * d + tv * t];
    const used = side.offsets.filter((o) => !keepOut || o < keepOut[0] || o > keepOut[1]);
    const mid = (used.length - 1) / 2;
    used.forEach((o, rank) => {
      const c = lean + (rank - mid) * GAP;
      const d1 = side.reach + 1.2;
      const d2 = d1 + Math.abs(c - o);
      if (Math.round(mid) === rank) live.add(paths.length);
      paths.push([at(R, c), at(d2, c), at(d1, o), at(side.reach, o)]);
    });
  }
  return { paths, live };
}

/** Flat strip of constant width along a plan polyline (the stream). */
function ribbon(path: P[], width: number, y: number) {
  const a = offsetPolyline(path, -width / 2);
  const b = offsetPolyline(path, width / 2);
  const pos: number[] = [];
  const idx: number[] = [];
  path.forEach((_, i) => {
    const pa = plan(a[i][0], a[i][1], y);
    const pb = plan(b[i][0], b[i][1], y);
    pos.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
    if (i > 0) {
      const k = i * 2;
      idx.push(k - 2, k - 1, k, k - 1, k + 1, k);
    }
  });
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
