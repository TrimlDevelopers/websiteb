import { services, company } from '../data/content'
import ServiceCard from '../components/services/ServiceCard'
import ContactCTA from '../components/home/ContactCTA'
import AnimateIn from '../components/ui/AnimateIn'
import SEO from '../components/seo/SEO'
import { pageMeta } from '../utils/seo'
import { breadcrumbSchema, webPageSchema } from '../utils/structuredData'

export default function ServicesPage() {
  return (
    <>
      <SEO
        title={pageMeta.services.title}
        description={pageMeta.services.description}
        path="/services"
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
        ]}
      />
      <section className="section-pad overflow-x-clip bg-white">
        <div className="site-container min-w-0">
          <AnimateIn className="page-header w-full">
            <div className="page-header__content">
              <p className="section-label mb-2">Services</p>
              <h1 className="page-heading font-bold text-navy-900">
                Comprehensive Software Services
              </h1>
              <p className="page-subheading section-lead break-words">
                From custom software with AI to cloud-native automation — {company.name} delivers
                end-to-end solutions tailored to your business needs.
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

      <ContactCTA />
    </>
  )
}
