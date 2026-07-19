import {
  Factory,
  Truck,
  Warehouse,
  Heart,
  GraduationCap,
  ShoppingBag,
  Rocket,
  LineChart,
} from 'lucide-react'
import { industries } from '../data/content'
import Button from '../components/ui/Button'
import ContactCTA from '../components/home/ContactCTA'
import AnimateIn from '../components/ui/AnimateIn'
import ResponsiveImage from '../components/ui/ResponsiveImage'
import SEO from '../components/seo/SEO'
import { pageMeta } from '../utils/seo'
import { breadcrumbSchema, webPageSchema } from '../utils/structuredData'

const iconMap: Record<string, typeof Factory> = {
  factory: Factory,
  truck: Truck,
  warehouse: Warehouse,
  heart: Heart,
  graduation: GraduationCap,
  shopping: ShoppingBag,
  rocket: Rocket,
  chart: LineChart,
}

export default function IndustriesPage() {
  return (
    <>
      <SEO
        title={pageMeta.industries.title}
        description={pageMeta.industries.description}
        path="/industries"
        jsonLd={[
          webPageSchema({
            path: '/industries',
            name: pageMeta.industries.title,
            description: pageMeta.industries.description,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: '/industries' },
          ]),
        ]}
      />
      <section className="section-pad overflow-x-clip bg-white">
        <div className="site-container min-w-0">
          <AnimateIn className="page-header w-full">
            <div className="page-header__content">
              <p className="section-label mb-2">Industries</p>
              <h1 className="page-heading font-bold text-navy-900">Industries We Serve</h1>
              <p className="page-subheading section-lead">
                Deep domain expertise across sectors — we understand your challenges and build
                solutions that fit your industry&apos;s unique operational needs.
              </p>
            </div>
          </AnimateIn>

          <div className="card-grid">
            {industries.map((industry, index) => {
              const Icon = iconMap[industry.icon] ?? Factory
              return (
                <AnimateIn key={industry.id} delay={index * 60} animation="fade-up" className="h-full w-full min-w-0">
                  <article
                    id={industry.id}
                    className="service-card card-hover flex h-full w-full flex-col overflow-hidden rounded-2xl"
                  >
                    <div className="aspect-[16/9] overflow-hidden sm:aspect-[2/1]">
                      <ResponsiveImage
                        image={industry.image}
                        alt={`${industry.title} — industry solutions by Tribound Tech`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
                      <div className="mb-3 flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                          <Icon size={20} />
                        </div>
                        <h2 className="min-w-0 text-lg font-bold text-navy-900">{industry.title}</h2>
                      </div>
                      <p className="flex-1 text-sm leading-relaxed text-slate-500 line-clamp-4 sm:line-clamp-none">
                        {industry.description}
                      </p>
                      <div className="mt-5">
                        <Button href="/contact" variant="outline" className="w-full sm:w-auto">
                          Discuss Your Needs
                        </Button>
                      </div>
                    </div>
                  </article>
                </AnimateIn>
              )
            })}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  )
}
