import type { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  id?: string
  className?: string
  containerClassName?: string
  bordered?: boolean
  muted?: boolean
}

export default function Section({
  children,
  id,
  className = '',
  containerClassName = '',
  bordered = false,
  muted = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-16 sm:py-20 lg:py-24 ${
        bordered ? 'border-y border-white/5' : ''
      } ${muted ? 'bg-surface-900/50' : ''} ${className}`}
    >
      <div
        className={`mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 ${containerClassName}`}
      >
        {children}
      </div>
    </section>
  )
}
