import { Suspense, lazy } from 'react'
import Hero from '../components/home/Hero'
import ServicesOverview from '../components/home/ServicesOverview'
import SEO from '../components/seo/SEO'
import { pageMeta } from '../utils/seo'
import { homeJsonLd } from '../utils/structuredData'

const IndustriesPreview = lazy(() => import('../components/home/IndustriesPreview'))
const RecentProjects = lazy(() => import('../components/home/RecentProjects'))
const WhyTriML = lazy(() => import('../components/home/WhyTriML'))
const DevelopmentProcess = lazy(() => import('../components/home/DevelopmentProcess'))
const ContactCTA = lazy(() => import('../components/home/ContactCTA'))

export default function HomePage() {
  return (
    <>
      <SEO
        title={pageMeta.home.title}
        description={pageMeta.home.description}
        path="/"
        keywords={pageMeta.home.keywords}
        jsonLd={homeJsonLd()}
      />
      <Hero />
      <ServicesOverview />
      <Suspense fallback={null}>
        <IndustriesPreview />
        <RecentProjects />
        <WhyTriML />
        <DevelopmentProcess />
        <ContactCTA />
      </Suspense>
    </>
  )
}
