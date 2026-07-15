import type { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
  className?: string
  innerClassName?: string
  as?: 'section' | 'div'
}

export default function PageShell({
  children,
  className = '',
  innerClassName = '',
  as: Tag = 'section',
}: PageShellProps) {
  return (
    <Tag className={className}>
      <div className={`site-container ${innerClassName}`}>{children}</div>
    </Tag>
  )
}
