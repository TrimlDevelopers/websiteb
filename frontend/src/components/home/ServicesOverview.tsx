import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { services } from '../../data/content'
import ServiceCard from '../services/ServiceCard'
import AnimateIn from '../ui/AnimateIn'

export default function ServicesOverview() {
  return (
    <section className="section-pad bg-surface-light">
      <div className="site-container min-w-0">
        <AnimateIn className="page-header w-full">
          <div className="page-header__content min-w-0">
            <p className="section-label mb-2">Our Core Services</p>
            <h2 className="page-heading font-bold text-navy-900">
              Software, Web, Mobile App & AI Solutions
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600"
          >
            View All Services
            <ArrowRight size={16} />
          </Link>
        </AnimateIn>

        <div className="card-grid">
          {services.map((service, index) => (
            <AnimateIn key={service.id} delay={index * 80} animation="scale-in" className="h-full w-full min-w-0">
              <ServiceCard service={service} />
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
