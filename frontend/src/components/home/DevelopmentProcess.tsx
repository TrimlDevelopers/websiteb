import {
  Search,
  Map,
  Code2,
  CheckCircle,
  Rocket,
  Headphones,
} from 'lucide-react'
import { processSteps } from '../../data/content'
import SectionHeader from '../ui/SectionHeader'
import AnimateIn from '../ui/AnimateIn'

const iconMap: Record<string, typeof Search> = {
  search: Search,
  map: Map,
  code: Code2,
  check: CheckCircle,
  rocket: Rocket,
  headphones: Headphones,
}

export default function DevelopmentProcess() {
  return (
    <section className="dark-section section-pad overflow-x-clip">
      <div className="site-container min-w-0">
        <SectionHeader
          label="Our Workflow"
          title="Our Proven Process"
          description="A structured approach from discovery to deployment that keeps you informed every step of the way."
          dark
        />

        <div className="min-w-0 overflow-hidden">
          <div className="scroll-hint flex gap-3 pb-3 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-3 xl:grid-cols-6 [&::-webkit-scrollbar]:hidden">
            {processSteps.map((step, index) => {
              const Icon = iconMap[step.icon] ?? Search
              return (
                <AnimateIn
                  key={step.step}
                  delay={index * 90}
                  animation="fade-up"
                  className="w-[min(100%,220px)] shrink-0 snap-start sm:w-auto sm:min-w-0"
                >
                  <div className="flex h-full flex-col items-center rounded-2xl border border-white/10 bg-navy-800/50 p-4 text-center transition-colors duration-300 hover:border-brand-500/30 hover:bg-navy-800/80 sm:p-5">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/25 transition-transform duration-300 hover:scale-110">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-bold text-brand-400">{step.step}</span>
                    <h3 className="mt-1 text-sm font-bold text-white">{step.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-gray-400">{step.description}</p>
                  </div>
                </AnimateIn>
              )
            })}
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-gray-500 sm:hidden">Swipe to see all steps →</p>
      </div>
    </section>
  )
}
