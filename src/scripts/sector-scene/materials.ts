import {
  Color,
  MeshLambertMaterial,
  ShaderLib,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
  Vector4,
  type IUniform,
} from 'three';

export const HAZARD_SLOTS = 5;

/**
 * Ground material.
 * - Base colour matches the page canvas so the plane disappears into the page.
 * - A faint world-space dot grid (the "map" texture of the scene).
 * - Shadows are not shaded smoothly: they are quantised with an ordered
 *   (Bayer 4×4) dither in screen space, which is the brand touch.
 * - Hazard zones (one per sector) paint a dithered orange field that fades in
 *   when that sector is in focus.
 */
export function createGroundMaterial(opts: { pixel: number }) {
  const uniforms: Record<string, IUniform> = UniformsUtils.merge([
    UniformsLib.lights,
    UniformsLib.fog,
    {
      uBase: { value: new Color('#FAFAFA') },
      uGridDot: { value: new Color('#C9C9C9') },
      uShadow: { value: new Color('#A7A7A7') },
      uAccent: { value: new Color('#FF3700') },
      uPixel: { value: opts.pixel },
      uSpacing: { value: 1.6 },
      uDotRadius: { value: 0.07 },
      uShadowStrength: { value: 0.92 },
      uHazards: { value: Array.from({ length: HAZARD_SLOTS }, () => new Vector4(0, 0, 1, 0)) },
      uTime: { value: 0 },
    },
  ]);

  const vertexShader = ShaderLib.shadow.vertexShader
    .replace('#include <common>', '#include <common>\nvarying vec3 vWorld;')
    .replace(
      '#include <fog_vertex>',
      '#include <fog_vertex>\n  vWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;',
    );

  const fragmentShader = ShaderLib.shadow.fragmentShader
    .replace(
      'uniform vec3 color;\nuniform float opacity;',
      /* glsl */ `
uniform vec3 uBase;
uniform vec3 uGridDot;
uniform vec3 uShadow;
uniform vec3 uAccent;
uniform float uPixel;
uniform float uSpacing;
uniform float uDotRadius;
uniform float uShadowStrength;
uniform float uTime;
uniform vec4 uHazards[${HAZARD_SLOTS}]; // x, z, radius, intensity
varying vec3 vWorld;

float bayer4(vec2 p) {
  vec2 q = mod(floor(p), 4.0);
  float i = q.x + q.y * 4.0;
  // 4x4 Bayer matrix, row-major
  if (i < 0.5) return 0.0;   if (i < 1.5) return 8.0;   if (i < 2.5) return 2.0;   if (i < 3.5) return 10.0;
  if (i < 4.5) return 12.0;  if (i < 5.5) return 4.0;   if (i < 6.5) return 14.0;  if (i < 7.5) return 6.0;
  if (i < 8.5) return 3.0;   if (i < 9.5) return 11.0;  if (i < 10.5) return 1.0;  if (i < 11.5) return 9.0;
  if (i < 12.5) return 15.0; if (i < 13.5) return 7.0;  if (i < 14.5) return 13.0; return 5.0;
}
`,
    )
    .replace(
      'gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );',
      /* glsl */ `
  vec2 cell = gl_FragCoord.xy / uPixel;
  float t = (bayer4(cell) + 0.5) / 16.0;
  float t2 = (bayer4(cell + vec2(2.0, 1.0)) + 0.5) / 16.0;

  vec3 col = uBase;

  // World-space dot grid
  vec2 g = vWorld.xz / uSpacing;
  float d = length(fract(g) - 0.5) * uSpacing;
  float aa = fwidth(d) * 0.75;
  float dotMask = 1.0 - smoothstep(uDotRadius - aa, uDotRadius + aa, d);
  col = mix(col, uGridDot, dotMask * 0.8);

  // Hazard fields: dithered orange haze around assets in focus
  float hz = 0.0;
  for (int k = 0; k < ${HAZARD_SLOTS}; k++) {
    vec4 h = uHazards[k];
    if (h.w <= 0.001) continue;
    float dist = distance(vWorld.xz, h.xy);
    float fall = 1.0 - smoothstep(h.z * 0.15, h.z, dist);
    float ring = 0.5 + 0.5 * sin(dist * 1.4 - uTime * 1.6);
    hz = max(hz, h.w * fall * (0.26 + 0.1 * ring));
  }
  if (hz > t2) col = uAccent;

  // Dithered shadow (drawn over the haze so assets still sit on the ground)
  float shadow = (1.0 - getShadowMask()) * uShadowStrength;
  if (shadow > t) col = uShadow;

  gl_FragColor = vec4(col, 1.0);`,
    );

  return new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    lights: true,
    fog: true,
  });
}

/**
 * Animated line material for the orange cable in each bundle.
 * Needs a per-vertex `aDist` attribute (distance along the polyline).
 */
export function createFlowMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new Color('#FF3700') },
      uBase: { value: new Color('#FAFAFA') },
      uTime: { value: 0 },
      uSpeed: { value: 6 },
      uPeriod: { value: 14 },
      /** Distance along the line up to which it is orange; beyond it the line is idle grey. */
      uReveal: { value: 1e6 },
      uIdle: { value: new Color('#BDBDBD') },
      uMinAlpha: { value: 0.35 },
    },
    vertexShader: /* glsl */ `
      attribute float aDist;
      varying float vDist;
      void main() {
        vDist = aDist;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uPeriod;
      uniform float uReveal;
      uniform vec3 uIdle;
      uniform float uMinAlpha;
      varying float vDist;
      void main() {
        if (vDist > uReveal) {
          gl_FragColor = vec4(uIdle, 1.0);
          #include <colorspace_fragment>
          return;
        }
        float p = fract((vDist - uTime * uSpeed) / uPeriod);
        float pulse = smoothstep(0.0, 0.08, p) * (1.0 - smoothstep(0.08, 0.5, p));
        float a = uMinAlpha + (1.0 - uMinAlpha) * pulse;
        gl_FragColor = vec4(uColor, a);
        #include <colorspace_fragment>
      }
    `,
  });
}

/**
 * The at-risk assets in the brand's fire gradient (the same one as the site's
 * orange fills). A white Lambert material whose lighting is mapped onto a
 * colour ramp instead of shading one flat orange: faces in shadow sink to an
 * ember red, lit faces carry #FF3700, and the brightest faces warm towards
 * amber. The tops of tall assets lean a little warmer too (world height), so
 * a tower or a turbine reads like a flame, darker at the foot.
 * Ramp stops are mixed in linear light with smoothsteps, so the blend has no
 * visible bands.
 */
/** Colour ramp: shadow → mid → lit → brightest. */
const FIRE_RAMP = ['#9e1400', '#e02400', '#ff3700', '#ff8a2a'] as const;
type FireUniforms = Record<'uEmber' | 'uRed' | 'uOrange' | 'uAmber', { value: Color }>;
const applyRamp = (u: FireUniforms) => {
  const [a, b, c, d] = FIRE_RAMP;
  u.uEmber.value.set(a);
  u.uRed.value.set(b);
  u.uOrange.value.set(c);
  u.uAmber.value.set(d);
};

export function createFireMaterial() {
  const mat = new MeshLambertMaterial({ color: 0xffffff });
  const uniforms = {
    uEmber: { value: new Color() },
    uRed: { value: new Color() },
    uOrange: { value: new Color() },
    uAmber: { value: new Color() },
    // Lighting range mapped onto the ramp (luminance of the white material).
    uLo: { value: 0.4 },
    uHi: { value: 1.5 },
    // World height over which the warm lift builds up, and its strength.
    uHeight: { value: 12 },
    uLift: { value: 0.42 },
  };
  applyRamp(uniforms);
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vFireY;')
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\n  vFireY = (modelMatrix * vec4(transformed, 1.0)).y;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying float vFireY;
        uniform vec3 uEmber;
        uniform vec3 uRed;
        uniform vec3 uOrange;
        uniform vec3 uAmber;
        uniform float uLo;
        uniform float uHi;
        uniform float uHeight;
        uniform float uLift;`,
      )
      .replace(
        '#include <opaque_fragment>',
        `float fireLum = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));
        float fireT = clamp((fireLum - uLo) / (uHi - uLo), 0.0, 1.0);
        fireT = clamp(fireT + uLift * smoothstep(0.0, uHeight, vFireY), 0.0, 1.0);
        vec3 fire = mix(uEmber, uRed, smoothstep(0.0, 0.3, fireT));
        fire = mix(fire, uOrange, smoothstep(0.25, 0.62, fireT));
        fire = mix(fire, uAmber, smoothstep(0.62, 1.0, fireT));
        outgoingLight = fire;
        #include <opaque_fragment>`,
      );
  };
  // Distinct program from the plain Lambert materials.
  mat.customProgramCacheKey = () => 'predicterra-fire';
  return mat;
}
