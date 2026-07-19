import type { ImgHTMLAttributes } from 'react'

export const IMAGE_WIDTHS = [320, 480, 640, 960] as const

export interface ResponsiveImageAsset {
  /** Path prefix without extension, e.g. `/images/industries/manufacturing` */
  base: string
  width: number
  height: number
}

function srcSet(base: string, ext: 'avif' | 'webp'): string {
  return IMAGE_WIDTHS.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ')
}

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> {
  image: ResponsiveImageAsset
  alt: string
  sizes: string
  className?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'auto' | 'sync'
  fetchPriority?: 'high' | 'low' | 'auto'
}

/** Local AVIF/WebP picture with explicit dimensions for CLS-safe responsive images. */
export default function ResponsiveImage({
  image,
  alt,
  sizes,
  className,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  ...rest
}: ResponsiveImageProps) {
  const fallbackSrc = `${image.base}-640.webp`

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(image.base, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(image.base, 'webp')} sizes={sizes} />
      <img
        src={fallbackSrc}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className={className}
        loading={loading}
        decoding={decoding}
        {...(fetchPriority ? { fetchPriority } : {})}
        {...rest}
      />
    </picture>
  )
}
