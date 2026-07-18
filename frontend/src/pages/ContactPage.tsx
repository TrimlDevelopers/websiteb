import SEO from '../components/seo/SEO'
import ContactCTA from '../components/home/ContactCTA'
import AnimateIn from '../components/ui/AnimateIn'
import { company } from '../data/content'
import { pageMeta } from '../utils/seo'
import {
  breadcrumbSchema,
  contactPageSchema,
  localBusinessSchema,
  organizationSchema,
  webPageSchema,
} from '../utils/structuredData'

export default function ContactPage() {
  return (
    <>
      <SEO
        title={pageMeta.contact.title}
        description={pageMeta.contact.description}
        path="/contact"
        keywords={pageMeta.contact.keywords}
        jsonLd={[
          contactPageSchema(),
          organizationSchema(),
          localBusinessSchema(),
          webPageSchema({
            path: '/contact',
            name: pageMeta.contact.title,
            description: pageMeta.contact.description,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />

      <section className="overflow-x-clip border-b border-slate-200 bg-white py-8 sm:py-10 lg:py-12">
        <div className="site-container min-w-0">
          <AnimateIn className="page-header mb-0 w-full">
            <div className="page-header__content">
              <p className="section-label mb-2">Contact</p>
              <h1 className="page-heading font-bold text-navy-900">
                Contact Tribound Tech in Kolhapur
              </h1>
              <p className="page-subheading section-lead">
                Request a free consultation for custom software, website development, AI solutions,
                ERP, or business automation. We respond quickly with next steps.
              </p>
              <p className="mt-4 text-sm text-slate-500">
                {company.name} · {company.location} ·{' '}
                <a
                  className="font-medium text-brand-600 hover:underline"
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                >
                  {company.phone}
                </a>{' '}
                ·{' '}
                <a
                  className="font-medium text-brand-600 hover:underline"
                  href={`mailto:${company.email}`}
                >
                  {company.email}
                </a>
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      <ContactCTA variant="page" />
    </>
  )
}
