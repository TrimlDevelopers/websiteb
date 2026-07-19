import { company, services, socialLinks } from '../data/content'
import { absoluteUrl, defaultDescription, getSiteUrl, SITE_NAME } from './seo'

const areasServed = [
  { '@type': 'City', name: 'Kolhapur' },
  { '@type': 'State', name: 'Maharashtra' },
  { '@type': 'Country', name: 'India' },
]

const sameAs = socialLinks
  .map((link) => link.href)
  .filter((href) => href.startsWith('http') && !href.includes('linkedin.com/') && href !== 'https://linkedin.com' && href !== 'https://twitter.com' && href !== 'https://github.com' && href !== 'https://youtube.com')

/** Prefer real profiles when available; otherwise omit placeholder generic roots. */
function resolvedSameAs(): string[] {
  if (sameAs.length > 0) return sameAs
  return []
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Corporation'],
    name: SITE_NAME,
    alternateName: 'Tribound Tech Kolhapur',
    legalName: SITE_NAME,
    url: getSiteUrl(),
    logo: absoluteUrl('/favicon.svg'),
    image: absoluteUrl('/og-image.png'),
    description: company.footerDescription,
    email: company.email,
    telephone: company.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kolhapur',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: company.phone,
      contactType: 'customer service',
      email: company.email,
      areaServed: 'IN',
      availableLanguage: ['English'],
    },
    sameAs: resolvedSameAs(),
    knowsAbout: [
      'Custom Software Development',
      'Website Development',
      'Mobile App Development',
      'AI Solutions',
      'Business Automation',
      'ERP Development',
      'Cloud Solutions',
      'Data Analytics',
    ],
  }
}

export function softwareCompanySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: getSiteUrl(),
    description: defaultDescription,
    image: absoluteUrl('/og-image.png'),
    telephone: company.phone,
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kolhapur',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    areaServed: areasServed,
    serviceType: services.map((s) => s.title),
  }
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${getSiteUrl()}/#localbusiness`,
    name: SITE_NAME,
    url: getSiteUrl(),
    image: absoluteUrl('/og-image.png'),
    description: company.positioning,
    telephone: company.phone,
    email: company.email,
    areaServed: areasServed,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kolhapur',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${getSiteUrl()}/#website`,
    name: SITE_NAME,
    url: getSiteUrl(),
    description: company.positioning,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    inLanguage: 'en-IN',
  }
}

export function webPageSchema(options: {
  path: string
  name: string
  description: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': absoluteUrl(options.path),
    url: absoluteUrl(options.path),
    name: options.name,
    description: options.description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${getSiteUrl()}/#website`,
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    about: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    inLanguage: 'en-IN',
  }
}

export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': absoluteUrl('/contact'),
    url: absoluteUrl('/contact'),
    name: `Contact ${SITE_NAME}`,
    description: `Contact ${SITE_NAME} in Kolhapur for custom software, AI, automation, ERP, and cloud solutions.`,
    mainEntity: {
      '@type': 'Organization',
      name: SITE_NAME,
      email: company.email,
      telephone: company.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kolhapur',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: company.phone,
        contactType: 'sales',
        email: company.email,
        areaServed: 'IN',
        availableLanguage: ['English'],
      },
    },
  }
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function serviceSchema(service: {
  title: string
  shortDescription: string
  description: string
  id: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    areaServed: areasServed,
    url: absoluteUrl(`/services/${service.id}`),
    serviceType: service.shortDescription,
  }
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function homeJsonLd() {
  return [
    organizationSchema(),
    softwareCompanySchema(),
    localBusinessSchema(),
    websiteSchema(),
    webPageSchema({
      path: '/',
      name: 'IT Company in Kolhapur | Software, Web & AI',
      description: defaultDescription,
    }),
  ]
}
