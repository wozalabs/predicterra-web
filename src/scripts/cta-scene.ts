/**
 * CTA card background: two small clusters of energy assets (wind + solar on
 * one side, grid on the other), drawn with an ordered dither in three tones of
 * the brand orange on a transparent canvas, so the card colour shows through.
 * The pointer tilts the camera with a soft spring, like the 3D section.
 */
import {
  Color,
  DirectionalLight,
  Group,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderLib,
  ShaderMaterial,
  SRGBColorSpace,
  UniformsLib,
  UniformsUtils,
  Vector3,
  WebGLRenderer,
  type IUniform,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { cable, rotorGeometry, solarPlant, substation, tower, windTurbine, type Bucket } from './sector-scene/geometry';

const DEG = Math.PI / 180;
const BASE_AZ = 45;
const BASE_EL = 32;
/** Pointer tilt range (degrees), close to the 3D section so the two feel related. */
const TILT_AZ = 3.5;
const TILT_EL = 2.5;

const BAYER = /* glsl */ `
float bayer4(vec2 p) {
  vec2 q = mod(floor(p), 4.0);
  float i = q.x + q.y * 4.0;
  if (i < 0.5) return 0.0;   if (i < 1.5) return 8.0;   if (i < 2.5) return 2.0;   if (i < 3.5) return 10.0;
  if (i < 4.5) return 12.0;  if (i < 5.5) return 4.0;   if (i < 6.5) return 14.0;  if (i < 7.5) return 6.0;
  if (i < 8.5) return 3.0;   if (i < 9.5) return 11.0;  if (i < 10.5) return 1.0;  if (i < 11.5) return 9.0;
  if (i < 12.5) return 15.0; if (i < 13.5) return 7.0;  if (i < 14.5) return 13.0; return 5.0;
}`;

/** Lambert shade quantised into dark / mid / light with a 4×4 Bayer dither. */
function createAssetMaterial(pixel: number, light: Vector3) {
  return new ShaderMaterial({
    uniforms: {
      uLight: { value: light.clone().normalize() },
      uDark: { value: new Color('#c42b00') },
      uMid: { value: new Color('#ff8f66') },
      uHi: { value: new Color('#fff3ec') },
      uPixel: { value: pixel },
    },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      void main() {
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uLight;
      uniform vec3 uDark;
      uniform vec3 uMid;
      uniform vec3 uHi;
      uniform float uPixel;
      varying vec3 vN;
      ${BAYER}
      void main() {
        vec3 n = normalize(vN);
        float s = clamp(0.16 + 0.74 * max(dot(n, uLight), 0.0) + 0.14 * n.y, 0.0, 1.0);
        float t = (bayer4(gl_FragCoord.xy / uPixel) + 0.5) / 16.0;
        vec3 c = s < 0.5 ? ((s / 0.5) > t ? uMid : uDark) : (((s - 0.5) / 0.5) > t ? uHi : uMid);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  });
}

/** Invisible ground that only draws its (dithered) shadows. */
function createShadowMaterial(pixel: number) {
  const uniforms: Record<string, IUniform> = UniformsUtils.merge([
    UniformsLib.lights,
    UniformsLib.fog,
    { uShadow: { value: new Color('#d63000') }, uPixel: { value: pixel } },
  ]);
  const fragmentShader = ShaderLib.shadow.fragmentShader
    .replace('uniform vec3 color;\nuniform float opacity;', `uniform vec3 uShadow;\nuniform float uPixel;\n${BAYER}`)
    .replace(
      'gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );',
      /* glsl */ `
  float t = (bayer4(gl_FragCoord.xy / uPixel) + 0.5) / 16.0;
  float sh = (1.0 - getShadowMask()) * 0.85;
  if (sh <= t) discard;
  gl_FragColor = vec4(uShadow, 1.0);`,
    );
  return new ShaderMaterial({
    uniforms,
    vertexShader: ShaderLib.shadow.vertexShader,
    fragmentShader,
    lights: true,
    fog: true,
  });
}

export interface CtaScene {
  resize(w: number, h: number): void;
  setPointer(x: number, y: number): void;
  tick(dt: number): boolean;
  dispose(): void;
}

export function createCtaScene(canvas: HTMLCanvasElement, opts: { reducedMotion: boolean }): CtaScene {
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;

  const scene = new Scene();
  const pixel = 2 * dpr; // 2 CSS px dither cells, like the rest of the brand
  const lightDir = new Vector3(-0.55, 1, 0.35);
  const assetMat = createAssetMaterial(pixel, lightDir);
  const shadowMat = createShadowMaterial(pixel);

  // Sun for the ground shadows (assets use their own shading).
  const sun = new DirectionalLight(0xffffff, 1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0005;
  const sc = sun.shadow.camera;
  sc.left = -60;
  sc.right = 60;
  sc.top = 60;
  sc.bottom = -60;
  sc.near = 1;
  sc.far = 300;
  scene.add(sun, sun.target);

  const ground = new Mesh(new PlaneGeometry(400, 400), shadowMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---------- Assets ----------
  const facing = BASE_AZ * DEG + 0.2;
  const addCluster = (build: (b: Bucket) => void) => {
    const b: Bucket = [];
    build(b);
    const geo = mergeGeometries(b, false);
    b.forEach((g) => g.dispose());
    const group = new Group();
    const mesh = new Mesh(geo, assetMat);
    mesh.castShadow = true;
    group.add(mesh);
    scene.add(group);
    return { group, geo };
  };

  // Left: wind and solar.
  const turbines: ReturnType<typeof windTurbine>[] = [];
  const left = addCluster((b) => {
    turbines.push(windTurbine(b, -5, -5, facing, 11));
    turbines.push(windTurbine(b, 3, -8, facing, 9.5));
    turbines.push(windTurbine(b, -9, 3, facing, 9));
    solarPlant(b, 4, 4, 4, 3);
  });
  const rotorGeo = mergeGeometries(rotorGeometry(), false);
  const rotors = turbines.map((t, i) => {
    const pivot = new Group();
    pivot.position.copy(t.hub);
    pivot.rotation.y = t.facing;
    const r = new Mesh(rotorGeo, assetMat);
    r.castShadow = true;
    r.rotation.z = i * 0.9;
    pivot.add(r);
    left.group.add(pivot);
    return r;
  });

  // Right: a short transmission line feeding a substation.
  const right = addCluster((b) => {
    const t1 = tower(b, -9, -7, -0.4);
    const t2 = tower(b, -1, -10, -0.4);
    const t3 = tower(b, 7, -13, -0.4);
    [
      [t1, t2],
      [t2, t3],
    ].forEach(([a, c]) => a.tips.forEach((p, k) => b.push(cable(p, c.tips[k], 0.7))));
    substation(b, 0, 4);
  });

  // ---------- Camera ----------
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 600);
  const target = new Vector3(0, 0, 0);
  const dir = new Vector3();
  const rightV = new Vector3();
  const upV = new Vector3();
  const basis = (az: number, el: number) => {
    dir.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
    rightV.set(Math.cos(az), 0, -Math.sin(az));
    upV.crossVectors(dir, rightV).normalize();
  };

  let width = 1;
  let height = 1;
  let viewW = 60;
  let viewH = 30;
  const tiltGoal = { x: 0, y: 0 };
  const tilt = { x: 0, y: 0, vx: 0, vy: 0 };

  /** Puts a cluster on the ground under a screen position (in view units from the centre). */
  const place = (group: Group, sx: number, sy: number, scale: number) => {
    const p = target.clone().addScaledVector(rightV, sx).addScaledVector(upV, sy);
    p.addScaledVector(dir, -p.y / dir.y); // slide along the view ray down to y = 0
    group.position.copy(p);
    group.scale.setScalar(scale);
  };

  function layout() {
    basis(BASE_AZ * DEG, BASE_EL * DEG);
    const aspect = width / height;
    if (aspect >= 1.25) {
      // Wide card: one cluster on each side of the centred copy.
      viewH = 30;
      viewW = viewH * aspect;
      place(left.group, -viewW / 2 + 12, -7, 1);
      place(right.group, viewW / 2 - 12, -6, 1);
    } else {
      // Tall card: clusters in the top-left and bottom-right corners.
      viewW = 36;
      viewH = viewW / aspect;
      place(left.group, -viewW * 0.2, viewH * 0.36, 0.72);
      place(right.group, viewW * 0.2, -viewH * 0.47, 0.72);
    }
  }

  function applyCamera() {
    basis((BASE_AZ + tilt.x * TILT_AZ) * DEG, (BASE_EL - tilt.y * TILT_EL) * DEG);
    camera.left = -viewW / 2;
    camera.right = viewW / 2;
    camera.top = viewH / 2;
    camera.bottom = -viewH / 2;
    camera.position.copy(target).addScaledVector(dir, 200);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    sun.position.copy(target).add(new Vector3(-50, 90, 30));
    sun.target.position.copy(target);
    sun.target.updateMatrixWorld();
  }

  function resize(w: number, h: number) {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setSize(width, height, false);
    layout();
    applyCamera();
  }

  function setPointer(x: number, y: number) {
    if (opts.reducedMotion) return;
    tiltGoal.x = Math.max(-1, Math.min(1, x));
    tiltGoal.y = Math.max(-1, Math.min(1, y));
  }

  function tick(dt: number) {
    dt = Math.min(dt, 1 / 20);
    let moving = false;
    if (!opts.reducedMotion) {
      // Critically damped spring, same feel as the 3D section's pointer tilt.
      const w = (2 * Math.PI) / 0.9;
      tilt.vx += (-w * w * (tilt.x - tiltGoal.x) - 2 * w * tilt.vx) * dt;
      tilt.vy += (-w * w * (tilt.y - tiltGoal.y) - 2 * w * tilt.vy) * dt;
      tilt.x += tilt.vx * dt;
      tilt.y += tilt.vy * dt;
      rotors.forEach((r, i) => (r.rotation.z -= dt * (0.8 + i * 0.12)));
      moving = true;
    }
    applyCamera();
    renderer.render(scene, camera);
    return moving;
  }

  function dispose() {
    renderer.dispose();
    left.geo.dispose();
    right.geo.dispose();
    rotorGeo.dispose();
    assetMat.dispose();
    shadowMat.dispose();
    ground.geometry.dispose();
  }

  return { resize, setPointer, tick, dispose };
}
