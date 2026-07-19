/**
 * Ensures render.yaml public rewrites cover every prerendered public route.
 * Keep in sync with frontend/src/utils/seo.ts `allRoutes` / serviceNav.ts.
 */
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptsDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptsDir, '../..')
const renderPath = resolve(repoRoot, 'render.yaml')

const required = [
  '/services',
  '/products',
  '/industries',
  '/about',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/services/custom-software',
  '/services/website-development',
  '/services/mobile-app-development',
  '/services/microservices',
  '/services/business-automation',
  '/services/data-analytics',
]

const yaml = await readFile(renderPath, 'utf8')
const missing = required.filter((route) => !yaml.includes(`source: ${route}`))

if (missing.length) {
  console.error('render.yaml is missing rewrites for:', missing.join(', '))
  process.exit(1)
}

console.log(`Verified ${required.length} public route rewrites in render.yaml`)
