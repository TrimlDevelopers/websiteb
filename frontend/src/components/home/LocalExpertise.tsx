import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import AnimateIn from '../ui/AnimateIn'

const localServices = [
  {
    title: 'Custom Software Development',
    description: 'Secure business applications, ERP modules, APIs, and cloud systems built around your workflow.',
    href: '/services/custom-software',
  },
  {
    title: 'Website Development',
    description: 'Fast, responsive, SEO-friendly business websites designed to build trust and generate enquiries.',
    href: '/services/website-development',
  },
  {
    title: 'Mobile App Development',
    description: 'Native and cross-platform applications for customers, field teams, and internal operations.',
    href: '/services/mobile-app-development',
  },
  {
    title: 'AI & Business Automation',
    description: 'Practical AI, ERP integrations, dashboards, and workflow automation that reduce repetitive work.',
    href: '/services/business-automation',
  },
] as const

export default function LocalExpertise() {
  return (
    <section className="section-pad border-y border-slate-200 bg-white">
      <div className="site-container min-w-0">
        <AnimateIn className="mx-auto max-w-3xl text-center">
          <p className="section-label mb-2 inline-flex items-center gap-1.5">
            <MapPin size={14} aria-hidden />
            Based in Kolhapur, serving India
          </p>
          <h2 className="page-heading font-bold text-navy-900">
            IT Services and Software Development in Kolhapur
          </h2>
          <p className="section-lead section-lead--center">
            Tribound Tech is a Kolhapur software company helping manufacturers, service businesses,
            and startups plan, build, and support reliable digital products.
          </p>
        </AnimateIn>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:mt-9">
          {localServices.map((service, index) => (
            <AnimateIn
              key={service.href}
              animation="fade-up"
              delay={index * 60}
              className="h-full min-w-0"
            >
              <article className="h-full rounded-2xl border border-slate-200 bg-surface-light p-5 sm:p-6">
                <h3 className="text-lg font-bold text-navy-900">{service.title} in Kolhapur</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
                <Link
                  to={service.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Explore this service
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
