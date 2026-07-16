import { services } from '../data/content'

export const SITE_NAME = 'Tribound Tech'
export const SITE_AUTHOR = 'Tribound Tech'
export const SITE_KEYWORDS =
  'custom software development Kolhapur, website development company Maharashtra, AI solutions India, ERP development, business automation software, cloud solutions, Tribound Tech'

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

export const serviceRoutes = services.map((service) => `/services/${service.id}`)

export const allRoutes = [...staticRoutes, ...serviceRoutes]

export const defaultDescription =
  'Tribound Tech in Kolhapur builds custom software, websites, AI solutions, ERP, business automation, and cloud systems for growing businesses across India.'

export const defaultOgImage = '/og-image.png'

export const pageMeta = {
  home: {
    title: 'Custom Software Development Company in Kolhapur',
    description:
      'Tribound Tech builds custom software, AI solutions, websites, ERP, and business automation for companies in Kolhapur, Maharashtra, and across India. Free consultation.',
    keywords:
      'custom software development Kolhapur, software company Maharashtra, AI automation India, Tribound Tech',
  },
  services: {
    title: 'Software Development Services | AI, Web, ERP & Automation',
    description:
      'Explore Tribound Tech services: custom software with AI, website development, mobile apps, microservices, business automation, ERP, and data analytics.',
    keywords:
      'software development services, website development, ERP development, AI solutions, business automation',
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
    title: 'About Tribound Tech | Software Company in Kolhapur',
    description:
      'Learn about Tribound Tech — a Kolhapur software company delivering custom software, websites, AI, ERP, and cloud solutions with practical, measurable results.',
    keywords: 'about Tribound Tech, software company Kolhapur, Maharashtra IT company',
  },
  contact: {
    title: 'Contact Tribound Tech | Free Software Consultation',
    description:
      'Contact Tribound Tech in Kolhapur for custom software, website development, AI, and automation. Call +91 94048 93174 or email info@triboundtech.com.',
    keywords: 'contact Tribound Tech, software company Kolhapur contact, hire developers Maharashtra',
  },
  faq: {
    title: 'FAQ | Website Cost, Custom Software, ERP & AI',
    description:
      'Answers on website development cost, custom software vs SaaS, ERP development, AI automation, and working with Tribound Tech in Kolhapur.',
    keywords: 'website development cost India, custom software vs SaaS, ERP development FAQ',
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
