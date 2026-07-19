import { serviceNavItems } from '../data/serviceNav'

export const SITE_NAME = 'Tribound Tech'
export const SITE_AUTHOR = 'Tribound Tech'
export const SITE_KEYWORDS =
  'IT company in Kolhapur, software company in Kolhapur, website development company Kolhapur, custom software development Kolhapur, mobile app development Kolhapur, AI solutions Kolhapur, ERP software Kolhapur, business automation Maharashtra, Tribound Tech'

/** Production canonical host (HTTPS, no trailing slash). */
export const DEFAULT_SITE_URL = 'https://triboundtech.com'

export function getSiteUrl(): string {
  const url = import.meta.env.VITE_SITE_URL ?? DEFAULT_SITE_URL
  return String(url).replace(/\/$/, '')
}

export const staticRoutes = [
  '/',
  '/services',
  '/products',
  '/industries',
  '/about',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
] as const

export const serviceRoutes = serviceNavItems.map((service) => `/services/${service.id}`)

export const allRoutes = [...staticRoutes, ...serviceRoutes]

export const defaultDescription =
  'Tribound Tech is an IT and software company in Kolhapur building custom software, websites, mobile apps, AI solutions, ERP, automation, and cloud systems.'

export const defaultOgImage = '/og-image.svg'

export const pageMeta = {
  home: {
    title: 'IT Company in Kolhapur | Software, Web & AI',
    description:
      'Tribound Tech is an IT company in Kolhapur offering custom software, website and mobile app development, AI solutions, ERP, automation, and cloud services.',
    keywords:
      'IT company in Kolhapur, software company in Kolhapur, web development company Kolhapur, app development Kolhapur, AI company Kolhapur, Tribound Tech',
  },
  services: {
    title: 'Software Development Services in Kolhapur',
    description:
      'Software development services in Kolhapur: custom software, websites, mobile apps, AI, ERP, cloud systems, automation, microservices, and data analytics.',
    keywords:
      'software development company Kolhapur, website development Kolhapur, mobile app development Kolhapur, ERP development, AI solutions, business automation',
  },
  products: {
    title: 'Business Software Products & Automation Solutions',
    description:
      'Ready-to-deploy platforms from Tribound Tech including TriMaint CMMS, AI Vision Analytics, and Business Automation Suite for operations teams.',
    keywords: 'CMMS software, AI vision analytics, business automation suite, Tribound Tech products',
  },
  industries: {
    title: 'Industry Software Solutions | Manufacturing to Startups',
    description:
      'Industry-focused software for manufacturing, logistics, healthcare, education, retail, finance, and startups — built by Tribound Tech in Kolhapur.',
    keywords: 'manufacturing software, logistics software, healthcare IT, retail software India',
  },
  about: {
    title: 'About Our IT Company in Kolhapur',
    description:
      'Meet Tribound Tech, an IT and software company in Kolhapur delivering custom software, websites, mobile apps, AI, ERP, automation, and cloud solutions.',
    keywords: 'about Tribound Tech, IT company in Kolhapur, software company Kolhapur, Maharashtra IT company',
  },
  contact: {
    title: 'Contact Our IT Company in Kolhapur',
    description:
      'Contact Tribound Tech in Kolhapur for custom software, website and app development, AI, ERP, and automation. Request a free software consultation.',
    keywords: 'contact IT company Kolhapur, contact Tribound Tech, software company Kolhapur contact, hire developers Maharashtra',
  },
  faq: {
    title: 'Kolhapur IT & Software Development FAQ',
    description:
      'Answers about IT services in Kolhapur, website and app development, custom software, ERP, AI automation, project cost, timelines, and support.',
    keywords: 'IT services Kolhapur, website development cost India, custom software Kolhapur, ERP development FAQ, AI automation',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'How Tribound Tech collects, uses, and protects personal information from website enquiries and clients.',
  },
  terms: {
    title: 'Terms & Conditions',
    description: 'Terms governing use of the Tribound Tech website and software services.',
  },
  notFound: {
    title: 'Page Not Found',
    description: 'The page you requested could not be found on the Tribound Tech website.',
  },
} as const

export function absoluteUrl(path: string): string {
  const base = getSiteUrl()
  if (!path || path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function pageTitle(title: string): string {
  if (title.includes(SITE_NAME)) return title
  return `${title} | ${SITE_NAME}`
}

export function truncateMeta(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trimEnd()}…`
}
