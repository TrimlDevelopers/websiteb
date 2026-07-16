import { Link } from 'react-router-dom'
import SEO from '../components/seo/SEO'
import { pageMeta } from '../utils/seo'

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title={pageMeta.notFound.title}
        description={pageMeta.notFound.description}
        path="/404"
        noindex
      />
      <section className="section-pad flex min-h-[50vh] items-center justify-center bg-white">
        <div className="site-container text-center">
          <p className="section-label mb-2">404</p>
          <h1 className="page-heading font-bold text-navy-900">Page not found</h1>
          <p className="section-lead section-lead--center mx-auto mt-3 max-w-lg">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Back to home
          </Link>
        </div>
      </section>
    </>
  )
}
