import { routes, external } from '../../data/routes';

export default {
  seo: {
    title: 'Predicterra | Asset foresight software for energy infrastructure',
    description:
      'Predicterra turns satellite, weather and sensor data into asset-level foresight for grid, solar, wind and oil & gas operators. See the physical future of your assets before it happens.',
  },

  hero: {
    eyebrow: 'Asset foresight for energy',
    titleLine1: 'Foresight infrastructure',
    titleLine2: 'for the energy transition',
    video: {
      poster: '/video/hero-poster.webp',
      large: '/video/hero-1080.mp4',
      small: '/video/hero-720.mp4',
    },
    // Grid over the video. c/r = column/row on desktop (8×3), cm/rm on mobile (4×3).
    cells: [
      { kind: 'info', tone: 'light', index: '01', title: 'Asset-level foresight', c: 2, r: 1, cm: 1, rm: 1 },
      { kind: 'info', tone: 'accent', index: '02', title: 'Physics, not correlation', c: 4, r: 3, cm: 3, rm: 3 },
      { kind: 'info', tone: 'light', index: '03', title: 'Live in eight weeks', c: 7, r: 2, cm: 4, rm: 2 },
      { kind: 'blur', c: 3, r: 2, cm: 2, rm: 2 },
      { kind: 'blur', c: 5, r: 1, cm: 3, rm: 1 },
      { kind: 'blur', c: 6, r: 3, cm: 1, rm: 3 },
      { kind: 'blur', c: 8, r: 1, cm: 0, rm: 0 },
    ],
    // Cutout layout (test): full-screen video, short title bottom left,
    // logos in the light notch along the bottom edge.
    cutout: {
      eyebrow: 'Asset foresight for energy',
      titleLine1: 'Foresight for the',
      titleLine2: 'energy transition',
    },
    // Clean layout (test): only the video, the title and one action.
    clean: {
      titleLine1: 'Foresight for the',
      titleLine2: 'energy transition',
      text: 'Asset-level foresight from satellite, weather and sensor data, so operators act before the physical world does.',
      cta: { label: 'Request a demo', href: routes.demo },
    },
    // Pixel layout (test): the video shows through a pixel mask that drifts
    // slowly; the orange pixels are example alerts. x/y place each alert on
    // desktop (fractions of the hero), xm/ym on phones.
    pixel: {
      eyebrow: 'Asset foresight for energy',
      titleLine1: 'Foresight for the',
      titleLine2: 'energy transition',
      text: 'Predicterra turns satellite, weather and sensor data into asset-level foresight, so operators act before the physical world does.',
      alertsLabel: 'Example alerts',
      alertLabel: 'Alert',
      alerts: [
        { icon: 'water_drop', asset: 'Substation SE-14', risk: 'Flood risk at the control building', when: 'Act within 72 h', x: 0.6, y: 0.46, xm: 0.72, ym: 0.56 },
        { icon: 'local_fire_department', asset: 'Line L-207, span 41', risk: 'Vegetation 1.2 m from the conductor', when: 'Trim this week', x: 0.36, y: 0.74, xm: 0.22, ym: 0.68 },
        { icon: 'wind_power', asset: 'Wind farm WF-03, turbine 12', risk: 'Icing risk on the blades tonight', when: 'Act within 12 h', x: 0.84, y: 0.36, xm: 0, ym: 0 },
        { icon: 'solar_power', asset: 'Solar plant PV-08, block C', risk: 'Soiling loss above 6%', when: 'Schedule cleaning', x: 0.74, y: 0.7, xm: 0, ym: 0 },
      ],
    },
  },



  logos: {
    title: 'Trusted by operators, recognized by the sector',
    // Original logo files in public/logos, rendered white over the hero video.
    // `h` is the rendered height in px, tuned per logo for equal optical weight.
    items: [
      { name: 'Iberdrola', src: '/logos/iberdrola.svg', w: 109, h0: 27, h: 26 },
      { name: 'UFD, Grupo Naturgy', src: '/logos/ufd.svg', w: 848, h0: 512, h: 40 },
      { name: 'Moeve', src: '/logos/moeve.svg', w: 109, h0: 20, h: 19 },
      { name: 'Microsoft Partner', src: '/logos/microsoft-partner.svg', w: 1352, h0: 350, h: 30 },
      { name: 'BIND 4.0', src: '/logos/bind.svg', w: 1305, h0: 256, h: 22 },
    ],
  },

  claim: {
    label: 'Why Predicterra',
    text: 'Predicterra fuses satellite, sensor, weather and terrain data into one physics-based model, and runs it inside planning, control, risk and compliance.',
    accent: 'We don’t describe risk. We govern it.',
    link: { kicker: 'Learn more', label: 'How the platform works', href: routes.platform },
  },

  scene: {
    label: 'One system. Every asset.',
    title: 'One operational view of your entire network',
    intro:
      'Grid, renewables and oil & gas, modeled together on one living map. Scroll to move across the network.',
    hintPointer: 'Hover a marker to open its alert',
    hintTouch: 'Tap a marker to open its alert',
    progressLabel: 'Sectors',
    indexLabel: 'Sector',
    linkPrefix: 'Predicterra for',
    requiresAction: 'Requires action',
    windowLabel: 'Window',
    confidenceLabel: 'Confidence',
    actionLabel: 'Recommended action',
    openAlert: 'Open alert for',
    footnote: 'Illustrative alerts. Values are examples.',
    sectors: [
      {
        id: 'grid',
        icon: 'bolt',
        index: '01',
        title: 'Grid',
        text: 'Asset-level exposure across lines, towers and control operations. See grid stress coming before it reaches the network.',
        href: routes.sectors.grid,
        alert: {
          severity: 'Critical',
          hazard: 'Wildfire risk',
          hazardIcon: 'local_fire_department',
          asset: 'Tower T-1184',
          context: 'Line 220 kV, Bizkaia',
          metricLabel: 'Fire risk index',
          metric: '9/10',
          window: 'In 48 h',
          confidence: '0.88',
          action: 'Clear vegetation within 4 m of the conductor and pre-position a crew.',
        },
      },
      {
        id: 'substation',
        icon: 'electrical_services',
        index: '02',
        title: 'Substations',
        text: 'Flood depth, heat and access modeled for every substation, together with the downstream assets that depend on it.',
        href: routes.sectors.grid,
        alert: {
          severity: 'High',
          hazard: 'Flood risk',
          hazardIcon: 'water_drop',
          asset: 'Substation SE-42',
          context: '184 downstream assets',
          metricLabel: 'Water depth',
          metric: '0.6 m',
          window: 'In 18 h',
          confidence: '0.91',
          action: 'Inspect the transformer yard and pre-position crews before the peak.',
        },
      },
      {
        id: 'solar',
        icon: 'solar_power',
        index: '03',
        title: 'Solar',
        text: 'Forecast production risk, heat stress and site-level climate exposure across every plant in the portfolio.',
        href: routes.sectors.solar,
        alert: {
          severity: 'High',
          hazard: 'Heat stress',
          hazardIcon: 'thermostat',
          asset: 'Solar plant PV-07',
          context: '48 MWp, Extremadura',
          metricLabel: 'Module temperature',
          metric: '78 °C',
          window: 'Next 3 days',
          confidence: '0.86',
          action: 'Move maintenance windows and apply inverter derating at midday.',
        },
      },
      {
        id: 'wind',
        icon: 'wind_power',
        index: '04',
        title: 'Wind',
        text: 'Monitor wind, storm and access risk across turbines and sites, hours before the weather arrives.',
        href: routes.sectors.wind,
        alert: {
          severity: 'Critical',
          hazard: 'Extreme wind',
          hazardIcon: 'air',
          asset: 'Turbine WT-12',
          context: 'Wind farm Oiz, Bizkaia',
          metricLabel: 'Gusts at hub height',
          metric: '31 m/s',
          window: 'In 12 h',
          confidence: '0.90',
          action: 'Schedule a controlled shutdown and suspend site access.',
        },
      },
      {
        id: 'oilgas',
        icon: 'oil_barrel',
        index: '05',
        title: 'Oil & gas',
        text: 'Track weather, wildfire and flooding risk around tank farms, pipelines and process units.',
        href: routes.sectors.oilGas,
        alert: {
          severity: 'High',
          hazard: 'Wildfire spread',
          hazardIcon: 'local_fire_department',
          asset: 'Tank farm TF-3',
          context: 'Refinery perimeter, north',
          metricLabel: 'Fire front distance',
          metric: '2.1 km',
          window: 'In 30 h',
          confidence: '0.84',
          action: 'Activate the perimeter protocol and keep access routes clear.',
        },
      },
    ],
  },

  solutions: {
    title: 'Solutions',
    caption: 'One engine for every sector that runs on the physical world.',
    countLabel: 'sectors',
    // Illustrative list; it scrolls continuously in the section.
    sectors: [
      'Energy & Electricity',
      'Power Grid Infrastructure',
      'Renewable Energy (Solar & Wind)',
      'Oil & Gas',
      'Agriculture',
      'Forestry & Timber',
      'Mining & Minerals',
      'Transportation & Mobility',
      'Logistics & Supply Chain',
      'Manufacturing & Industrial Operations',
      'Construction & Infrastructure',
      'Telecommunications',
      'Water & Waste Management',
      'Insurance & Risk Management',
      'Real Estate & Property Management',
      'Government & Public Infrastructure',
      'Environmental & Climate Monitoring',
      'Defense & Security',
    ],
  },



  benefits: {
    title: 'Key figures',
    stats: [
      { label: 'Avoided outage costs', value: '€2.1M', caption: 'Per year, by turning risk into action sooner' },
      { label: 'Faster decisions', value: '5×', caption: 'From raw climate and network data to a decision' },
      { label: 'Less reporting time', value: '95%', caption: 'For climate and compliance reports' },
      { label: 'Time to live', value: '8 weeks', caption: 'From license to running inside your systems' },
    ],
  },


  cases: {
    title: 'Success stories',
    exploreKicker: 'Explore',
    exploreLabel: 'All success stories',
    exploreHref: routes.cases,
    // Images are light grey placeholders until real case photography is ready.
    items: [
      { title: 'Protecting 1.1M km of power line from the climate', href: external.iberdrolaCoverage, external: true },
      { title: '[Pending] Case title for Naturgy', href: routes.cases, external: false },
      { title: '[Pending] Case title for Moeve', href: routes.cases, external: false },
    ],
  },


  cta: {
    label: 'Ready before the next event',
    // Rendered on two lines.
    titleLine1: 'Run your infrastructure',
    titleLine2: 'on',
    titleAccent: 'foresight.',
    text: 'One live system across every asset, every feed, every team. Licenses start at USD 50,000.',
    primary: { label: 'Request a demo', href: routes.demo },
    secondary: { kicker: 'Procurement', label: 'Explore on Azure', href: external.azure },
  },
};
