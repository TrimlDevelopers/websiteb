import { Link } from 'react-router-dom'
import SEO from '../components/seo/SEO'
import FaqSection from '../components/seo/FaqSection'
import Button from '../components/ui/Button'
import AnimateIn from '../components/ui/AnimateIn'
import { faqs, faqPageIntro } from '../data/faq'
import { pageMeta } from '../utils/seo'
import { breadcrumbSchema, faqSchema, webPageSchema } from '../utils/structuredData'

export default function FaqPage() {
  return (
    <>
      <SEO
        title={pageMeta.faq.title}
        description={pageMeta.faq.description}
        path="/faq"
        keywords={pageMeta.faq.keywords}
        jsonLd={[
          faqSchema(faqs),
          webPageSchema({
            path: '/faq',
            name: pageMeta.faq.title,
            description: pageMeta.faq.description,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq' },
          ]),
        ]}
      />

      <section className="section-pad overflow-x-clip bg-white">
        <div className="site-container min-w-0">
          <AnimateIn className="page-header mx-auto max-w-3xl text-center">
            <p className="section-label mb-2">Help centre</p>
            <h1 className="page-heading font-bold text-navy-900">
              Kolhapur IT &amp; Software Development FAQs
            </h1>
            <p className="page-subheading section-lead mx-auto mt-3">{faqPageIntro}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/contact">Get a free consultation</Button>
              <Link
                to="/services"
                className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Browse services
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      <FaqSection items={faqs} title="Common questions from business owners" />
    </>
  )
}
