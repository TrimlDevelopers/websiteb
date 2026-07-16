import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { industries } from '../../data/content'
import AnimateIn from '../ui/AnimateIn'

export default function IndustriesPreview() {
  const featured = industries.slice(0, 6)

  return (
    <section className="section-pad">
      <div className="site-container">
        <AnimateIn className="mb-8 text-center sm:mb-10">
          <p className="section-label mb-2">Industries We Serve</p>
          <h2 className="page-heading font-bold text-navy-900">
            Solutions Tailored for Every Industry
          </h2>
          <p className="section-lead section-lead--center">
            Deep domain expertise across sectors — we understand your challenges and build solutions that fit.
          </p>
        </AnimateIn>

        <div className="card-grid">
          {featured.map((industry, index) => (
            <AnimateIn key={industry.id} delay={index * 90} animation="fade-up" className="h-full min-w-0">
              <Link
                to="/industries"
                className="card-hover group relative block overflow-hidden rounded-2xl"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={industry.image}
                    alt={`${industry.title} industry software solutions by Tribound Tech`}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/40 to-transparent transition-opacity duration-300 group-hover:from-navy-900/98" />
                <div className="absolute inset-x-0 bottom-0 translate-y-1 p-5 transition-transform duration-300 group-hover:translate-y-0">
                  <h3 className="text-lg font-bold text-white">{industry.title}</h3>
                  <p className="mt-1 text-sm text-gray-300 line-clamp-2">
                    {industry.shortDescription}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-300">
                    Learn More
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
