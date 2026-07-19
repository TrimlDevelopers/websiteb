import type { ComponentType } from 'react'

export type PageModule = { default: ComponentType }

export const pageLoaders = {
  home: () => import('../pages/HomePage'),
  services: () => import('../pages/ServicesPage'),
  serviceDetail: () => import('../pages/ServiceDetailPage'),
  products: () => import('../pages/ProductsPage'),
  industries: () => import('../pages/IndustriesPage'),
  about: () => import('../pages/AboutPage'),
  contact: () => import('../pages/ContactPage'),
  faq: () => import('../pages/FaqPage'),
  privacy: () => import('../pages/PrivacyPage'),
  terms: () => import('../pages/TermsPage'),
  notFound: () => import('../pages/NotFoundPage'),
  adminLogin: () => import('../pages/AdminLoginPage'),
  adminEnquiries: () => import('../pages/AdminEnquiriesGate'),
} as const

export type PageKey = keyof typeof pageLoaders

/** Map the current URL to the page chunk that must be ready before hydration. */
export function resolveInitialPageKey(pathname: string): PageKey {
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path === '/') return 'home'
  if (path === '/services') return 'services'
  if (path.startsWith('/services/')) return 'serviceDetail'
  if (path === '/products') return 'products'
  if (path === '/industries') return 'industries'
  if (path === '/about') return 'about'
  if (path === '/contact') return 'contact'
  if (path === '/faq') return 'faq'
  if (path === '/privacy') return 'privacy'
  if (path === '/terms') return 'terms'
  if (path === '/admin/login') return 'adminLogin'
  if (path === '/admin/enquiries') return 'adminEnquiries'
  return 'notFound'
}

export async function loadInitialPage(pathname: string): Promise<{
  key: PageKey
  Component: ComponentType
}> {
  const key = resolveInitialPageKey(pathname)
  const mod = await pageLoaders[key]()
  return { key, Component: mod.default }
}
