import { Link } from 'react-router-dom'
import { services, company } from '../data/content'
import ServiceCard from '../components/services/ServiceCard'
import ContactCTA from '../components/home/ContactCTA'
import FaqSection from '../components/seo/FaqSection'
import AnimateIn from '../components/ui/AnimateIn'
import SEO from '../components/seo/SEO'
import { faqs } from '../data/faq'
import { pageMeta } from '../utils/seo'
import { breadcrumbSchema, faqSchema, webPageSchema } from '../utils/structuredData'

export default function ServicesPage() {
  const serviceFaqs = faqs.filter((f) =>
    ['website-cost', 'custom-vs-saas', 'erp-development', 'ai-automation', 'cloud-solutions'].includes(
      f.id,
    ),
  )

  return (
    <>
      <SEO
        title={pageMeta.services.title}
        description={pageMeta.services.description}
        path="/services"
        keywords={pageMeta.services.keywords}
        jsonLd={[
          webPageSchema({
            path: '/services',
            name: pageMeta.services.title,
            description: pageMeta.services.description,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
          ]),
          faqSchema(serviceFaqs),
        ]}
      />
      <section className="section-pad overflow-x-clip bg-white">
        <div className="site-container min-w-0">
          <AnimateIn className="page-header w-full">
            <div className="page-header__content">
              <p className="section-label mb-2">Services</p>
              <h1 className="page-heading font-bold text-navy-900">
                Software development services in Kolhapur
              </h1>
              <p className="page-subheading section-lead break-words">
                From custom software with AI to cloud-native automation — {company.name} delivers
                end-to-end solutions for businesses across Maharashtra and India.
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Looking for answers first? Visit our{' '}
                <Link to="/faq" className="font-semibold text-brand-600 hover:underline">
                  software development FAQ
                </Link>{' '}
                or{' '}
                <Link to="/contact" className="font-semibold text-brand-600 hover:underline">
                  request a consultation
                </Link>
                .
              </p>
            </div>
          </AnimateIn>

          <div className="card-grid">
            {services.map((service, index) => (
              <AnimateIn key={service.id} delay={index * 60} animation="fade-up" className="h-full w-full min-w-0">
                <ServiceCard service={service} />
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        items={serviceFaqs}
        title="Service questions from local businesses"
        description="Website cost, custom software vs SaaS, ERP, AI automation, and cloud — answered clearly."
      />

      <ContactCTA />
    </>
  )
}
