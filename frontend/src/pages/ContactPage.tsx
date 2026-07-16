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

      <section className="section-pad overflow-x-clip border-b border-slate-200 bg-white">
        <div className="site-container min-w-0">
          <AnimateIn className="page-header max-w-3xl">
            <p className="section-label mb-2">Contact</p>
            <h1 className="page-heading font-bold text-navy-900">
              Contact Tribound Tech in Kolhapur
            </h1>
            <p className="page-subheading section-lead mt-3">
              Request a free consultation for custom software, website development, AI solutions,
              ERP, or business automation. We respond quickly with next steps.
            </p>
          </AnimateIn>

          <address className="mt-8 not-italic">
            <ul className="space-y-2 text-sm text-slate-700 sm:text-base">
              <li>
                <span className="font-semibold text-navy-900">Company:</span> {company.name}
              </li>
              <li>
                <span className="font-semibold text-navy-900">Address:</span> {company.location}
              </li>
              <li>
                <span className="font-semibold text-navy-900">Phone:</span>{' '}
                <a className="text-brand-600 hover:underline" href={`tel:${company.phone.replace(/\s/g, '')}`}>
                  {company.phone}
                </a>
              </li>
              <li>
                <span className="font-semibold text-navy-900">Email:</span>{' '}
                <a className="text-brand-600 hover:underline" href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              </li>
              <li>
                <span className="font-semibold text-navy-900">Website:</span> https://{company.website}
              </li>
            </ul>
          </address>
        </div>
      </section>

      <ContactCTA />
    </>
  )
}
