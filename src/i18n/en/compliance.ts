import type { SolutionCopy } from '../../sections/pages/types';
import { actions, cta, proof } from './pages-shared';
import { routes } from '../../data/routes';

// /compliance, from "predicterra-10-compliance.md". Final copy; section eyebrows
// left out. Pending: backing for the 95%, the current CSRD and Taxonomy scope,
// and a report design can show.
export default {
  seo: {
    title: 'CSRD, EU Taxonomy and CER Compliance for Energy Assets | Predicterra',
    description:
      'Audit-ready CSRD, EU Taxonomy and CER reporting from the same model your teams operate, with every figure traced to its data.',
  },
  hero: {
    label: 'Compliance · Across all sectors',
    title: 'Prove it, from the model you operate.',
    text: 'CSRD, EU Taxonomy and CER Directive reports come out of the same model your control center uses, with the evidence behind every number.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  proof: proof.standard,
  metrics: [
    { value: '95%', text: 'less time producing climate and compliance reports' },
    { value: 'To 2100', text: 'physical risk per asset, by scenario' },
    { value: '6', text: 'hazards on one model, compound risk included' },
  ],
  solution: {
    title: 'Evidence for every framework, from the same assets, hazards and scenarios.',
    table: {
      head: ['Framework', 'What you get'],
      rows: [
        ['CSRD (ESRS E1)', 'Physical climate risk, asset by asset.'],
        ['EU Taxonomy', 'Climate risk and vulnerability assessments per eligible asset, over its whole life.'],
        [
          'CER Directive',
          'All-hazards risk assessments, due within nine months of being notified as a critical entity and every four years after.',
        ],
        ['Resilience plans', 'Investment cases regulators can follow.'],
      ],
    },
  },
  list: {
    title: 'The same evidence for every sector.',
    kind: 'sectors',
    items: [
      { title: 'Grid', text: 'Quality of supply (TIEPI, NIEPI), CER and resilience plans.', href: routes.sectors.grid },
      { title: 'Solar', text: 'EU Taxonomy for financing, plant by plant.', href: routes.sectors.solar },
      { title: 'Wind', text: 'CSRD and lender due diligence, site by site.', href: routes.sectors.wind },
      { title: 'Oil & Gas', text: 'CSRD, CER and natural-hazard inputs for safety reports.', href: routes.sectors.oilGas },
    ],
  },
  cta: cta('See your compliance evidence', 'in the', 'Cognitive Twin.'),
} satisfies SolutionCopy;
