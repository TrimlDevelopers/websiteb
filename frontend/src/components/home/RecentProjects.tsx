import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { projects } from '../../data/content'
import AnimateIn from '../ui/AnimateIn'

export default function RecentProjects() {
  return (
    <section id="projects" className="section-pad bg-surface-light">
      <div className="site-container min-w-0">
        <AnimateIn className="page-header w-full">
          <div className="page-header__content">
            <p className="section-label mb-2">Portfolio</p>
            <h2 className="page-heading font-bold text-navy-900">Our Recent Projects</h2>
          </div>
          <Link
            to="/#projects"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600"
          >
            View All Projects
            <ArrowRight size={16} />
          </Link>
        </AnimateIn>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <AnimateIn key={project.id} delay={index * 100} animation="scale-in" className="w-full min-w-0">
              <div className="service-card card-hover w-full overflow-hidden rounded-2xl">
                <div
                  className={`flex h-36 items-center justify-center bg-gradient-to-br ${project.color} p-4`}
                >
                  <div className="w-full rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur">
                    <div className="mb-2 flex gap-1">
                      <div className="h-1.5 w-8 rounded bg-white/40" />
                      <div className="h-1.5 w-5 rounded bg-white/20" />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="h-8 rounded bg-white/15" />
                      <div className="h-8 rounded bg-white/15" />
                      <div className="h-8 rounded bg-white/15" />
                    </div>
                    <div className="mt-2 h-6 rounded bg-white/10" />
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-navy-900">{project.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
