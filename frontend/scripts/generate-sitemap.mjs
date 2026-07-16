import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const siteUrl = (process.env.VITE_SITE_URL ?? 'https://triboundtech.com').replace(/\/$/, '')

const serviceIds = [
  'custom-software',
  'website-development',
  'mobile-app-development',
  'microservices',
  'business-automation',
  'data-analytics',
]

const paths = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/products', priority: '0.9', changefreq: 'monthly' },
  { path: '/industries', priority: '0.9', changefreq: 'monthly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.9', changefreq: 'monthly' },
  { path: '/faq', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  ...serviceIds.map((id) => ({
    path: `/services/${id}`,
    priority: '0.8',
    changefreq: 'monthly',
  })),
]

const today = new Date().toISOString().split('T')[0]

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${siteUrl}${path === '/' ? '/' : path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`

const publicDir = resolve(__dirname, '../public')
writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemapXml, 'utf8')
writeFileSync(resolve(publicDir, 'robots.txt'), robotsTxt, 'utf8')
console.log(`Sitemap written (${paths.length} URLs) → ${siteUrl}`)
console.log(`robots.txt written → ${siteUrl}/sitemap.xml`)
