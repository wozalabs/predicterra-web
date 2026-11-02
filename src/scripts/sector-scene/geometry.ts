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
