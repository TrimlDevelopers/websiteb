import { useId } from 'react'
import { Link } from 'react-router-dom'
import { company } from '../../data/content'

interface LogoProps {
  light?: boolean
}

export default function Logo({ light = false }: LogoProps) {
  const gradId = useId()

  return (
    <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5" aria-label={`${company.name} home`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="36" height="36" rx="8" fill={`url(#${gradId})`} />
        <path d="M10 12h16v3h-5.75v9H15.75v-9H10z" fill="white" />
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="36" y2="36">
            <stop stopColor="#007bff" />
            <stop offset="1" stopColor="#0056b3" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className={`truncate text-sm font-bold tracking-tight sm:text-base md:text-lg ${
          light ? 'text-white' : 'text-navy-900'
        }`}
      >
        Tri<span className="text-brand-500">bound</span>{' '}
        <span
          className={`font-semibold max-[360px]:hidden ${light ? 'text-gray-300' : 'text-slate-600'}`}
        >
          Tech
        </span>
      </span>
      <span className="sr-only">{company.name}</span>
    </Link>
  )
}
