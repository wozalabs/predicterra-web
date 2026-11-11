/**
 * About · "European, independent and under your control."
 *
 * A light landscape in perspective: a terrain of rolling hills drawn as a
 * world-space dot grid with topographic contour lines, fading into the page
 * canvas at the horizon. Each point of the section rises out of the ground as a
 * line with its text at the top; when the next one rises in the foreground, the
 * previous one glides back towards the horizon and fades, without going far.
 *
 * The scene only draws while the section is near the viewport. The texts are the
 * section's own list items (real HTML), placed over the scene every frame by
 * projecting the top of their line.
 */
import {
  BoxGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';

const CANVAS = '#FAFAFA';
const INK = '#1E1E1E';
const ACCENT = '#FF3700';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Terrain height: flat where the points stand, hills to the sides, a ridge far away. */
function height(x: number, z: number) {
  const far = smooth(clamp01((-z - 40) / 140));
  const side = smooth(clamp01((Math.abs(x) - 14) / 60));
  const roll = Math.sin(x * 0.07 + 1.3) * Math.cos(z * 0.05) * 1.6 + Math.sin(x * 0.021 - z * 0.034) * 2.2;
  const ridge = (Math.sin(x * 0.045) * 0.5 + 0.5) * 9 + Math.sin(x * 0.11 + 2) * 2.5;
  const keepFlat = 1 - smooth(clamp01(1 - (Math.abs(x) - 4) / 16)) * (1 - far);
  return (roll * (0.35 + side) + ridge * far + side * 7) * keepFlat;
}

function terrainMaterial() {
  return new ShaderMaterial({
    uniforms: {
      uBase: { value: new Color(CANVAS) },
      uDot: { value: new Color('#BDBDBD') },
      uContour: { value: new Color('#D2D2D2') },
      uFogNear: { value: 40 },
      uFogFar: { value: 210 },
      uShift: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      varying float vDepth;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        vec4 mv = viewMatrix * world;
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uBase;
      uniform vec3 uDot;
      uniform vec3 uContour;
      uniform float uFogNear;
      uniform float uFogFar;
      uniform float uShift;
      varying vec3 vWorld;
      varying float vDepth;
      void main() {
        vec3 col = uBase;
        // Dot grid on the ground plane.
        vec2 p = vec2(vWorld.x, vWorld.z + uShift);
        float sp = 1.8;
        vec2 cell = fract(p / sp) - 0.5;
        float d = length(cell) * sp;
        float fw = fwidth(d) * 1.2;
        float dotMask = 1.0 - smoothstep(0.075, 0.075 + fw, d);
        col = mix(col, uDot, dotMask * 0.85);
        // Topographic contours from the height.
        // Lines sit at half steps, so the flat ground (height 0) carries none.
        float h = vWorld.y / 1.1;
        float c = abs(fract(h) - 0.5) / max(fwidth(h), 1e-4);
        float line = 1.0 - min(c, 1.0);
        col = mix(col, uContour, line * 0.9);
        // Fade into the page canvas at the horizon.
        float fog = smoothstep(uFogNear, uFogFar, vDepth);
        gl_FragColor = vec4(mix(col, uBase, fog), 1.0);
      }
    `,
  });
}

/** Material for the rising lines: flat colour that fades into the canvas with distance. */
function lineMaterial(color: string) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new Color(color) },
      uBase: { value: new Color(CANVAS) },
      uOpacity: { value: 1 },
      uFogNear: { value: 40 },
      uFogFar: { value: 210 },
    },
    vertexShader: /* glsl */ `
      varying float vDepth;
      varying float vY;
      void main() {
        vY = position.y + 0.5;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform vec3 uBase;
      uniform float uOpacity;
      uniform float uFogNear;
      uniform float uFogFar;
      varying float vDepth;
      varying float vY;
      void main() {
        float fog = smoothstep(uFogNear, uFogFar, vDepth);
        // Slightly lighter at the foot, so the line grows out of the ground.
        float foot = smoothstep(0.0, 0.25, vY);
        gl_FragColor = vec4(mix(uColor, uBase, fog), uOpacity * mix(0.35, 1.0, foot));
      }
    `,
  });
}

export interface Horizon {
  /** pos: current point, fractional while moving (−1 … n−1). */
  render(pos: number): void;
  resize(): void;
  dispose(): void;
}

/**
 * @param canvas  canvas filling the stage
 * @param stage   the pinned stage (its size is the viewport of the scene)
 * @param cards   one element per point, positioned over the scene
 */
export function createHorizon(canvas: HTMLCanvasElement, stage: HTMLElement, cards: HTMLElement[]): Horizon {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(new Color(CANVAS), 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.5, 400);

  // Terrain
  const geo = new PlaneGeometry(420, 320, 220, 170);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0, -110);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, height(pos.getX(i), pos.getZ(i)));
  }
  geo.computeVertexNormals();
  const terrainMat = terrainMaterial();
  scene.add(new Mesh(geo, terrainMat));

  // One group per point: the main line (ink, orange foot), and a few thinner
  // grey lines around it rising with it.
  const n = cards.length;
  const LINE_H = 6.5;
  const lineGeo = new BoxGeometry(1, 1, 1);
  lineGeo.translate(0, 0.5, 0);
  // Mostly right of centre, clear of the title at the top left.
  const xs = [3, 6.5, 1.5, 5.5, 4, 7];
  const groups = cards.map((_, i) => {
    const g = new Group();
    const mats: ShaderMaterial[] = [];
    const main = new Mesh(lineGeo, lineMaterial(INK));
    main.scale.set(0.07, LINE_H, 0.07);
    mats.push(main.material as ShaderMaterial);
    g.add(main);
    const foot = new Mesh(new BoxGeometry(0.5, 0.06, 0.5), new MeshBasicMaterial({ color: ACCENT, transparent: true }));
    g.add(foot);
    // Companions: deterministic offsets and heights.
    const companions: Mesh[] = [];
    for (let k = 0; k < 7; k++) {
      const a = (k * 2.39996 + i) % (Math.PI * 2);
      const r = 2.2 + ((k * 37 + i * 11) % 10) * 0.45;
      const m = new Mesh(lineGeo, lineMaterial('#9A9A9A'));
      const h = 1.5 + ((k * 53 + i * 29) % 10) * 0.42;
      m.position.set(Math.cos(a) * r, 0, Math.sin(a) * r * 0.7);
      m.scale.set(0.035, h, 0.035);
      m.userData.h = h;
      mats.push(m.material as ShaderMaterial);
      companions.push(m);
      g.add(m);
    }
    scene.add(g);
    return { g, main, foot, companions, mats, x: xs[i % xs.length] };
  });

  const top = new Vector3();
  let w = 1;
  let h = 1;

  const resize = () => {
    w = stage.clientWidth;
    h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Narrow screens: pull back a little so the points stay in frame.
    const narrow = w < 720;
    camera.fov = narrow ? 46 : 34;
    camera.position.set(narrow ? 4 : 3, narrow ? 8 : 6.5, narrow ? 27 : 22);
    camera.lookAt(narrow ? 4.5 : 2.5, narrow ? 4.2 : 3, -26);
    camera.updateProjectionMatrix();
  };

  const GAP = 24; // how far back a point glides when the next one rises
  const render = (p: number) => {
    // A slow drift of the ground, so the landscape feels alive.
    terrainMat.uniforms.uShift.value = p * 3;

    groups.forEach((it, i) => {
      const d = p - i; // > 0: behind the current point; < 0: still to come
      const rise = smooth(clamp01((d + 0.75) / 0.6)); // the line grows out of the ground
      const back = Math.max(0, d); // glides back after the next one rises
      const fade = 1 - smooth(clamp01((back - 0.2) / 1.1)); // gone before it gets far
      const vis = rise * fade;
      it.g.visible = vis > 0.001;
      it.g.position.set(it.x + back * (it.x > 0 ? 1.5 : -1.5), height(it.x, -back * GAP) * 0.3, -back * GAP);
      it.main.scale.y = LINE_H * rise;
      it.companions.forEach((c, k) => {
        const delay = clamp01(rise * 1.4 - k * 0.06);
        c.scale.y = (c.userData.h as number) * smooth(delay);
      });
      it.mats.forEach((m) => (m.uniforms.uOpacity.value = vis));
      (it.foot.material as MeshBasicMaterial).opacity = vis;

      // Text at the top of the line, scaled with distance.
      const card = cards[i];
      it.g.updateMatrixWorld();
      top.set(0, LINE_H * rise, 0);
      it.g.localToWorld(top);
      top.project(camera);
      const sx = (top.x * 0.5 + 0.5) * w;
      const sy = (-top.y * 0.5 + 0.5) * h;
      const scale = Math.max(0.55, 1 - back * 0.32);
      const textVis = smooth(clamp01((d + 0.3) / 0.3)) * fade;
      // Anchored at the top of the line: the card sits just right of it and above
      // it, or to its left when there is no room on the right.
      const cw = card.offsetWidth * scale;
      const fitsRight = sx + 18 + cw <= w - 16;
      const fitsLeft = sx - 18 - cw >= 16;
      const mode = fitsRight ? 'right' : fitsLeft ? 'left' : 'clamp';
      card.dataset.side = mode;
      // Narrow screens: neither side fits, so the card is kept on screen above the line.
      const x = mode === 'clamp' ? Math.min(Math.max(16, sx - cw * 0.25), w - 16 - cw) : sx;
      const shift = mode === 'right' ? '18px' : mode === 'left' ? 'calc(-100% - 18px)' : '0px';
      card.style.transform = `translate3d(${x.toFixed(1)}px, ${(sy - (mode === 'clamp' ? 14 : 0)).toFixed(1)}px, 0) scale(${scale.toFixed(3)}) translate(${shift}, -100%)`;
      card.style.opacity = textVis.toFixed(3);
      card.style.visibility = textVis > 0.01 ? 'visible' : 'hidden';
      card.style.zIndex = String(100 - i + Math.round(-back * 10));
    });

    renderer.render(scene, camera);
  };

  resize();

  return {
    render,
    resize,
    dispose() {
      renderer.dispose();
      geo.dispose();
      lineGeo.dispose();
    },
  };
}
