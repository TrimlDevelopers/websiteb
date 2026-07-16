import { ArrowRight, Play, Brain, Layers, Cloud } from 'lucide-react'
import { company, heroFeatures } from '../../data/content'
import Button from '../ui/Button'
import DashboardMockup from '../ui/DashboardMockup'

const featureIcons = { brain: Brain, layers: Layers, cloud: Cloud }

export default function Hero() {
  return (
    <section className="hero-pattern overflow-hidden">
      <div className="site-container grid items-center gap-6 py-8 sm:gap-8 sm:py-12 lg:grid-cols-2 lg:gap-10 lg:py-16 xl:gap-12 xl:py-20">
        <div className="min-w-0 text-center lg:text-left">
          <span className="hero-enter hero-enter-1 inline-flex items-center rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-brand-600 sm:px-4 sm:py-1.5 sm:text-xs">
            {company.heroBadge}
          </span>

          <h1 className="hero-enter hero-enter-2 mt-4 text-balance text-xl font-bold leading-[1.15] tracking-tight text-navy-900 sm:mt-5 sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem]">
            {company.heroTitle}{' '}
            <span className="text-brand-500">{company.heroTitleAccent}</span>
          </h1>

          <p className="hero-enter hero-enter-3 mt-4 text-sm leading-relaxed text-slate-600 sm:mt-5 sm:text-base lg:max-w-xl lg:text-lg xl:max-w-2xl">
            {company.heroSubtitle}
          </p>

          <div className="hero-enter hero-enter-4 mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-stretch">
            <Button href="#contact" className="btn-pulse w-full sm:w-auto">
              Schedule Consultation
              <ArrowRight size={16} />
            </Button>
            <Button href="/products" variant="outline" className="w-full sm:w-auto">
              <Play size={14} fill="currentColor" />
              Explore Solutions
            </Button>
          </div>

          <div className="hero-enter hero-enter-5 mt-6 grid grid-cols-1 gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3">
            {heroFeatures.map((f) => {
              const Icon = featureIcons[f.icon as keyof typeof featureIcons] ?? Brain
              return (
                <div key={f.label} className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{f.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="hero-dashboard-enter flex min-w-0 w-full items-center justify-center lg:justify-end">
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}
