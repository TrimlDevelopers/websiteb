import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { services } from '../../data/content'
import { getServiceIcon } from '../../utils/serviceIcons'

type Service = (typeof services)[number]

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = getServiceIcon(service.icon)

  return (
    <Link
      to={`/services/${service.id}`}
      className="service-card card-hover group flex h-full w-full min-w-0 max-w-full flex-col rounded-2xl p-4 sm:p-6 lg:p-7"
    >
      <div className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12">
        <Icon size={22} />
      </div>
      <h3 className="break-words text-base font-bold leading-snug text-navy-900 transition-colors group-hover:text-brand-600 sm:text-lg">
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 sm:line-clamp-3">
        {service.shortDescription}
      </p>
      <span className="mt-4 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-brand-500 transition-all group-hover:gap-2 sm:min-h-11">
        Know More
        <ArrowRight size={14} />
      </span>
    </Link>
  )
}
