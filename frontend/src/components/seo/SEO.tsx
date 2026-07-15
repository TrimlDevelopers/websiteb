import { Helmet } from 'react-helmet-async'
import {
  SITE_NAME,
  absoluteUrl,
  defaultDescription,
  defaultOgImage,
  pageTitle,
} from '../../utils/seo'

interface SEOProps {
  title: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
}

export default function SEO({
  title,
  description = defaultDescription,
  path = '/',
  image = defaultOgImage,
  type = 'website',
  noindex = false,
  jsonLd,
}: SEOProps) {
  const fullTitle = pageTitle(title)
  const url = absoluteUrl(path)
  const imageUrl = image.startsWith('http') ? image : absoluteUrl(image)
  const jsonLdItems = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLdItems.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  )
}
