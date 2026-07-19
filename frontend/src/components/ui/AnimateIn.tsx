import { memo, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type AnimationType = 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-in'

interface AnimateInProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

function AnimateIn({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 650,
  className = '',
  once = true,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Start visible so prerendered HTML and crawlers always receive readable content.
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const rect = el.getBoundingClientRect()
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0
    if (inView) {
      setVisible(true)
      return
    }

    setVisible(false)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const style = {
    '--animate-delay': `${delay}ms`,
    '--animate-duration': `${duration}ms`,
  } as CSSProperties

  return (
    <div
      ref={ref}
      style={style}
      className={`animate-in animate-in--${animation} w-full min-w-0 max-w-full ${visible ? 'animate-in--visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export default memo(AnimateIn)
