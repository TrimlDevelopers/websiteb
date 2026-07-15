import {
  ArrowRight,
  Award,
  Clock,
  Headphones,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { whyTriML, company } from '../../data/content'
import AnimateIn from '../ui/AnimateIn'
import Button from '../ui/Button'
import WhyTriMLVisual from '../ui/WhyTriMLVisual'

const iconMap = {
  users: Users,
  sparkles: Sparkles,
  trending: TrendingUp,
  clock: Clock,
  headphones: Headphones,
  award: Award,
} as const

export default function WhyTriML() {
  return (
    <section id="about" className="section-pad scroll-mt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))]">
      <div className="site-container min-w-0">
        <div className="grid w-full items-center gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          <AnimateIn animation="fade-right" className="order-2 w-full min-w-0 lg:order-1">
            <WhyTriMLVisual />
          </AnimateIn>

          <AnimateIn animation="fade-left" delay={100} className="order-1 w-full min-w-0 lg:order-2">
            <div className="text-center lg:text-left">
              <p className="section-label mb-1.5 sm:mb-2">Why {company.name}?</p>
              <h2 className="page-heading font-bold text-navy-900">
                Your Trusted{' '}
                <span className="text-brand-500">Technology Partner</span>
              </h2>
              <p className="section-lead mt-2 sm:mt-3">
                We combine deep technical expertise with a client-first approach to deliver solutions
                that drive measurable business results.
              </p>
            </div>

            <div className="stack-grid mt-4 text-left sm:mt-5">
              {whyTriML.map((item, index) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Users
                return (
                  <AnimateIn
                    key={item.title}
                    delay={160 + index * 60}
                    animation="fade-up"
                    duration={500}
                    className="h-full w-full min-w-0"
                  >
                    <div className="info-card group h-full transition-all duration-300 hover:border-brand-500/30 hover:shadow-md hover:shadow-brand-500/5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white sm:h-9 sm:w-9">
                        <Icon size={16} className="sm:hidden" />
                        <Icon size={17} className="hidden sm:block" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug text-navy-900">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </AnimateIn>
                )
              })}
            </div>

            <div className="mt-4 sm:mt-5">
              <Button href="#contact" className="w-full sm:w-auto">
                <span className="hidden sm:inline">Let&apos;s Build Something Amazing Together</span>
                <span className="sm:hidden">Get Started Today</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
