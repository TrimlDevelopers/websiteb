import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '../../data/faq'
import AnimateIn from '../ui/AnimateIn'

interface FaqSectionProps {
  items: FaqItem[]
  title?: string
  description?: string
}

export default function FaqSection({
  items,
  title = 'Frequently asked questions',
  description,
}: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <section className="section-pad bg-surface-light">
      <div className="site-container min-w-0">
        <AnimateIn className="page-header mx-auto max-w-3xl text-center">
          <p className="section-label mb-2">FAQ</p>
          <h2 className="page-heading font-bold text-navy-900">{title}</h2>
          {description ? (
            <p className="page-subheading section-lead mx-auto mt-2">{description}</p>
          ) : null}
        </AnimateIn>

        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {items.map((item) => {
            const open = openId === item.id
            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <h3 className="text-base font-semibold text-navy-900">
                  <button
                    type="button"
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
                    onClick={() => setOpenId(open ? null : item.id)}
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-brand-600 transition-transform ${open ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  className={`border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600 sm:px-5 sm:py-4 ${
                    open ? '' : 'hidden'
                  }`}
                >
                  {item.answer}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
