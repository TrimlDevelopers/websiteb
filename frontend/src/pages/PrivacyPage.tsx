import { Link } from 'react-router-dom'
import SEO from '../components/seo/SEO'
import AnimateIn from '../components/ui/AnimateIn'
import { privacyContent } from '../data/pages'
import { pageMeta } from '../utils/seo'
import { breadcrumbSchema, webPageSchema } from '../utils/structuredData'

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title={pageMeta.privacy.title}
        description={pageMeta.privacy.description}
        path="/privacy"
        jsonLd={[
          webPageSchema({
            path: '/privacy',
            name: pageMeta.privacy.title,
            description: pageMeta.privacy.description,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Privacy Policy', path: '/privacy' },
          ]),
        ]}
      />

      <section className="section-pad overflow-x-clip bg-white">
        <div className="site-container min-w-0 max-w-3xl">
          <AnimateIn>
            <p className="section-label mb-2">Legal</p>
            <h1 className="page-heading font-bold text-navy-900">{privacyContent.title}</h1>
            <p className="mt-2 text-sm text-slate-500">Last updated: {privacyContent.updated}</p>
          </AnimateIn>

          <div className="mt-8 space-y-6">
            {privacyContent.sections.map((section) => (
              <article key={section.heading}>
                <h2 className="text-lg font-bold text-navy-900">{section.heading}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {section.body}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-10 text-sm text-slate-500">
            See also our{' '}
            <Link to="/terms" className="font-semibold text-brand-600 hover:underline">
              Terms &amp; Conditions
            </Link>{' '}
            or{' '}
            <Link to="/contact" className="font-semibold text-brand-600 hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
