/**
 * Download Unsplash sources + Inter font, then emit responsive AVIF/WebP variants.
 * Run: node scripts/optimize-assets.mjs
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const scriptsDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(scriptsDir, '..')
const publicDir = resolve(rootDir, 'public')
const imagesDir = resolve(publicDir, 'images', 'industries')
const fontsDir = resolve(publicDir, 'fonts')
const widths = [320, 480, 640, 960]

const industries = [
  {
    id: 'manufacturing',
    url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'logistics',
    url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'warehousing',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'healthcare',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'education',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'retail',
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'startups',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'finance',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
  },
]

/** Latin Inter variable font (Fontsource). */
const INTER_URL =
  'https://cdn.jsdelivr.net/npm/@fontsource-variable/inter@5.2.5/files/inter-latin-wght-normal.woff2'

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function download(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function optimizeIndustry({ id, url }) {
  const sourcePath = resolve(imagesDir, `${id}-source.jpg`)
  let buffer
  if (await exists(sourcePath)) {
    buffer = await (await import('node:fs/promises')).readFile(sourcePath)
  } else {
    console.log(`Downloading ${id}…`)
    buffer = await download(url)
    await writeFile(sourcePath, buffer)
  }

  for (const width of widths) {
    const isHeavy = id === 'warehousing'
    const pipeline = sharp(buffer).resize({ width, withoutEnlargement: true })
    await pipeline
      .clone()
      .webp({ quality: isHeavy ? 55 : 62, effort: 6 })
      .toFile(resolve(imagesDir, `${id}-${width}.webp`))
    await pipeline
      .clone()
      .avif({ quality: isHeavy ? 42 : 50, effort: 5 })
      .toFile(resolve(imagesDir, `${id}-${width}.avif`))
  }
  console.log(`Optimized ${id}`)
}

async function optimizeFont() {
  const dest = resolve(fontsDir, 'inter-latin-var.woff2')
  if (await exists(dest)) {
    console.log('Inter font already present')
    return
  }
  console.log('Downloading Inter…')
  const candidates = [
    INTER_URL,
    'https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@5.2.5/latin-wght-normal.woff2',
  ]
  let lastError
  for (const url of candidates) {
    try {
      const buf = await download(url)
      await writeFile(dest, buf)
      console.log(`Saved Inter from ${url}`)
      return
    } catch (err) {
      lastError = err
    }
  }
  throw lastError
}

await mkdir(imagesDir, { recursive: true })
await mkdir(fontsDir, { recursive: true })
await optimizeFont()
for (const industry of industries) {
  await optimizeIndustry(industry)
}
console.log('Asset optimization complete')
