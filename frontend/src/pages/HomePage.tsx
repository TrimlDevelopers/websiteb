import Hero from '../components/home/Hero'
import ServicesOverview from '../components/home/ServicesOverview'
import LocalExpertise from '../components/home/LocalExpertise'
import IndustriesPreview from '../components/home/IndustriesPreview'
import RecentProjects from '../components/home/RecentProjects'
import WhyTriML from '../components/home/WhyTriML'
import DevelopmentProcess from '../components/home/DevelopmentProcess'
import ContactCTA from '../components/home/ContactCTA'
import SEO from '../components/seo/SEO'
import { pageMeta } from '../utils/seo'
import { homeJsonLd } from '../utils/structuredData'

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
      <LocalExpertise />
      <IndustriesPreview />
      <RecentProjects />
      <WhyTriML />
      <DevelopmentProcess />
      <ContactCTA />
    </>
  )
}
