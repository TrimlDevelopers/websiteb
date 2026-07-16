import { services } from '../data/content'

export const SITE_NAME = 'Tribound Tech'
export const SITE_AUTHOR = 'Tribound Tech'
export const SITE_KEYWORDS =
  'Tribound Tech, custom software development, AI solutions, website development, business automation, ERP development, cloud solutions, microservices, Kolhapur software company, India'

/** Production canonical host (HTTPS, no trailing slash). */
export const DEFAULT_SITE_URL = 'https://triboundtech.com'

export function getSiteUrl(): string {
  const url = import.meta.env.VITE_SITE_URL ?? DEFAULT_SITE_URL
  return String(url).replace(/\/$/, '')
}

export const staticRoutes = ['/', '/services', '/products', '/industries'] as const

export const serviceRoutes = services.map((service) => `/services/${service.id}`)

export const allRoutes = [...staticRoutes, ...serviceRoutes]

export const defaultDescription =
  'Tribound Tech builds custom software, AI solutions, websites, business automation, ERP, and cloud systems that help organizations streamline operations and grow.'

/** Prefer raster OG image for social platforms; SVG kept as fallback asset. */
export const defaultOgImage = '/og-image.png'

export const pageMeta = {
  home: {
    title: 'Custom Software, AI & Automation Company',
    description:
      'Tribound Tech builds custom software with AI, website development, business automation, ERP, and cloud solutions for modern businesses in India and beyond.',
  },
  services: {
    title: 'Software Development Services',
    description:
      'Explore Tribound Tech services: custom software with AI, website development, mobile apps, microservices, business automation, and data analytics.',
  },
  products: {
    title: 'Software Products & Business Solutions',
    description:
      'Ready-to-deploy platforms from Tribound Tech including TriMaint CMMS, AI Vision Analytics, and Business Automation Suite for operations teams.',
  },
  industries: {
    title: 'Industries We Serve',
    description:
      'Industry-focused software for manufacturing, logistics, healthcare, education, retail, finance, and startups — built by Tribound Tech.',
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
