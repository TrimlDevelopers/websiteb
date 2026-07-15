import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const siteUrl = (process.env.VITE_SITE_URL ?? 'https://www.triboundtech.com').replace(/\/$/, '')

const serviceIds = [
  'custom-software',
  'website-development',
  'mobile-app-development',
  'microservices',
  'business-automation',
  'data-analytics',
]

const paths = ['/', '/services', '/products', '/industries', ...serviceIds.map((id) => `/services/${id}`)]

const today = new Date().toISOString().split('T')[0]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path) => `  <url>
    <loc>${siteUrl}${path === '/' ? '' : path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '/' ? '1.0' : path.startsWith('/services/') ? '0.8' : '0.9'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const outputPath = resolve(__dirname, '../public/sitemap.xml')
writeFileSync(outputPath, xml, 'utf8')
console.log(`Sitemap written to ${outputPath} (${paths.length} URLs)`)
