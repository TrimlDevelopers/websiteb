import { build } from 'vite'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const scriptsDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(scriptsDir, '..')
const distDir = resolve(rootDir, 'dist')
const ssrDir = resolve(rootDir, '.prerender')
const ssrEntry = resolve(rootDir, 'src/prerender.tsx')
const ssrBundle = resolve(ssrDir, 'prerender.mjs')

function outputPath(route) {
  if (route === '/') return resolve(distDir, 'index.html')
  return resolve(distDir, route.replace(/^\/+|\/+$/g, ''), 'index.html')
}

function stripShellSeo(template) {
  return template
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, '')
    .replace(/<meta\s+name="(?:description|author|keywords|robots|theme-color)"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="og:[^"]+"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
}

function createDocument(template, route, rendered) {
  if (!template.includes('<div id="root"></div>')) {
    throw new Error(`Missing #root placeholder while prerendering ${route}`)
  }

  const cleaned = stripShellSeo(template)
  const seoBlock = [
    `    <title>${rendered.title}</title>`,
    ...rendered.headTags.map((tag) => `    ${tag}`),
  ].join('\n')

  let documentHtml = cleaned
  if (/<meta name="viewport"[^>]*>/i.test(cleaned)) {
    documentHtml = cleaned.replace(/(<meta name="viewport"[^>]*>)/i, `$1\n${seoBlock}`)
  } else {
    documentHtml = cleaned.replace('</head>', `${seoBlock}\n  </head>`)
  }

  return documentHtml.replace(
    '<div id="root"></div>',
    `<div id="root">${rendered.html}</div>`,
  )
}

try {
  await build({
    root: rootDir,
    configFile: false,
    logLevel: 'warn',
    build: {
      ssr: ssrEntry,
      outDir: ssrDir,
      emptyOutDir: true,
      target: 'node22',
      minify: false,
      rollupOptions: {
        output: {
          entryFileNames: 'prerender.mjs',
          format: 'es',
        },
      },
    },
  })

  const { prerenderRoutes, renderRoute } = await import(
    `${pathToFileURL(ssrBundle).href}?v=${Date.now()}`
  )
  const template = await readFile(resolve(distDir, 'index.html'), 'utf8')

  for (const route of prerenderRoutes) {
    const destination = outputPath(route)
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(destination, createDocument(template, route, renderRoute(route)), 'utf8')
  }

  console.log(`Prerendered ${prerenderRoutes.length} public routes for search engines`)
} finally {
  await rm(ssrDir, { recursive: true, force: true })
}
