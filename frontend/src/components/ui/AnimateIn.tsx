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

const ROOT_MARGIN = '0px 0px -24px 0px'
const THRESHOLD = 0.08
const OBSERVER_KEY = `${ROOT_MARGIN}::${THRESHOLD}`

type ElementCallbacks = {
  onIntersect: () => void
  onLeave?: () => void
}

const sharedObservers = new Map<string, IntersectionObserver>()
const observedElements = new WeakMap<Element, Set<ElementCallbacks>>()

function getSharedObserver(): IntersectionObserver {
  let observer = sharedObservers.get(OBSERVER_KEY)
  if (observer) return observer

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const callbacks = observedElements.get(entry.target)
        if (!callbacks) continue
        for (const cb of callbacks) {
          if (entry.isIntersecting) cb.onIntersect()
          else cb.onLeave?.()
        }
      }
    },
    { threshold: THRESHOLD, rootMargin: ROOT_MARGIN },
  )

  sharedObservers.set(OBSERVER_KEY, observer)
  return observer
}

function observeElement(el: Element, callbacks: ElementCallbacks): () => void {
  const observer = getSharedObserver()
  let set = observedElements.get(el)
  if (!set) {
    set = new Set()
    observedElements.set(el, set)
  }
  set.add(callbacks)
  observer.observe(el)

  return () => {
    set?.delete(callbacks)
    if (set && set.size === 0) {
      observer.unobserve(el)
      observedElements.delete(el)
    }
  }
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
  // Visible through SSR and hydration; IO decides whether below-fold content should animate in.
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    let settled = false
    const detach = observeElement(el, {
      onIntersect: () => {
        setVisible(true)
        settled = true
        if (once) detach()
      },
      onLeave: () => {
        if (once && settled) return
        // Initial IO callback: keep SSR-visible content if already in view;
        // only hide elements reported as out of view.
        setVisible(false)
      },
    })

    return detach
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
