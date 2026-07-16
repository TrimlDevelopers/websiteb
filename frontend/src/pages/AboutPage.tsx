import { Link } from 'react-router-dom'
import SEO from '../components/seo/SEO'
import Button from '../components/ui/Button'
import AnimateIn from '../components/ui/AnimateIn'
import ContactCTA from '../components/home/ContactCTA'
import { aboutContent } from '../data/pages'
import { company } from '../data/content'
import { pageMeta } from '../utils/seo'
import {
  breadcrumbSchema,
  organizationSchema,
  localBusinessSchema,
  webPageSchema,
} from '../utils/structuredData'

export default function AboutPage() {
  return (
    <>
      <SEO
        title={pageMeta.about.title}
        description={pageMeta.about.description}
        path="/about"
        keywords={pageMeta.about.keywords}
        jsonLd={[
          organizationSchema(),
          localBusinessSchema(),
          webPageSchema({
            path: '/about',
            name: pageMeta.about.title,
            description: pageMeta.about.description,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      <section className="section-pad overflow-x-clip bg-white">
        <div className="site-container min-w-0">
          <AnimateIn className="page-header max-w-3xl">
            <p className="section-label mb-2">{aboutContent.label}</p>
            <h1 className="page-heading font-bold text-navy-900">{aboutContent.title}</h1>
            <p className="page-subheading section-lead mt-3">{aboutContent.description}</p>
          </AnimateIn>

          <div className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            {aboutContent.story.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <p className="mt-6 text-sm font-medium text-navy-900">
            NAP: {company.name} · {company.location} · {company.phone} · {company.email}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {aboutContent.pillars.map((pillar) => (
              <AnimateIn key={pillar.title} animation="fade-up">
                <article className="h-full rounded-2xl border border-slate-200 bg-surface-light p-5">
                  <h2 className="text-lg font-bold text-navy-900">{pillar.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.text}</p>
                  <Link
                    to={pillar.href}
                    className="mt-3 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Explore {pillar.title}
                  </Link>
                </article>
              </AnimateIn>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/contact">Talk to our team</Button>
            <Button href="/services" variant="outline">
              View software services
            </Button>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  )
}
