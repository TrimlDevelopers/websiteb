import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import PrerenderApp from './PrerenderApp'
import { BackendStatusProvider } from './context/BackendStatusContext'
import { allRoutes } from './utils/seo'

export interface RenderedRoute {
  html: string
  title: string
  headTags: string[]
}

function normalizeTag(tag: string): string {
  return tag.replace(/\s+/g, ' ').trim()
}

function extractReactHead(html: string, url: string) {
  const appStart = html.search(/<(?:div|header|main|section)\b/)
  if (appStart < 0) {
    throw new Error(`Unable to find page content while prerendering ${url}`)
  }

  const headHtml = html.slice(0, appStart)
  const bodyHtml = html.slice(appStart)
  const tags =
    headHtml
      .match(/<(title|script)\b[^>]*>[\s\S]*?<\/\1>|<(?:meta|link)\b[^>]*>/gi)
      ?.map(normalizeTag) ?? []

  const titleTag = tags.find((tag) => /^<title\b/i.test(tag))
  if (!titleTag) {
    throw new Error(`SEO title was not generated while prerendering ${url}`)
  }

  const title = titleTag.replace(/^<title[^>]*>|<\/title>$/gi, '').trim()
  const headTags = tags.filter((tag) => !/^<title\b/i.test(tag))

  return { bodyHtml, title, headTags }
}

export function renderRoute(url: string): RenderedRoute {
  const app = (
    <HelmetProvider>
      <StaticRouter location={url}>
        <BackendStatusProvider>
          <PrerenderApp />
        </BackendStatusProvider>
      </StaticRouter>
    </HelmetProvider>
  )

  const { bodyHtml, title, headTags } = extractReactHead(renderToString(app), url)
  return {
    html: bodyHtml,
    title,
    headTags,
  }
}

export const prerenderRoutes = allRoutes
