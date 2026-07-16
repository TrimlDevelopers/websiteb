import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { services } from '../data/content'
import { getServiceIcon } from '../utils/serviceIcons'
import Button from '../components/ui/Button'
import ContactCTA from '../components/home/ContactCTA'
import AnimateIn from '../components/ui/AnimateIn'
import SEO from '../components/seo/SEO'
import NotFoundPage from './NotFoundPage'
import { breadcrumbSchema, serviceSchema, webPageSchema } from '../utils/structuredData'
import { truncateMeta } from '../utils/seo'

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const service = services.find((s) => s.id === id)

  if (!service) {
    return <NotFoundPage />
  }

  const Icon = getServiceIcon(service.icon)
  const otherServices = services.filter((s) => s.id !== service.id)
  const description = truncateMeta(service.description || service.shortDescription)

  return (
    <>
      <SEO
        title={service.title}
        description={description}
        path={`/services/${service.id}`}
        type="article"
        jsonLd={[
          serviceSchema(service),
          webPageSchema({
            path: `/services/${service.id}`,
            name: service.title,
            description,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.title, path: `/services/${service.id}` },
          ]),
        ]}
      />
      <section className="overflow-x-clip border-b border-slate-200 bg-white py-8 sm:py-10 lg:py-12">
        <div className="site-container min-w-0">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left lg:gap-8">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 sm:h-16 sm:w-16">
              <Icon size={28} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="page-heading font-bold text-navy-900">{service.heroTitle}</h1>
              <p className="page-subheading section-lead">{service.shortDescription}</p>
              <AnimateIn animation="fade-up" className="mt-5 lg:mt-6">
                <p className="text-sm leading-relaxed text-slate-600 sm:text-base lg:max-w-4xl">
                  {service.intro}
                </p>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface-light">
        <div className="site-container min-w-0">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8 xl:gap-10">
            <AnimateIn animation="fade-right" className="h-full min-w-0">
              <div className="detail-card h-full p-4 sm:p-6 lg:p-8">
                <h2 className="flex items-center gap-2.5 text-xl font-bold text-navy-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
                  Key Features
                </h2>
                <ul className="mt-6 space-y-4">
                  {service.keyFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                        <CheckCircle2 size={13} strokeWidth={2.5} />
                      </span>
                      <span className="text-sm leading-relaxed text-slate-700 sm:text-base">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-left" delay={100} className="h-full min-w-0">
              <div className="detail-cta-card detail-card flex h-full flex-col p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl font-bold text-navy-900">Ready to get started?</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Transform your operations with our {service.heroTitle} solutions. Our team will
                  tailor an approach to your goals.
                </p>
                <Button href="/#contact" className="mt-8 w-full sm:w-auto">
                  Get Started
                  <ArrowRight size={16} />
                </Button>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-slate-200 bg-white">
        <div className="site-container min-w-0">
          <AnimateIn className="mb-8 text-center sm:mb-10">
            <h2 className="page-heading font-bold text-navy-900">Capabilities &amp; Integration</h2>
            <p className="section-lead section-lead--center">
              We combine secure deployment, integrations, and reporting so you get results you can
              trust and verify.
            </p>
          </AnimateIn>

          <AnimateIn delay={80}>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:justify-start">
              {service.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-brand-500/30 hover:text-brand-600 sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      <section className="section-pad bg-surface-light">
        <div className="site-container min-w-0">
          <AnimateIn className="mb-8 text-center sm:mb-10">
            <h2 className="page-heading font-bold text-navy-900">Benefits &amp; Outcomes</h2>
            <p className="section-lead section-lead--center">
              What you can expect when you work with us.
            </p>
          </AnimateIn>

          <div className="benefits-grid">
            {service.benefits.map((benefit, index) => (
              <AnimateIn key={benefit} delay={index * 60} animation="fade-up" className="h-full min-w-0">
                <div className="detail-card flex h-full items-start gap-3 p-4 sm:p-5 lg:p-6">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/10">
                    <CheckCircle2 size={16} className="text-brand-500" />
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                    {benefit}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-slate-200 bg-white">
        <div className="site-container min-w-0">
          <AnimateIn className="mb-8 text-center sm:mb-10">
            <p className="section-label mb-2">Explore More</p>
            <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">Other Services</h2>
          </AnimateIn>

          <div className="card-grid">
            {otherServices.map((item, index) => {
              const OtherIcon = getServiceIcon(item.icon)
              return (
                <AnimateIn key={item.id} delay={index * 70} animation="fade-up" className="min-w-0">
                  <Link
                    to={`/services/${item.id}`}
                    className="group flex h-full items-center gap-3 rounded-xl border border-slate-200 bg-surface-light p-3.5 transition-all hover:border-brand-500/30 hover:bg-white hover:shadow-md sm:gap-4 sm:p-4 lg:p-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 transition-transform group-hover:scale-105">
                      <OtherIcon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-navy-900 group-hover:text-brand-600">
                        {item.navLabel}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                        {item.shortDescription}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500"
                    />
                  </Link>
                </AnimateIn>
              )
            })}
          </div>

          <div className="mt-6 text-center sm:mt-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-600"
            >
              View all services
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  )
}
