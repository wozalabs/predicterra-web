/**
 * Procedural, texture-free geometry for the isometric grid scene.
 * Every builder pushes already-transformed BufferGeometries into a list so the
 * whole static world can be merged into a single draw call.
 *
 * Coordinates: the map is authored in screen-aligned "plan" units (u, v):
 *   u → right on screen, v → towards the viewer (down on screen).
 * `plan(u, v)` converts them to world X/Z for a camera at 45° azimuth.
 */
import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  Euler,
  Matrix4,
  Quaternion,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from 'three';

export type Geo = BufferGeometry;
export type Bucket = Geo[];

const SQRT1_2 = Math.SQRT1_2;

/** Plan (u, v) → world (x, z). */
export function plan(u: number, v: number, y = 0) {
  return new Vector3((u + v) * SQRT1_2, y, (v - u) * SQRT1_2);
}

/** Rotation (radians about Y) that makes local +X point along plan +u. */
export const PLAN_ROT = Math.PI / 4;

const _m = new Matrix4();
const _q = new Quaternion();
const _e = new Euler();
const _s = new Vector3();

export function transform(
  g: Geo,
  pos: Vector3,
  rot: { x?: number; y?: number; z?: number } = {},
  scale: [number, number, number] = [1, 1, 1],
) {
  _e.set(rot.x ?? 0, rot.y ?? 0, rot.z ?? 0);
  _q.setFromEuler(_e);
  _s.set(...scale);
  _m.compose(pos, _q, _s);
  g.applyMatrix4(_m);
  return g;
}

/** Box with its centre at `pos`. */
export function box(w: number, h: number, d: number, pos: Vector3, rotY = 0) {
  return transform(new BoxGeometry(w, h, d), pos, { y: rotY });
}

/** Thin beam between two points (lattice members, rails). */
export function beam(a: Vector3, b: Vector3, t = 0.1) {
  const dir = new Vector3().subVectors(b, a);
  const len = dir.length();
  const g = new BoxGeometry(t, len, t);
  const q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize());
  const mid = new Vector3().addVectors(a, b).multiplyScalar(0.5);
  g.applyMatrix4(new Matrix4().compose(mid, q, new Vector3(1, 1, 1)));
  return g;
}

export function cylinder(rTop: number, rBottom: number, h: number, pos: Vector3, seg = 20) {
  return transform(new CylinderGeometry(rTop, rBottom, h, seg, 1), pos);
}

/** Horizontal cylinder along local X, rotated by rotY. */
export function pipe(r: number, len: number, pos: Vector3, rotY = 0, seg = 10) {
  return transform(new CylinderGeometry(r, r, len, seg, 1), pos, { z: Math.PI / 2, y: rotY });
}

export function sphere(r: number, pos: Vector3, seg = 12) {
  return transform(new SphereGeometry(r, seg, Math.max(6, seg / 2)), pos);
}

/** Sagging cable between two points. */
export function cable(a: Vector3, b: Vector3, sag = 0.7, r = 0.028) {
  const pts: Vector3[] = [];
  const n = 10;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = new Vector3().lerpVectors(a, b, t);
    p.y -= sag * 4 * t * (1 - t);
    pts.push(p);
  }
  return new TubeGeometry(new CatmullRomCurve3(pts), 18, r, 4, false);
}

/** Local → world helper for a cluster placed at plan (u, v) with a yaw. */
export function frame(u: number, v: number, yaw = 0) {
  const origin = plan(u, v);
  const rot = PLAN_ROT + yaw;
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  return {
    origin,
    rot,
    /** local (x right, z towards viewer) → world */
    at(x: number, y: number, z: number) {
      return new Vector3(origin.x + x * c + z * s, y, origin.z - x * s + z * c);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Assets                                                              */
/* ------------------------------------------------------------------ */

export interface TowerTips {
  /** Conductor attachment points, world space. */
  tips: Vector3[];
  top: Vector3;
}

/** Lattice transmission tower. */
export function tower(b: Bucket, u: number, v: number, yaw = 0): TowerTips {
  const f = frame(u, v, yaw);
  const H = 9.2;
  const base = 0.95;
  const top = 0.24;
  const legsAt = (y: number) => {
    const k = base + (top - base) * (y / H);
    return [
      f.at(-k, y, -k),
      f.at(k, y, -k),
      f.at(k, y, k),
      f.at(-k, y, k),
    ];
  };
  const bottom = legsAt(0);
  const upper = legsAt(H);
  for (let i = 0; i < 4; i++) b.push(beam(bottom[i], upper[i], 0.13));

  // Bracing: rings plus X diagonals on each face.
  const levels = [0.4, 2.4, 4.2, 5.8, 7.2, 8.4, H];
  for (let l = 0; l < levels.length; l++) {
    const ring = legsAt(levels[l]);
    for (let i = 0; i < 4; i++) b.push(beam(ring[i], ring[(i + 1) % 4], 0.07));
    if (l > 0) {
      const prev = legsAt(levels[l - 1]);
      for (let i = 0; i < 4; i++) {
        b.push(beam(prev[i], ring[(i + 1) % 4], 0.05));
        b.push(beam(prev[(i + 1) % 4], ring[i], 0.05));
      }
    }
  }

  // Cross arms (along local X) and the peak.
  const arms = [
    { y: 6.3, w: 2.7 },
    { y: 7.9, w: 2.0 },
  ];
  const tips: Vector3[] = [];
  for (const a of arms) {
    b.push(beam(f.at(-a.w, a.y, 0), f.at(a.w, a.y, 0), 0.16));
    b.push(beam(f.at(-a.w, a.y, 0), f.at(-0.5, a.y + 0.7, 0), 0.06));
    b.push(beam(f.at(a.w, a.y, 0), f.at(0.5, a.y + 0.7, 0), 0.06));
    for (const sx of [-1, 1]) {
      const tip = f.at(sx * (a.w - 0.1), a.y, 0);
      // insulator string
      b.push(cylinder(0.05, 0.05, 0.55, new Vector3(tip.x, a.y - 0.3, tip.z), 6));
      tips.push(new Vector3(tip.x, a.y - 0.6, tip.z));
    }
  }
  b.push(beam(f.at(0, H, 0), f.at(0, H + 0.9, 0), 0.1));
  return { tips, top: f.at(0, H + 0.9, 0) };
}

/** Electrical substation with transformers, gantries, breakers and a control building. */
export function substation(b: Bucket, u: number, v: number, risk?: Bucket, riskIndex = 1) {
  const f = frame(u, v);
  const W = 15;
  const D = 10;
  b.push(box(W, 0.22, D, f.at(0, 0.11, 0), f.rot));

  // Transformers
  const tx: Vector3[] = [];
  for (let i = 0; i < 3; i++) {
    const x = -4.5 + i * 3.4;
    const z = 2.2;
    const t = risk && i === riskIndex ? risk : b;
    t.push(box(2.1, 1.9, 1.5, f.at(x, 1.17, z), f.rot));
    for (let k = 0; k < 6; k++) {
      t.push(box(0.06, 1.5, 0.55, f.at(x - 0.75 + k * 0.3, 1.1, z + 1.02), f.rot));
    }
    t.push(pipe(0.26, 1.5, f.at(x, 2.5, z - 0.4), f.rot));
    for (let k = -1; k <= 1; k++) {
      t.push(cylinder(0.07, 0.11, 1.0, f.at(x + k * 0.55, 2.6, z + 0.2), 8));
    }
    tx.push(f.at(x, 2.2, z));
  }

  // Gantries (portal frames) with busbars
  for (const z of [-1.4, -3.8]) {
    const posts = [-6.5, -2.5, 1.5, 5.5];
    for (const x of posts) b.push(box(0.2, 5, 0.2, f.at(x, 2.72, z), f.rot));
    b.push(beam(f.at(posts[0], 5.1, z), f.at(posts[3], 5.1, z), 0.22));
    for (let k = -1; k <= 1; k++) {
      b.push(beam(f.at(posts[0], 4.2, z + k * 0.4), f.at(posts[3], 4.2, z + k * 0.4), 0.06));
    }
    // Breakers on pedestals
    for (let x = -6; x <= 5; x += 1.4) {
      b.push(box(0.5, 0.6, 0.5, f.at(x, 0.52, z + 0.9), f.rot));
      b.push(cylinder(0.12, 0.14, 1.5, f.at(x, 1.57, z + 0.9), 10));
    }
  }

  // Control building
  b.push(box(3.6, 2.6, 3, f.at(5.2, 1.52, 2.4), f.rot));
  b.push(box(3.9, 0.18, 3.3, f.at(5.2, 2.91, 2.4), f.rot));

  // Perimeter fence: posts and two rails
  const corners = [f.at(-W / 2, 0, -D / 2), f.at(W / 2, 0, -D / 2), f.at(W / 2, 0, D / 2), f.at(-W / 2, 0, D / 2)];
  for (let i = 0; i < 4; i++) {
    const a = corners[i];
    const c = corners[(i + 1) % 4];
    for (const h of [0.6, 1.3]) {
      b.push(beam(new Vector3(a.x, h, a.z), new Vector3(c.x, h, c.z), 0.04));
    }
    const n = Math.round(a.distanceTo(c) / 1.5);
    for (let k = 0; k < n; k++) {
      const p = new Vector3().lerpVectors(a, c, k / n);
      b.push(box(0.06, 1.4, 0.06, new Vector3(p.x, 0.92, p.z)));
    }
  }

  return {
    anchor: risk ? tx[riskIndex].clone().add(new Vector3(0, 1.3, 0)) : f.at(-1.1, 3.4, 2.2),
    transformers: tx,
    entry: f.at(-W / 2, 5.1, -2.6),
  };
}

/** Solar plant: tables of tilted modules with gaps between them (no texture). */
export function solarPlant(
  b: Bucket,
  u: number,
  v: number,
  cols = 6,
  rows = 5,
  risk?: { bucket: Bucket; tables: [number, number][] },
) {
  const f = frame(u, v);
  const tilt = 0.42; // modules face the camera
  const modW = 0.95;
  const gap = 0.07;
  const perTable = 4;
  const tableW = perTable * modW + (perTable - 1) * gap;
  const pitchX = tableW + 0.7;
  const pitchZ = 3.3;
  const x0 = -((cols - 1) * pitchX) / 2;
  const z0 = -((rows - 1) * pitchZ) / 2;
  const riskCentres: Vector3[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = x0 + c * pitchX;
      const cz = z0 + r * pitchZ;
      const isRisk = !!risk?.tables.some(([rr, cc]) => rr === r && cc === c);
      const t = isRisk ? risk!.bucket : b;
      if (isRisk) riskCentres.push(f.at(cx, 1.6, cz));
      for (let m = 0; m < perTable; m++) {
        const mx = cx - tableW / 2 + modW / 2 + m * (modW + gap);
        for (const row of [-0.48, 0.48]) {
          // Tilt about the table's own X axis, then yaw into the plan.
          const pos = f.at(mx, 1.05 - row * Math.sin(tilt), cz + row * Math.cos(tilt));
          const mod = new BoxGeometry(modW, 0.05, 0.92);
          mod.applyMatrix4(new Matrix4().makeRotationX(tilt));
          mod.applyMatrix4(new Matrix4().makeRotationY(f.rot));
          mod.applyMatrix4(new Matrix4().makeTranslation(pos.x, pos.y, pos.z));
          t.push(mod);
        }
      }
      for (const px of [-tableW / 2 + 0.4, tableW / 2 - 0.4]) {
        t.push(box(0.08, 0.95, 0.08, f.at(cx + px, 0.47, cz - 0.3), f.rot));
        t.push(box(0.08, 1.3, 0.08, f.at(cx + px, 0.65, cz + 0.45), f.rot));
      }
    }
  }
  // Inverter / transformer skid
  const sx = x0 + cols * pitchX - 1.2;
  b.push(box(2.2, 1.6, 1.4, f.at(sx, 0.8, 0), f.rot));
  b.push(box(1.0, 1.0, 1.0, f.at(sx, 0.5, 1.6), f.rot));

  const anchor = riskCentres.length
    ? riskCentres.reduce((a, p) => a.add(p), new Vector3()).multiplyScalar(1 / riskCentres.length)
    : f.at(0, 1.6, 0);
  return { anchor, skid: f.at(sx, 1.6, 0) };
}

/** Wind turbine: tower, nacelle and hub go to the bucket; returns the rotor pivot. */
export function windTurbine(b: Bucket, u: number, v: number, facing: number, height = 10.5) {
  const base = plan(u, v);
  b.push(cylinder(0.17, 0.36, height, new Vector3(base.x, height / 2, base.z), 24));
  b.push(cylinder(0.5, 0.5, 0.2, new Vector3(base.x, 0.1, base.z), 24));
  const hubY = height + 0.25;
  const fwd = new Vector3(Math.sin(facing), 0, Math.cos(facing));
  const nacelle = new BoxGeometry(0.6, 0.6, 1.7);
  nacelle.applyMatrix4(new Matrix4().makeRotationY(facing));
  nacelle.applyMatrix4(
    new Matrix4().makeTranslation(base.x - fwd.x * 0.35, hubY, base.z - fwd.z * 0.35),
  );
  b.push(nacelle);
  const hub = new Vector3(base.x + fwd.x * 0.6, hubY, base.z + fwd.z * 0.6);
  return { hub, facing, top: new Vector3(base.x, hubY + 0.6, base.z) };
}

/** One tapered blade along +Y, root at the origin (merged into the rotor mesh). */
export function rotorGeometry(len = 4.9) {
  const parts: Geo[] = [];
  for (let i = 0; i < 3; i++) {
    const blade = new BoxGeometry(0.42, len, 0.07, 1, 4, 1);
    const pos = blade.attributes.position;
    for (let k = 0; k < pos.count; k++) {
      const y = pos.getY(k) + len / 2; // 0 → len
      const t = y / len;
      pos.setX(k, pos.getX(k) * (1 - 0.72 * t) + 0.08 * (1 - t));
      pos.setY(k, y + 0.2);
    }
    blade.computeVertexNormals();
    blade.applyMatrix4(new Matrix4().makeRotationZ((i * Math.PI * 2) / 3));
    parts.push(blade);
  }
  parts.push(new SphereGeometry(0.32, 14, 8).applyMatrix4(new Matrix4().makeScale(1, 1, 1.4)));
  return parts;
}

/** Tank farm, process columns, pipe rack and flare. */
export function oilGas(b: Bucket, u: number, v: number, risk?: Bucket, riskIndex = 1) {
  const f = frame(u, v);
  const tanks: Vector3[] = [];
  const spots = [
    [-5, -3.2],
    [0, -3.2],
    [-5, 2.2],
    [0, 2.2],
  ];
  spots.forEach(([x, z], i) => {
    const t = risk && i === riskIndex ? risk : b;
    t.push(cylinder(2.05, 2.05, 2.6, f.at(x, 1.3, z), 40));
    t.push(cylinder(0.35, 2.1, 0.5, f.at(x, 2.85, z), 40));
    tanks.push(f.at(x, 3.1, z));
  });
  // Bund walls
  const bund: [number, number, number, number][] = [
    [-8, -6, 3, -6],
    [3, -6, 3, 5],
    [3, 5, -8, 5],
    [-8, 5, -8, -6],
  ];
  for (const [ax, az, bx, bz] of bund) {
    const a = f.at(ax, 0.3, az);
    const c = f.at(bx, 0.3, bz);
    const len = a.distanceTo(c);
    const g = new BoxGeometry(len, 0.6, 0.22);
    const ang = Math.atan2(-(c.z - a.z), c.x - a.x);
    g.applyMatrix4(new Matrix4().makeRotationY(ang));
    g.applyMatrix4(new Matrix4().makeTranslation((a.x + c.x) / 2, 0.3, (a.z + c.z) / 2));
    b.push(g);
  }
  // Process columns
  const cols = [
    [6.5, -3, 0.55, 7.5],
    [8, -3, 0.45, 6],
    [9.6, -2.6, 0.8, 4.5],
    [7, -0.6, 0.35, 5.2],
  ];
  for (const [x, z, r, h] of cols) {
    b.push(cylinder(r, r, h, f.at(x, h / 2, z), 20));
    b.push(sphere(r, f.at(x, h, z), 14));
  }
  // Pipe rack
  for (let x = 5; x <= 11; x += 1.5) {
    b.push(box(0.15, 2.6, 0.15, f.at(x, 1.3, 1.4), f.rot));
    b.push(box(0.15, 2.6, 0.15, f.at(x, 1.3, 2.6), f.rot));
    b.push(box(0.15, 0.15, 1.35, f.at(x, 2.6, 2), f.rot));
  }
  for (let k = 0; k < 4; k++) {
    b.push(pipe(0.1, 6.4, f.at(8, 2.78, 1.55 + k * 0.32), f.rot));
  }
  // Flare stack
  b.push(cylinder(0.18, 0.26, 13, f.at(12.5, 6.5, -4.5), 12));
  b.push(cylinder(0.32, 0.22, 0.6, f.at(12.5, 13.2, -4.5), 12));
  for (const [x, z] of [
    [11.5, -5.5],
    [13.5, -5.5],
    [12.5, -3.2],
  ]) {
    b.push(beam(f.at(x, 0, z), f.at(12.5, 8, -4.5), 0.05));
  }
  // Pump blocks
  for (let x = 5; x <= 10; x += 1.6) b.push(box(0.9, 0.6, 0.7, f.at(x, 0.3, 4.4), f.rot));

  return { anchor: tanks[risk ? riskIndex : 1], tanks };
}

/** Generic low building with optional roof plant. */
export function building(b: Bucket, u: number, v: number, w: number, h: number, d: number, yaw = 0) {
  const f = frame(u, v, yaw);
  b.push(box(w, h, d, f.at(0, h / 2, 0), f.rot));
  if (w > 4 && d > 3) {
    b.push(box(w * 0.3, 0.4, d * 0.3, f.at(w * 0.2, h + 0.2, -d * 0.15), f.rot));
  }
}

/** Row of small modules (containers, battery blocks). */
export function moduleRow(b: Bucket, u: number, v: number, count: number, yaw = 0) {
  const f = frame(u, v, yaw);
  for (let i = 0; i < count; i++) {
    b.push(box(0.55, 0.45, 2.1, f.at(i * 0.95, 0.23, 0), f.rot));
  }
}

/** Squat cylindrical tanks cluster (water / storage). */
export function silos(b: Bucket, u: number, v: number) {
  const f = frame(u, v);
  const spots = [
    [0, 0],
    [1.4, 0.3],
    [0.5, 1.4],
    [2.0, 1.5],
    [-0.9, 1.1],
  ];
  for (const [x, z] of spots) b.push(cylinder(0.6, 0.6, 1.1, f.at(x, 0.55, z), 18));
}

/* ------------------------------------------------------------------ */
/* Capability stops (trace variant): no asset at risk                  */
/* ------------------------------------------------------------------ */

type PlanPt = [number, number];

/** One side of the chip: outward normal and tangent in plan (u, v), pin tips in plan. */
export interface ChipSide {
  n: PlanPt;
  t: PlanPt;
  /** Pin offsets along the tangent, and the matching tip points in plan. */
  offsets: number[];
  tips: PlanPt[];
  /** Distance from the chip centre to the pin tips. */
  reach: number;
}

/**
 * Microchip package lying on the board: stepped body, lid and die, a pin-1
 * mark, and gull-wing pins on all four sides. The die (the core) goes to the
 * `accent` bucket when given. Returns the pin tips so the traces can run into it.
 */
export function chip(b: Bucket, u: number, v: number, accent: Bucket = b, size = 10, pinsPerSide = 9) {
  const f = frame(u, v);
  const half = size / 2;
  b.push(box(size, 0.9, size, f.at(0, 0.45, 0), f.rot));
  // Lid and die step up so they cast small dithered shadows on the body.
  b.push(box(size * 0.64, 0.4, size * 0.64, f.at(0, 1.1, 0), f.rot));
  accent.push(box(size * 0.34, 0.36, size * 0.34, f.at(0, 1.48, 0), f.rot));
  // Pin-1 mark: a shallow dimple in the top corner.
  b.push(cylinder(0.32, 0.32, 0.05, f.at(-half + 1.1, 0.92, -half + 1.1), 18));

  const pitch = (size - 2) / (pinsPerSide - 1);
  const offsets = Array.from({ length: pinsPerSide }, (_, k) => -half + 1 + k * pitch);
  const reach = half + 1.45;
  const dirs: [PlanPt, PlanPt][] = [
    [[1, 0], [0, 1]],
    [[-1, 0], [0, 1]],
    [[0, 1], [1, 0]],
    [[0, -1], [1, 0]],
  ];
  const sides: ChipSide[] = dirs.map(([n, t]) => {
    const alongU = n[0] !== 0; // pins run along u on the ±u sides
    const tips: PlanPt[] = [];
    for (const o of offsets) {
      const at = (d: number, y: number) => f.at(n[0] * d + t[0] * o, y, n[1] * d + t[1] * o);
      // Arm out of the body, drop, and a foot on the board.
      b.push(box(alongU ? 0.9 : 0.3, 0.12, alongU ? 0.3 : 0.9, at(half + 0.45, 0.5), f.rot));
      b.push(box(alongU ? 0.12 : 0.3, 0.5, alongU ? 0.3 : 0.12, at(half + 0.9, 0.27), f.rot));
      b.push(box(alongU ? 0.6 : 0.3, 0.08, alongU ? 0.3 : 0.6, at(half + 1.15, 0.04), f.rot));
      tips.push([u + n[0] * reach + t[0] * o, v + n[1] * reach + t[1] * o]);
    }
    return { n, t, offsets, tips, reach };
  });
  return { anchor: f.at(0, 1.7, 0), sides };
}

/** Conifer: trunk and a cone crown. */
export function tree(b: Bucket, u: number, v: number, h = 2.4) {
  const p = plan(u, v);
  b.push(cylinder(0.1, 0.12, h * 0.3, new Vector3(p.x, h * 0.15, p.z), 6));
  b.push(cylinder(0, h * 0.28, h * 0.8, new Vector3(p.x, h * 0.3 + h * 0.4, p.z), 10));
}

/**
 * Compliance: a surveyed site. A fenced parcel on a low plinth with a small
 * plant inside, a dashed buffer line around it with survey posts at the
 * corners, and a measured setback to a protected stream (the stream itself is
 * returned as a separate strip so it can take its own material). The fence
 * goes to the `accent` bucket when given.
 */
export function surveyedSite(b: Bucket, u: number, v: number, accent: Bucket = b) {
  const f = frame(u, v);
  const W = 16;
  const D = 11;
  // Parcel plinth
  b.push(box(W, 0.2, D, f.at(0, 0.1, 0), f.rot));

  // The plant inside: process building, office, tanks, a row of modules.
  b.push(box(5.2, 2.6, 3.6, f.at(-3.6, 1.5, -1.4), f.rot));
  b.push(box(1.8, 0.5, 1.4, f.at(-2.6, 3.05, -1.9), f.rot));
  b.push(box(2.6, 1.6, 2.2, f.at(-4.8, 1.0, 2.9), f.rot));
  for (const [x, z] of [
    [2.6, -2.6],
    [4.6, -2.6],
    [2.6, -0.4],
  ]) {
    b.push(cylinder(0.8, 0.8, 1.9, f.at(x, 1.15, z), 22));
    b.push(cylinder(0.25, 0.82, 0.25, f.at(x, 2.22, z), 22));
  }
  for (let i = 0; i < 6; i++) b.push(box(0.55, 0.45, 2.0, f.at(0.6 + i * 1.0, 0.43, 3.1), f.rot));

  // Perimeter fence on the parcel edge: posts and two rails.
  const fx = W / 2 - 0.25;
  const fz = D / 2 - 0.25;
  const corners = [f.at(-fx, 0, -fz), f.at(fx, 0, -fz), f.at(fx, 0, fz), f.at(-fx, 0, fz)];
  for (let i = 0; i < 4; i++) {
    const a = corners[i];
    const c = corners[(i + 1) % 4];
    for (const h of [0.6, 1.1]) accent.push(beam(new Vector3(a.x, h, a.z), new Vector3(c.x, h, c.z), 0.05));
    const n = Math.round(a.distanceTo(c) / 1.4);
    for (let k = 0; k < n; k++) {
      const p = new Vector3().lerpVectors(a, c, k / n);
      accent.push(box(0.08, 1.2, 0.08, new Vector3(p.x, 0.8, p.z)));
    }
  }

  // Buffer line: dashes on the ground, 3.5 units out from the parcel.
  const bx = W / 2 + 3.5;
  const bz = D / 2 + 3.5;
  const ring: [number, number][] = [
    [-bx, -bz],
    [bx, -bz],
    [bx, bz],
    [-bx, bz],
  ];
  for (let i = 0; i < 4; i++) {
    const [ax, az] = ring[i];
    const [cx, cz] = ring[(i + 1) % 4];
    const len = Math.hypot(cx - ax, cz - az);
    const n = Math.floor(len / 1.2);
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      const x = ax + (cx - ax) * t;
      const z = az + (cz - az) * t;
      const alongX = Math.abs(cx - ax) > 0;
      b.push(box(alongX ? 0.6 : 0.14, 0.04, alongX ? 0.14 : 0.6, f.at(x, 0.02, z), f.rot));
    }
  }
  // Survey posts at the buffer corners: a mast with a square cap.
  for (const [x, z] of ring) {
    b.push(box(0.14, 2.4, 0.14, f.at(x, 1.2, z), f.rot));
    b.push(box(0.42, 0.26, 0.42, f.at(x, 2.5, z), f.rot));
    b.push(box(0.7, 0.06, 0.7, f.at(x, 0.03, z), f.rot));
  }

  // Protected stream below the parcel, and the measured setback to it.
  const streamV = D / 2 + 7.2;
  const stream: PlanPt[] = [];
  for (let x = -30; x <= 30; x += 1.5) stream.push([u + x, v + streamV + Math.sin(x * 0.16) * 1.6]);
  const edgeAt = (x: number) => streamV + Math.sin(x * 0.16) * 1.6 - 0.9;
  const mx = -bx + 2;
  const from = f.at(mx, 0.05, D / 2);
  const to = f.at(mx, 0.05, edgeAt(mx));
  b.push(beam(from, to, 0.05));
  for (const p of [from, to]) b.push(box(0.9, 0.05, 0.08, new Vector3(p.x, 0.05, p.z), f.rot));

  // Protected woodland on the far bank.
  const rand = (() => {
    let s = 7;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  })();
  for (let k = 0; k < 16; k++) {
    const x = -14 + k * 1.9 + (rand() - 0.5) * 1.2;
    const z = streamV + 3 + rand() * 4.5;
    tree(b, u + x, v + z, 2 + rand() * 1.4);
  }

  return { anchor: f.at(0, 3, 0), stream, ring: ring.map(([x, z]) => [u + x, v + z] as PlanPt) };
}
