import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { gzipSync } from 'node:zlib'

/** Soft budgets for the initial payload (raw / gzip KiB). */
const BUDGETS = {
  entryJsGzipKiB: 90,
  cssGzipKiB: 25,
  totalInitialGzipKiB: 180,
}

function formatKiB(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KiB`
}

function bundleBudgetPlugin(): Plugin {
  return {
    name: 'bundle-budget',
    async writeBundle(options, bundle) {
      const outDir = options.dir
      if (!outDir) return

      let entryJsGzip = 0
      let cssGzip = 0
      let totalGzip = 0

      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk' && output.type !== 'asset') continue
        const fileName = output.fileName
        if (!fileName.endsWith('.js') && !fileName.endsWith('.css')) continue

        const source =
          output.type === 'asset'
            ? typeof output.source === 'string'
              ? Buffer.from(output.source)
              : Buffer.from(output.source)
            : Buffer.from(output.code)
        const gzip = gzipSync(source).byteLength
        totalGzip += gzip

        if (fileName.endsWith('.css')) cssGzip += gzip
        if (output.type === 'chunk' && output.isEntry) entryJsGzip += gzip
      }

      const report = [
        `Bundle budgets — entry JS gzip ${formatKiB(entryJsGzip)} (limit ${BUDGETS.entryJsGzipKiB})`,
        `CSS gzip ${formatKiB(cssGzip)} (limit ${BUDGETS.cssGzipKiB})`,
        `Emitted JS+CSS gzip ${formatKiB(totalGzip)} (soft initial limit ${BUDGETS.totalInitialGzipKiB})`,
      ].join(' | ')
      console.log(report)

      if (entryJsGzip / 1024 > BUDGETS.entryJsGzipKiB) {
        this.warn(`Entry JS gzip exceeds budget: ${formatKiB(entryJsGzip)}`)
      }
      if (cssGzip / 1024 > BUDGETS.cssGzipKiB) {
        this.warn(`CSS gzip exceeds budget: ${formatKiB(cssGzip)}`)
      }
    },
  }
}

function assertProductionApiUrl(mode: string): void {
  if (mode !== 'production') return
  const apiUrl = process.env.VITE_API_URL?.trim()
  // Allow local verification builds with an explicit empty opt-out.
  if (process.env.ALLOW_EMPTY_API_URL === '1') return
  if (!apiUrl) {
    throw new Error(
      'VITE_API_URL is required for production builds. Set it in the environment (Render dashboard) or ALLOW_EMPTY_API_URL=1 for local dry-runs.',
    )
  }
}

export default defineConfig(({ mode }) => {
  assertProductionApiUrl(mode)

  return {
    plugins: [react(), tailwindcss(), bundleBudgetPlugin()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      sourcemap: false,
      modulePreload: {
        polyfill: false,
      },
      rollupOptions: {
        output: {
          // Keep React isolated; let Lucide/router split naturally per route.
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor'
            }
          },
        },
      },
    },
  }
})
