import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface FooterAccordionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function FooterAccordion({
  title,
  children,
  defaultOpen = false,
}: FooterAccordionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-white/10 md:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left md:hidden"
        aria-expanded={open}
      >
        <span className="text-sm font-bold uppercase tracking-wider text-white">{title}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <h3 className="mb-4 hidden text-sm font-bold uppercase tracking-wider text-white md:block">
        {title}
      </h3>
      <div className={`${open ? 'block pb-5' : 'hidden'} md:block md:pb-0`}>{children}</div>
    </div>
  )
}
