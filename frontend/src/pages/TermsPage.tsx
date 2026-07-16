import { Link } from 'react-router-dom'
import SEO from '../components/seo/SEO'
import AnimateIn from '../components/ui/AnimateIn'
import { termsContent } from '../data/pages'
import { pageMeta } from '../utils/seo'
import { breadcrumbSchema, webPageSchema } from '../utils/structuredData'

export default function TermsPage() {
  return (
    <>
      <SEO
        title={pageMeta.terms.title}
        description={pageMeta.terms.description}
        path="/terms"
        jsonLd={[
          webPageSchema({
            path: '/terms',
            name: pageMeta.terms.title,
            description: pageMeta.terms.description,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Terms', path: '/terms' },
          ]),
        ]}
      />

      <section className="section-pad overflow-x-clip bg-white">
        <div className="site-container min-w-0 max-w-3xl">
          <AnimateIn>
            <p className="section-label mb-2">Legal</p>
            <h1 className="page-heading font-bold text-navy-900">{termsContent.title}</h1>
            <p className="mt-2 text-sm text-slate-500">Last updated: {termsContent.updated}</p>
          </AnimateIn>

          <div className="mt-8 space-y-6">
            {termsContent.sections.map((section) => (
              <article key={section.heading}>
                <h2 className="text-lg font-bold text-navy-900">{section.heading}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {section.body}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-10 text-sm text-slate-500">
            Read our{' '}
            <Link to="/privacy" className="font-semibold text-brand-600 hover:underline">
              Privacy Policy
            </Link>{' '}
            or{' '}
            <Link to="/contact" className="font-semibold text-brand-600 hover:underline">
              contact Tribound Tech
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
