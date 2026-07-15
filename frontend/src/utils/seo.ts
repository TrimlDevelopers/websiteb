import { services } from '../data/content'

export const SITE_NAME = 'Tribound Tech'

export const DEFAULT_SITE_URL = 'https://www.triboundtech.com'

export function getSiteUrl(): string {
  const url = import.meta.env.VITE_SITE_URL ?? DEFAULT_SITE_URL
  return url.replace(/\/$/, '')
}

export const staticRoutes = ['/', '/services', '/products', '/industries'] as const

export const serviceRoutes = services.map((service) => `/services/${service.id}`)

export const allRoutes = [...staticRoutes, ...serviceRoutes]

export const defaultDescription =
  'Tribound Tech builds custom software with AI, microservices, and cloud-native applications. Automate operations, reduce downtime, and drive growth.'

export const defaultOgImage = '/og-image.svg'

export function absoluteUrl(path: string): string {
  const base = getSiteUrl()
  if (!path || path === '/') return base
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function pageTitle(title: string): string {
  if (title.includes(SITE_NAME)) return title
  return `${title} | ${SITE_NAME}`
}
