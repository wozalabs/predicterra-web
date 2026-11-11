/**
 * Live 3D view inside the asset panel. One small offscreen WebGL renderer is
 * shared by every panel; each sector gets a tiny scene built with the same
 * geometry builders, materials and light rig as the 3D section, with the asset
 * at risk in orange. While a panel is open the model turns slowly and each
 * frame is copied into the panel's own <canvas>.
 */
import {
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
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
import { cable, oilGas, rotorGeometry, solarPlant, substation, tower, windTurbine, type Bucket } from './geometry';
import { createGroundMaterial } from './materials';
import type { SectorId } from './world';

const BG = '#FAFAFA';
const AZ = (45 * Math.PI) / 180;
const EL = (26 * Math.PI) / 180;
const TURN_SPEED = 0.25; // rad/s

interface Mini {
  scene: Scene;
  pivot: Group;
  rotors: Mesh[];
  /** World units that must fit vertically in the view. */
  fitH: number;
  target: Vector3;
}

let renderer: WebGLRenderer | null = null;
let whiteMat: MeshLambertMaterial;
let riskMat: MeshLambertMaterial;
const minis = new Map<SectorId, Mini>();
const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 400);

function ensureRenderer() {
  if (renderer) return renderer;
  renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(new Color(BG), 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  whiteMat = new MeshLambertMaterial({ color: 0xffffff });
  riskMat = new MeshLambertMaterial({ color: new Color('#FF3700') });
  return renderer;
}

function build(id: SectorId): Mini {
  const statics: Bucket = [];
  const risky: Bucket = [];
  const rotorPivots: { hub: Vector3; facing: number; risk: boolean }[] = [];
  let fitH = 10;
  let lift = 3;

  switch (id) {
    case 'grid': {
      const t = [-1, 0, 1].map((k) => tower(k === 0 ? risky : statics, k * 9, -k * 3.6, -0.38));
      for (let i = 0; i < t.length - 1; i++) t[i].tips.forEach((a, k) => statics.push(cable(a, t[i + 1].tips[k], 0.75)));
      fitH = 12.5;
      lift = 4.9;
      break;
    }
    case 'substation':
      substation(statics, 0, 0, risky, 1);
      fitH = 8.5;
      lift = 2;
      break;
    case 'solar':
      solarPlant(statics, 0, 0, 4, 3, {
        bucket: risky,
        tables: [
          [1, 1],
          [1, 2],
        ],
      });
      fitH = 9;
      lift = 1;
      break;
    case 'wind': {
      const facing = AZ + 0.18;
      const t = windTurbine(risky, 0, 0, facing, 10);
      rotorPivots.push({ hub: t.hub, facing: t.facing, risk: true });
      fitH = 15.5;
      lift = 7.4;
      break;
    }
    case 'oilgas':
      oilGas(statics, 0, 0, risky, 1);
      fitH = 15;
      lift = 4.2;
      break;
  }

  const scene = new Scene();
  scene.background = new Color(BG);
  scene.add(new HemisphereLight(0xffffff, 0xc4c4c4, 2.0));
  scene.add(new AmbientLight(0xffffff, 0.55));
  const sun = new DirectionalLight(0xffffff, 1.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  const sc = sun.shadow.camera;
  sc.left = -30;
  sc.right = 30;
  sc.top = 30;
  sc.bottom = -30;
  sc.near = 1;
  sc.far = 200;
  sun.position.set(-40, 70, 25);
  scene.add(sun, sun.target);

  const groundMat = createGroundMaterial({ pixel: Math.max(1, Math.round(1.5 * renderer!.getPixelRatio())) });
  const ground = new Mesh(new PlaneGeometry(200, 200), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // The model turns around its own centre.
  const pivot = new Group();
  const model = new Group();
  for (const [bucket, mat] of [
    [statics, whiteMat],
    [risky, riskMat],
  ] as const) {
    if (!bucket.length) continue;
    const mesh = new Mesh(mergeGeometries(bucket, false), mat);
    bucket.forEach((g) => g.dispose());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    model.add(mesh);
  }
  const rotors: Mesh[] = [];
  if (rotorPivots.length) {
    const rotorGeo = mergeGeometries(rotorGeometry(), false);
    for (const r of rotorPivots) {
      const g = new Group();
      g.position.copy(r.hub);
      g.rotation.y = r.facing;
      const m = new Mesh(rotorGeo, r.risk ? riskMat : whiteMat);
      m.castShadow = true;
      g.add(m);
      model.add(g);
      rotors.push(m);
    }
  }
  const box = new Box3().setFromObject(model);
  const centre = box.getCenter(new Vector3());
  model.position.set(-centre.x, 0, -centre.z);
  pivot.add(model);
  scene.add(pivot);

  return { scene, pivot, rotors, fitH, target: new Vector3(0, lift, 0) };
}

function aim(mini: Mini, w: number, h: number) {
  const aspect = w / h;
  const viewH = mini.fitH;
  const viewW = viewH * aspect;
  camera.left = -viewW / 2;
  camera.right = viewW / 2;
  camera.top = viewH / 2;
  camera.bottom = -viewH / 2;
  // Keep the model slightly right of centre: the "Asset type" label sits bottom left.
  const dir = new Vector3(Math.sin(AZ) * Math.cos(EL), Math.sin(EL), Math.cos(AZ) * Math.cos(EL));
  const right = new Vector3(Math.cos(AZ), 0, -Math.sin(AZ));
  const t = mini.target.clone().addScaledVector(right, -viewW * 0.17);
  camera.position.copy(t).addScaledVector(dir, 150);
  camera.lookAt(t);
  camera.updateProjectionMatrix();
}

let active: { id: SectorId; canvas: HTMLCanvasElement; raf: number } | null = null;

/** Starts the live view for a panel. Safe to call repeatedly. */
export function showPreview(id: SectorId, canvas: HTMLCanvasElement, opts: { reducedMotion: boolean }) {
  hidePreview();
  let r: WebGLRenderer;
  try {
    r = ensureRenderer();
  } catch {
    return; // no WebGL: the view stays as a plain grey panel
  }
  if (!minis.has(id)) minis.set(id, build(id));
  const mini = minis.get(id)!;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth));
    const h = Math.max(1, Math.round(canvas.clientHeight));
    const dpr = r.getPixelRatio();
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    r.setSize(w, h, false);
    aim(mini, w, h);
  };

  let last = performance.now();
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!opts.reducedMotion) {
      mini.pivot.rotation.y += dt * TURN_SPEED;
      mini.rotors.forEach((m) => (m.rotation.z -= dt * 1.1));
    }
    r.render(mini.scene, camera);
    ctx.drawImage(r.domElement, 0, 0, canvas.width, canvas.height);
    if (active && active.canvas === canvas && !opts.reducedMotion) active.raf = requestAnimationFrame(frame);
  };

  size();
  active = { id, canvas, raf: 0 };
  active.raf = requestAnimationFrame(frame);
}

export function hidePreview() {
  if (active) cancelAnimationFrame(active.raf);
  active = null;
}
