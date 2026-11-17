// Legal notice, Privacy policy and Cookie policy, from briefs 13–15. They are
// templates: the bracketed fields stay visible until they are filled in and
// validated with legal counsel (the pages are not indexed meanwhile).

export interface LegalBlock {
  title: string;
  paragraphs?: string[];
  /** Key–value rows (legal notice: website owner). */
  facts?: { label: string; value: string }[];
  /** A table with a header row. */
  table?: { head: string[]; rows: string[][] };
}

export interface LegalDoc {
  seo: { title: string; description: string };
  title: string;
  blocks: LegalBlock[];
  updated: string;
}

const legal: LegalDoc = {
  seo: {
    title: 'Legal notice | Predicterra',
    description: 'Legal notice of the Predicterra website: owner, terms of use, intellectual property and applicable law.',
  },
  title: 'Legal notice',
  blocks: [
    {
      title: 'Website owner',
      facts: [
        { label: 'Company', value: 'Predicterra SL' },
        { label: 'Tax ID (NIF)', value: '[NIF]' },
        { label: 'Registered office', value: '[Registered office address]' },
        { label: 'Email', value: 'hello@predicterra.com' },
        { label: 'Registration', value: 'Commercial Registry of [province], [volume, folio, sheet and entry]' },
      ],
    },
    {
      title: 'Use of this website',
      paragraphs: [
        'By using this website, you accept this legal notice. The content is for information only and may change without notice.',
      ],
    },
    {
      title: 'Intellectual property',
      paragraphs: [
        'All content on this website, including text, images, designs, logos and software, belongs to Predicterra SL or is used with permission, and may not be reproduced without written authorization. Client and partner logos belong to their owners.',
      ],
    },
    {
      title: 'Liability',
      paragraphs: [
        'Predicterra SL works to keep this information accurate, but is not liable for errors, for interruptions of the website or for the content of third-party sites linked from it.',
      ],
    },
    {
      title: 'Applicable law',
      paragraphs: [
        'This legal notice is governed by Spanish law. Any dispute will be submitted to the courts of [Bilbao], unless the law provides otherwise.',
      ],
    },
  ],
  updated: 'Last updated: [date]',
};

const privacy: LegalDoc = {
  seo: {
    title: 'Privacy policy | Predicterra',
    description: 'How Predicterra SL collects, uses and protects your personal data, and how to exercise your rights.',
  },
  title: 'Privacy policy',
  blocks: [
    {
      title: 'Who is responsible for your data',
      paragraphs: [
        'Predicterra SL, NIF [NIF], [registered office address]. Contact: [privacy email]. [Data protection officer, if appointed: name and contact.]',
      ],
    },
    {
      title: 'What data we collect',
      paragraphs: [
        'Data you give us through the contact form or by email: name, work email, company, role, sector and your message. Website usage data, through cookies, as explained in our Cookie Policy.',
      ],
    },
    {
      title: 'Why we use it, and on what legal basis',
      table: {
        head: ['Purpose', 'Legal basis'],
        rows: [
          ['Answer your demo or information request', 'Steps taken at your request before a contract (art. 6.1.b GDPR)'],
          ['Manage our relationship with clients and partners', 'Contract and legitimate interest (art. 6.1.b and 6.1.f GDPR)'],
          [
            'Send you news about Predicterra, if you ask for it',
            'Your consent (art. 6.1.a GDPR), which you can withdraw at any time',
          ],
          ['Measure and improve this website', 'Your consent, given in the cookie banner'],
        ],
      },
    },
    {
      title: 'How long we keep it',
      paragraphs: [
        'For as long as needed to answer your request or maintain our relationship, and afterwards only for the periods the law requires. [Define each period.]',
      ],
    },
    {
      title: 'Who we share it with',
      paragraphs: [
        'Service providers that process data on our behalf, such as hosting, CRM and email: [list]. We do not sell your data. [If any provider is outside the European Economic Area, state the safeguard used, such as the European Commission’s standard contractual clauses or the EU-US Data Privacy Framework.]',
      ],
    },
    {
      title: 'Your rights',
      paragraphs: [
        'You can access, rectify or erase your data, object to or restrict its processing, ask for its portability and withdraw your consent at any time, by writing to [privacy email]. You can also file a complaint with the Spanish Data Protection Agency (www.aepd.es).',
      ],
    },
  ],
  updated: 'Last updated: [date]',
};

const cookies: LegalDoc = {
  seo: {
    title: 'Cookie policy | Predicterra',
    description: 'Which cookies the Predicterra website uses, what for, and how to accept or reject them.',
  },
  title: 'Cookie policy',
  blocks: [
    {
      title: 'What cookies are',
      paragraphs: [
        'Cookies are small files a website stores in your browser to make it work, remember your choices or measure how it’s used.',
      ],
    },
    {
      title: 'Which cookies we use',
      table: {
        head: ['Cookie', 'Provider', 'Purpose', 'Type', 'Duration'],
        rows: [
          ['[name]', 'Predicterra', 'Remember your cookie choices', 'Necessary', '[duration]'],
          ['[name]', '[analytics provider]', 'Measure how the website is used', 'Analytics', '[duration]'],
          ['[name]', '[provider]', '[purpose]', '[type]', '[duration]'],
        ],
      },
    },
    {
      title: 'How to accept or reject them',
      paragraphs: [
        'Necessary cookies are always on. All others are used only if you accept them in the cookie banner. You can change your choice at any time from Cookie settings, at the bottom of every page, or delete cookies from your browser settings.',
      ],
    },
  ],
  updated: 'Last updated: [date]',
};

export default { legal, privacy, cookies };
