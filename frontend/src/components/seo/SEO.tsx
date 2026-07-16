import { Helmet } from 'react-helmet-async'
import {
  SITE_AUTHOR,
  SITE_KEYWORDS,
  SITE_NAME,
  absoluteUrl,
  defaultDescription,
  defaultOgImage,
  pageTitle,
  truncateMeta,
} from '../../utils/seo'

interface SEOProps {
  title: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  keywords?: string
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
}

export default function SEO({
  title,
  description = defaultDescription,
  path = '/',
  image = defaultOgImage,
  type = 'website',
  noindex = false,
  keywords = SITE_KEYWORDS,
  jsonLd,
}: SEOProps) {
  const fullTitle = pageTitle(title)
  const metaDescription = truncateMeta(description)
  const url = absoluteUrl(path)
  const imageUrl = image.startsWith('http') ? image : absoluteUrl(image)
  const jsonLdItems = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="author" content={SITE_AUTHOR} />
      <meta name="keywords" content={keywords} />
      <meta name="theme-color" content="#0a1628" />
      <link rel="canonical" href={url} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      )}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} — ${title}`} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} — ${title}`} />

      {jsonLdItems.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  )
}
