/** Structured data (schema.org JSON-LD) shared across pages. */
import { withBase } from '../i18n/config';

export function organizationJsonLd(site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': new URL('/#organization', site).href,
    name: 'Predicterra',
    legalName: 'Predicterra SL',
    url: site.href,
    logo: new URL(withBase('/favicon.svg'), site).href,
    email: 'hello@predicterra.com',
    description:
      'Foresight infrastructure for energy. Predicterra turns satellite, weather and sensor data into asset-level foresight for energy operators.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'BAT Tower, Gran Vía 1',
      postalCode: '48001',
      addressLocality: 'Bilbao',
      addressRegion: 'Bizkaia',
      addressCountry: 'ES',
    },
    contactPoint: [
      { '@type': 'ContactPoint', telephone: '+34-900-752-605', contactType: 'sales', areaServed: 'EU' },
      { '@type': 'ContactPoint', telephone: '+1-929-323-2391', contactType: 'sales', areaServed: 'US' },
    ],
    parentOrganization: { '@type': 'Organization', name: 'Woza Labs', url: 'https://www.wozalabs.com' },
    sameAs: ['https://www.linkedin.com/company/predicterra/'],
  };
}

export function websiteJsonLd(site: URL, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': new URL('/#website', site).href,
    name: 'Predicterra',
    url: site.href,
    inLanguage: locale,
    publisher: { '@id': new URL('/#organization', site).href },
  };
}

export function softwareJsonLd(site: URL, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Predicterra',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Climate risk and asset foresight for energy infrastructure',
    operatingSystem: 'Web, Microsoft Azure',
    url: site.href,
    description,
    publisher: { '@id': new URL('/#organization', site).href },
    offers: {
      '@type': 'Offer',
      price: '50000',
      priceCurrency: 'USD',
      description: 'Annual platform license, starting price',
    },
  };
}
