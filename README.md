# Predicterra website

Marketing site for Predicterra. Static, multi-page, light mode only, built on the BRAND KIT rules from the PREDICTERRA Figma file.

## Stack

| Piece | Why |
| --- | --- |
| [Astro](https://astro.build) (static output) | Multi-page site with zero JavaScript by default, file-based routing for the pages that come next, i18n routing and great SEO out of the box. |
| [three.js](https://threejs.org) | The isometric sector scene. Loaded lazily (dynamic import) only when the section approaches the viewport, so it never blocks the hero. |
| `@fontsource-variable/archivo` | Archivo, self-hosted and preloaded (no Google Fonts request). |
| `@astrojs/sitemap` | `sitemap-index.xml` generated on build. |

No CSS framework, no animation library: motion is CSS transitions plus a small spring in the 3D camera.

## Scripts

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/
npm run check     # type check + brand rules (no uppercase, no monospace, no positive tracking, Archivo only)
```

Node `>=22.23.4` (see `.nvmrc`).

## Structure

```
src/
  pages/              Routes. index.astro = home. Add platform.astro, grid.astro… here.
  layouts/BaseLayout.astro   <head>, SEO, Open Graph, JSON-LD, header and footer
  components/         Header (with menu drawer), footer, logo, button, text link, notched rule, icon
  sections/home/      One file per homepage section, in page order
  scripts/theme-scrub.ts  Scroll-linked light ↔ dark transition around Solutions
  scripts/hero-video.ts   Plays the visible hero video; pauses off screen, with reduced motion or data saver
  scripts/sector-scene/
    controller.ts     Scroll → focus mapping, copy swaps, markers, alert cards, lazy WebGL
    world-trail.ts    Homepage scene: diagonal chip trace, orange assets at risk
    world.ts          Lab scene: overview first, then each sector
    geometry.ts       Procedural assets (towers, substation, solar, turbines, oil & gas, fillers)
    materials.ts      Dithered-shadow ground shader and animated cable material
  i18n/
    config.ts         Locales, getCopy(), localizePath()
    en/common.ts      Header, menu, footer copy
    en/home.ts        All homepage copy, including the 3D alerts
  data/
    routes.ts         Every internal and external link in one place
    seo.ts            Organization, WebSite and SoftwareApplication JSON-LD
    icons.ts          Material Symbols (Outlined) paths
  styles/tokens.css   Brand tokens (colour ramp, type scale, tracking, easing)
  styles/global.css   Reset, type utilities, button, chip, icon box, text link
```

## Homepage sections

1. **Hero**: light top with a centred grey title, and a full-width band below where the video plays behind an 8×3 square grid (4×3 on mobile). Some cells are frosted (`backdrop-filter`), three carry info blocks (light / orange). Cell positions live in `hero.cells` in `src/i18n/en/home.ts`. **Menu > Hero layout (test)** switches between Centred (title above the logos), Split (larger title on the left, smaller logos on the right) Cutout (`HeroCutout.astro`: full-screen video, short title bottom left, logos in a light notch along the bottom edge that ends in a 45° step) and Pixel (`HeroPixel.astro` + `scripts/hero-pixel.ts`: the video shows through a drifting pixel mask drawn on a canvas; light cells along the edge show their count of video neighbours; orange pixels are example alerts with cards, auto-cycling every 4.5 s; the mouse becomes a grid-snapped orange crosshair with illustrative coordinates and opens a small window into the video. Copy blocks marked `data-pixel-keep` always stay light. Alert copy and positions live in `hero.pixel` in `home.ts`). It applies instantly and is saved in `localStorage` (`predicterra:hero`, applied before paint as `html[data-hero]`). Both hero sections are in the page; CSS shows one (`data-hero-variant`), and `scripts/hero-video.ts` only plays the video of the visible one (the cutout video has `preload="none"`, so it costs nothing until chosen). Remove the layouts you don't keep, and give the winner the only `h1`. Without JavaScript the Pixel hero falls back to a plain light hero.
2. **Logos**: original SVGs in `public/logos` (from the woza-homepage assets), rendered monochrome inside the hero, between the title and the video grid.
3. **Claim**: statement with a scroll-linked reading highlight.
4. **3D sectors** (`SectorTrail.astro`, "chip trace" variant): pinned section that opens on Grid and travels diagonally to the bottom right along a circuit-like trace to Substations, Solar, Wind and Oil & gas. The asset at risk in each sector is orange; its square marker opens the alert card on hover, focus or tap. When the last stop is done, Solutions slides over the stage.
5. **Solutions**: dark section with an endless reel of the 18 sectors (`scripts/reel.ts`): constant speed, a short boost from page scroll, the row on the centre line lights up. Static two-column list with reduced motion. Colours scrub light to dark with `scripts/theme-scrub.ts`; the header switches theme while it is under it.
6. **Benefits** (key figures: title left, one ruled row per figure with a large value, Hut 8 pattern), 7. **Success stories** (light grey placeholder image, title and arrow only), 8. **CTA** (dark, centred), 9. **Footer**.

The first version of the 3D section (`SectorScene.astro`, opens on the whole network, legend on the right) is also on the homepage for testing. **Menu > 3D view (test)** switches between Trace and Overview: the choice is saved in `localStorage` (`predicterra:scene`), applied before first paint by an inline script in `BaseLayout.astro` (`html[data-scene]`), and only the visible variant mounts its WebGL scene. Remove `SectorScene` from `src/pages/index.astro` and the switch from `SiteHeader.astro` once a version is chosen.

## The 3D scene

- Assets are untextured white Lambert meshes, merged into one draw call. Rotors are separate so they can spin.
- Shadows on the ground are quantised with a 4×4 Bayer dither in screen space (`materials.ts`). The same dither paints an orange hazard field around the asset in focus.
- The camera is orthographic (near-isometric) and follows the scroll through a critically damped spring.
- To swap a procedural asset for a Blender model, load the GLB in `world.ts`, give it `whiteMat`, `castShadow` and `receiveShadow`, and keep its alert anchor in `anchors`.
- Homepage scene: `world-trail.ts`. Scroll maps 1:1 to the trace (no holds, no snapping). The camera glides in a straight line between stops and eases into a different angle at each one (`STOP_AZIMUTH`, `STOP_ELEVATION`); the pointer adds a small spring-smoothed tilt (`TILT_*`, mouse only, off with reduced motion). The trace is built from `HOP` (one circuit hop, repeated between stops); assets at risk go into the `risky` bucket and render with the orange material. The orange conductor fills up behind the camera (`uReveal` in `createFlowMaterial`).
- Lab scene: `world.ts`. Both share `geometry.ts`, `materials.ts` and `controller.ts` (`mountSectorScene(root, 'trail' | 'overview')`).
- Tuning knobs: camera stops (`lift`, `views` / `stops`), hazard radii, `HOLD` and `LAST_HOLD` in `controller.ts` (the CSS height of `.sectors` must match `LAST_HOLD`).
- Respects `prefers-reduced-motion` (no spring, no spinning, no pulses) and falls back to static markers without WebGL2.

## Preview on GitHub Pages

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`: https://wozalabs.github.io/predicterra-web/

- One-time setup in the repo: **Settings > Pages > Build and deployment > Source = GitHub Actions**.
- The preview lives under `/predicterra-web/`, so the workflow sets `SITE_BASE` and `SITE_URL`. Always build internal links and asset paths with `localizePath()` or `withBase()` (`src/i18n/config.ts`), never a bare `"/..."`, or they break on the preview.
- The preview is `noindex` (`PUBLIC_NOINDEX`), so it never competes with www.predicterra.com in search. A normal `npm run build` is unaffected.

## Adding a page

1. Create `src/pages/<route>.astro` using `BaseLayout`.
2. Put its copy in `src/i18n/en/<page>.ts` and export it from `src/i18n/en/index.ts`.
3. The route is already listed in `src/data/routes.ts` if it is linked from the menu or footer.

## Adding Spanish

1. Add `'es'` to `locales` in `astro.config.mjs` and `src/i18n/config.ts`.
2. Copy `src/i18n/en` to `src/i18n/es` and translate.
3. Create `src/pages/es/index.astro` passing `locale="es"`, and add the matching `hreflang` links in `BaseLayout.astro`.

## SEO checklist

- One `h1` per page, descriptive `title` and `description` per page.
- Canonical URL, Open Graph and Twitter tags, `og:image` at `public/og/predicterra-og.png` (1200×630).
- JSON-LD for Organization, WebSite and SoftwareApplication.
- All 3D section copy (sector names, descriptions and alerts) is real HTML in the DOM, not canvas text.
- `robots.txt` and `sitemap-index.xml`. Update `site` in `astro.config.mjs` if the domain changes.

## Content to confirm before publishing

- Naturgy and Moeve case cards contain `[Pending]` placeholders.
- Alerts in the 3D section are illustrative; asset names and values are examples.
- Logo row uses wordmarks in Archivo; replace with approved logo files.
- The old site shows two addresses ("BAT Aceleration Tower" and "BAT - Gran Vía 1"). This site uses BAT Tower, Gran Vía 1, 48001 Bilbao.
- Compliance figure: the old site says both 95% and 80% less time. This site uses 95%.
- Linked pages (platform, sectors, about, contact, privacy, legal) do not exist yet and fall through to the 404 page.

> Note: write `backdrop-filter` without the `-webkit-` duplicate. The CSS minifier keeps only one of the two, and with both present it drops the standard property (blur would not show in Chrome).
