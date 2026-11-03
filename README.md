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

1. **Hero**: Light top with a centred grey title, and a full-width band below where the video plays behind an 8×3 square grid (4×3 on mobile). Some cells are frosted (`backdrop-filter`), three carry info blocks (light / orange). Cell positions live in `hero.cells` in `src/i18n/en/home.ts`. **Menu > Hero layout (test)** switches between Centred (title above the logos), Split (larger title on the left, smaller logos on the right) Cutout (`HeroCutout.astro`: full-screen video, short title bottom left, logos in a light notch along the bottom edge that ends in a 45° step) and Pixel (`HeroPixel.astro` + `scripts/hero-pixel.ts`: the video shows through a drifting pixel mask drawn on a canvas; light cells along the edge show their count of video neighbours; orange pixels are example alerts with cards, auto-cycling every 4.5 s; the mouse becomes a grid-snapped orange crosshair with illustrative coordinates and opens a small window into the video. Copy blocks marked `data-pixel-keep` always stay light. Alert copy and positions live in `hero.pixel` in `home.ts`). It applies instantly and is saved in `localStorage` (`predicterra:hero`, applied before paint as `html[data-hero]`, `clean` when nothing is saved). Both hero sections are in the page; CSS shows one (`data-hero-variant`), and `scripts/hero-video.ts` only plays the video of the visible one (the cutout video has `preload="none"`, so it costs nothing until chosen). Remove the layouts you don't keep, and give the winner the only `h1`. Without JavaScript the Pixel hero falls back to a plain light hero. **Clean (`HeroClean.astro`) is the default** (also without JavaScript): the dimmed full video, the title (the page's only real `h1`), a short description, one button, and the partner logos in white along the bottom edge. The video is dimmed by a scrim and covered with a moving film grain (tiled SVG fractal noise, overlay blend, jumping a few times a second; static with reduced motion) to hide compression and low resolution. Entrance: the footage fades up from the dark background while easing back from a 4% zoom (1.8 s, strong ease-out); the title lines slide up out of a mask, the description and button focus in (blur to sharp) and the logos follow one by one. CSS only; reduced motion skips it.
2. **Logos**: original SVGs in `public/logos` (from the woza-homepage assets), rendered monochrome inside the hero, between the title and the video grid.
3. **Claim**: large statement with a scroll-linked reading highlight; its heading is visually hidden (the 3D section's too).
4. **3D sectors** (`SectorTrail.astro`, "chip trace" variant): pinned section that opens on Grid and travels diagonally to the bottom right along a circuit-like trace to Substations, Solar, Wind and Oil & gas. The asset at risk in each sector is orange; its square marker opens the asset panel on hover, focus or tap (`components/AssetPanel.astro`, shared by both 3D variants): name, place, type and year tags, Registration / GeoHash / Coordinates, a live 3D view of the same asset, risk rows with tick bars (the alert row in orange, with a View alerts chip) and land cover. Panel data per sector lives in `scene.sectors[].panel` in `home.ts` (illustrative). The 3D view is `scripts/sector-scene/asset-preview.ts`: one small shared renderer, a mini scene per sector built with the same geometry, materials and light rig, turning slowly while the panel is open and copied into the panel canvas. When the last stop is done, Solutions slides over the stage.
5. **Solutions**: dark section with an endless reel of the 18 sectors (`scripts/reel.ts`): constant speed, a short boost from page scroll, the row on the centre line lights up. Static two-column list with reduced motion. Colours scrub light to dark with `scripts/theme-scrub.ts`; the header switches theme while it is under it.
6. **Benefits** (key figures: title left, one ruled row per figure with a large value, Hut 8 pattern), 7. **Success stories** (light grey placeholder image, title and arrow only), 8. **CTA**: a grey action card inset from the page edges, with the success-stories notch mirrored on its top edge. `scripts/cta-scene.ts` (three.js, lazy) reuses the 3D section's assets, white material, light rig and dithered-shadow ground (`createGroundMaterial`, base `CTA_GROUND`), wind and solar on one side and grid on the other, and tilts the camera with the pointer (same spring as the 3D section). A soft veil keeps the assets away from the copy. 9. **Footer**: larger logo and tagline, wider spacing.

The first version of the 3D section (`SectorScene.astro`, opens on the whole network, legend on the right) is also on the homepage for testing. **Menu > 3D view (test)** switches between Trace and Overview: the choice is saved in `localStorage` (`predicterra:scene`), applied before first paint by an inline script in `BaseLayout.astro` (`html[data-scene]`), and only the visible variant mounts its WebGL scene. Remove `SectorScene` from `src/pages/index.astro` and the switch from `SiteHeader.astro` once a version is chosen.

## Buttons

`.btn` (global.css, `components/Button.astro`): square, plain fill, label on the left and an inset square on the right (4 px from the edges) holding the arrow. On hover and focus an ordered dither of slightly darker 2 px pixels fades in (one in four across the button, a checkerboard under the label); it only darkens the fill, so contrast improves (white on the orange goes from 3.6:1 to 5.5:1 on the dither pixels). `--btn-dither` sets the pixel colour per variant. Two sizes on a 4 px grid: md 36 px (default, header) and lg 40 px (CTAs). The arrow moves 2 px on hover and focus; press scales to 0.97.

- `variant="primary"` (default): orange with a white square and a black arrow.
- `variant="secondary"`: white with a black square and a white arrow on light surfaces; inside `.theme-dark` it turns dark grey with a white square. Used instead of underline links for secondary actions (Claim, Success stories, CTA).

## Motion on scroll

`scripts/reveal.ts`, mounted from `BaseLayout.astro`:

- `data-reveal`: a 14 px rise and fade the first time the element enters the viewport (700 to 900 ms, strong ease-out). Children of `data-reveal-group` are staggered by 70 ms. The hooks are removed afterwards so hover transitions are unaffected.
- `data-render` (section titles and labels, hero titles and eyebrows, key-figure values, case titles): a plain 600 ms fade once the text is well in view. Opacity only, so nothing moves.
- `data-render-step`: the 3D section titles replay the fade each time their step becomes active.
- Rendering waits for the Archivo web font (`document.fonts.ready`) and titles stay hidden until then (`html.js-render-wait`, with a 2.5 s safety timer in `BaseLayout.astro`), so a title never shows in the fallback font on three lines and then jumps to two.
- Nothing is hidden without JavaScript. With reduced motion there is only a short fade and no render effect.

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

## Logo

`src/data/logo.ts` holds the logotype paths (viewBox 0 0 1056 170). The corner mark is always #FF3700; the wordmark uses `currentColor`, so it follows the header colour (dark on light, light on video and dark sections). The favicon uses the mark and the P.

## About page

`src/pages/about.astro`, copy in `src/i18n/en/about.ts` (texts from predicterra.com/about). Same language as the homepage: a light typographic intro, then Team and Where we are, each after a notched rule with the title left and content right (4 : 8), ending with the homepage CTA card (`Cta.astro` takes an optional `copy` prop; the secondary button only shows when the copy has one). JSON-LD: `AboutPage`.

Photos in `public/about/*.webp` come from predicterra.com/about: portraits 600×600 (cut out on white; `mix-blend-mode: multiply` turns the white into the frame grey), office 1200×800. Both use the success-stories notched frame. `node scripts/fetch-about-images.mjs` downloads them again if they change.

## Header navigation

Platform, About and Contact sit as text links next to **Request a demo** on screens 56rem and wider (`header.nav` in `common.ts`); smaller screens use the menu. The current page gets `aria-current="page"` and a small orange square under its label.

The header animates in on the first page of a visit only (`sessionStorage` key `predicterra:seen` adds `html.is-return`). Navigations between pages use cross-document view transitions (`@view-transition` in `global.css`): the page cross-fades in 200 ms and the header (`view-transition-name: site-header`) stays in place. Browsers without support just load the page; reduced motion turns it off.

## Success stories

Copy for every case lives in `src/i18n/en/cases.ts` (one entry per case: client, sector, region, year, title, summary, key figures, article sections, quote, optional coverage link and image). It feeds:

- the homepage cards (first three, `sections/home/Cases.astro`),
- the index at `/success-stories` (`pages/success-stories/index.astro`, JSON-LD `CollectionPage`),
- one page per case at `/success-stories/<slug>` (`pages/success-stories/[slug].astro`, JSON-LD `Article` + `BreadcrumbList`).

A case page has the image on top, then the article: facts and key figures in the left column (sticky on wide screens) and the text in one 40rem reading column on the right. Below it, the other cases (in order, wrapping around) and the CTA card. Cards share `components/CaseCard.astro`. To add a case, add an entry to `items`; to add a photo, put it in `public/cases/` and set `image` (until then the frame is light grey). The About page and the index share the light intro, `components/PageIntro.astro`.

## Typeface test switch

A **Font** select in the header swaps the global typeface (`--font-sans`) to compare alternatives with Archivo. The list is in `src/data/fonts.ts`: 13 Google Fonts, regular (400) only, none monospaced. Archivo stays self-hosted; the others load from Google Fonts only when chosen. The choice is saved in `localStorage` (`predicterra:font`) and applied before paint by an inline script in `BaseLayout.astro` (`window.predicterraFont`). Tracking tokens are tuned for Archivo, and the fallback font is metric-matched to it, so other faces can shift slightly while loading. Remove `fonts.ts`, the select in `SiteHeader.astro` and the inline script once a face is chosen (self-host the winner with Fontsource).

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

- The live About page numbers its team 01, 02, 10, 04, 10; this site numbers them 01 to 05.
- Success stories: all article copy, quotes, regions and years are `[Pending]` placeholders; Naturgy and Moeve titles, sectors and key figures too. Only the Iberdrola title, its two key figures and the coverage link are real.
- Alerts in the 3D section are illustrative; asset names and values are examples.
- The old site shows two addresses ("BAT Aceleration Tower" and "BAT - Gran Vía 1"). This site uses BAT Tower, Gran Vía 1, 48001 Bilbao.
- Compliance figure: the old site says both 95% and 80% less time. This site uses 95%.
- Linked pages (platform, sectors, contact, privacy, legal) do not exist yet and fall through to the 404 page.

> Note: write `backdrop-filter` without the `-webkit-` duplicate. The CSS minifier keeps only one of the two, and with both present it drops the standard property (blur would not show in Chrome).
