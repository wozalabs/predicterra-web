import type { SectorCopy } from '../../sections/pages/types';
import { actions, cta, cases } from './pages-shared';

// /grid, from "predicterra-03-grid.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'Grid Resilience and Asset Intelligence for DSOs and TSOs | Predicterra',
    description:
      'The Cognitive Twin for transmission and distribution networks. Vegetation, wind, wildfire, flood and heat risk per span and substation, from the next 14 days to 2100.',
  },
  hero: {
    label: 'Predicterra for Grid',
    title: 'See what’s coming to every span and substation.',
    text: 'Put crews in place before the storm, invest in hardening where it cuts the most risk, and give the regulator evidence it can follow.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  asset: 'grid',
  metrics: {
    items: [
      { value: '73%', text: 'faster response to climate events at i-DE' },
      { value: '€2.1M', text: 'in outage costs avoided a year' },
      { value: '116,000 km', text: 'of UFD’s grid in one model' },
      { value: '95%', text: 'less time producing climate and compliance reports' },
    ],
    link: cases.all,
  },
  what: {
    title: 'Every span, every substation, every hazard, on one model.',
    text: 'Predicterra models your network and the forces acting on it: vegetation, wind, wildfire, flood, heat and drought. It ranks every span by failure risk for the next 14 days, prioritizes trimming, maintenance and hardening by real exposure, and shows which feeders and customers depend on each asset. Control center, asset management, risk and regulation work from the same picture.',
    uses: [
      'Storm impact',
      'Vegetation risk',
      'Wildfire ignition',
      'Substation flooding',
      'Crew pre-positioning',
      'Preventive de-energization',
      'Hardening and undergrounding',
      'Quality of supply (TIEPI, NIEPI)',
    ],
  },
  why: {
    title: 'Vegetation analytics tells you where the trees are. We tell you which span fails when the wind reaches them.',
    items: [
      {
        icon: 'science',
        title: 'Physics, not scores',
        text: 'The forces on every span are simulated, then calibrated on your own incident history, up to ten years back.',
      },
      {
        icon: 'groups',
        title: 'One model, every team',
        text: 'Control center, asset management, risk and regulation read the same numbers.',
      },
      {
        icon: 'api',
        title: 'Works with what you have',
        text: 'Reads your GIS, LiDAR, SCADA, ADMS and OMS, and sends risk events back into them.',
      },
      {
        icon: 'lock',
        title: 'Built in Europe',
        text: 'EU-hosted or on-premises, and independent of any energy company or vendor.',
      },
    ],
  },
  cta: cta(
    'Your twin knows your network.',
    'Predicterra knows',
    'what’s coming to it.',
    'See your network in the Cognitive Twin. Start with one problem, on your own data.',
  ),
} satisfies SectorCopy;
