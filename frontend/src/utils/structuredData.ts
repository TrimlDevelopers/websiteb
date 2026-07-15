import { company } from '../data/content'
import { absoluteUrl, getSiteUrl } from './seo'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: getSiteUrl(),
    logo: absoluteUrl('/favicon.svg'),
    description: company.footerDescription,
    email: company.email,
    telephone: company.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kolhapur',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    sameAs: [],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: company.name,
    url: getSiteUrl(),
    description: company.positioning,
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
      name: company.name,
      url: getSiteUrl(),
    },
    areaServed: 'IN',
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
