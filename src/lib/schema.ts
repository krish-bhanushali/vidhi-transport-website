import { site } from '../config/site';
import { abs } from './url';
import type { Branch, Service, Article } from './data';

export const ORG_ID = site.url + '/#organization';
export const SITE_ID = site.url + '/#website';

export function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.legalName,
    alternateName: site.name,
    url: site.url + '/',
    logo: abs('/assets/images/vidhi-transport-logo.png'),
    telephone: '+919825321589',
    email: site.email,
    description: 'Industrial road logistics company providing FTL, PTL and specialised freight services across Gujarat and Maharashtra.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.headOffice.street,
      addressLocality: site.headOffice.locality,
      addressRegion: site.headOffice.region,
      postalCode: site.headOffice.postalCode,
      addressCountry: 'IN',
    },
    areaServed: [{ '@type': 'State', name: 'Gujarat' }, { '@type': 'State', name: 'Maharashtra' }],
    sameAs: site.social.map((s) => s.href),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+919825321589',
      email: site.email,
      areaServed: 'IN',
      availableLanguage: ['en'],
      hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '08:00', closes: '22:00' },
    },
  };
}

export function website() {
  return { '@type': 'WebSite', '@id': SITE_ID, url: site.url + '/', name: site.legalName, publisher: { '@id': ORG_ID }, inLanguage: 'en-IN' };
}

export function webPage(path: string, name: string, description: string, type = 'WebPage') {
  return { '@type': type, '@id': abs(path) + '#webpage', url: abs(path), name, description, isPartOf: { '@id': SITE_ID }, about: { '@id': ORG_ID }, inLanguage: 'en-IN' };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function serviceNode(s: Service) {
  return {
    '@type': 'Service',
    '@id': abs(s.path) + '#service',
    name: s.h1,
    serviceType: s.h1,
    description: s.description,
    url: abs(s.path),
    provider: { '@id': ORG_ID },
    areaServed: [{ '@type': 'State', name: 'Gujarat' }, { '@type': 'State', name: 'Maharashtra' }],
  };
}

/** LocalBusiness only for branches listed (with address + phone) on the live branch locator. */
export function localBusiness(b: Branch, path: string) {
  const m = b.address.match(/(\d{6})\s*$/);
  return {
    '@type': 'LocalBusiness',
    '@id': abs(path) + '#branch',
    name: `${site.legalName} – ${b.name}`,
    parentOrganization: { '@id': ORG_ID },
    url: abs(path),
    telephone: b.phones.map((p) => p.replace(/[^\d+]/g, ''))[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.address.replace(/,?\s*(Gujarat|Maharashtra)\s*\d{6}\s*$/, ''),
      addressRegion: b.state,
      postalCode: m ? m[1] : undefined,
      addressCountry: 'IN',
    },
    hasMap: b.mapUrl,
    areaServed: b.serviceAreas.map((a) => ({ '@type': 'Place', name: a })),
  };
}

export function articleNode(a: Article) {
  return {
    '@type': 'Article',
    '@id': abs(a.path) + '#article',
    headline: a.h1,
    description: a.description,
    datePublished: a.datePublished,
    dateModified: a.datePublished,
    author: { '@type': 'Organization', name: a.author, url: site.url + '/' },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: abs(a.path),
    image: abs('/assets/images/og-default.jpg'),
    inLanguage: 'en-IN',
    keywords: a.tags.join(', '),
  };
}
