import { actions, cta } from './pages-shared';

// /compliance, from "predicterra-08-compliance.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'CSRD, EU Taxonomy and CER Compliance for Energy Assets | Predicterra',
    description:
      'CSRD physical risk, EU Taxonomy climate risk and vulnerability assessments and CER Directive risk assessments, from the same model your teams operate. Every figure traced to its data.',
  },
  hero: {
    label: 'Compliance · Across every sector',
    title: 'Prove it, from the model you operate.',
    text: 'CSRD, EU Taxonomy and CER Directive evidence comes out of the same model your teams use every day, with the data behind every number.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  metrics: [
    { value: '95%', text: 'less time producing climate and compliance reports' },
    { value: 'To 2100', text: 'physical risk per asset, by scenario' },
    { value: '6', text: 'hazards on one model, compound risk included' },
  ],
  covers: {
    title: 'One model. Every framework.',
    labels: { framework: 'Framework', get: 'What you get' },
    items: [
      { framework: 'CSRD (ESRS E1)', get: 'Physical climate risk, asset by asset and by scenario.' },
      { framework: 'EU Taxonomy', get: 'Climate risk and vulnerability assessments per eligible asset.' },
      { framework: 'CER Directive', get: 'Natural-hazard risk assessments, documented.' },
      { framework: 'Resilience plans', get: 'Investment cases your regulator can follow.' },
      { framework: 'Lenders and insurers', get: 'Exposure data for due diligence and cover.' },
    ],
  },
  why: {
    title: 'Not a separate reporting exercise.',
    text: 'Most climate reports are built once a year, by hand, apart from the data teams use every day. With Predicterra, the report comes from the model your operations run on. The numbers your teams act on are the numbers you report.',
    items: [
      { icon: 'link', title: 'Traceable', text: 'Every figure linked to its data, model version and assumptions.' },
      { icon: 'verified_user', title: 'Consistent', text: 'The same assets and scenarios, year after year.' },
      { icon: 'fact_check', title: 'Ready for audit', text: 'A full record of exposure, reasoning and response.' },
    ],
  },
  cta: cta('See your compliance evidence', 'in the', 'Cognitive Twin.'),
} as const;
