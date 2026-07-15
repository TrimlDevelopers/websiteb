import Hero from '../components/home/Hero'
import ServicesOverview from '../components/home/ServicesOverview'
import IndustriesPreview from '../components/home/IndustriesPreview'
import RecentProjects from '../components/home/RecentProjects'
import WhyTriML from '../components/home/WhyTriML'
import DevelopmentProcess from '../components/home/DevelopmentProcess'
import ContactCTA from '../components/home/ContactCTA'
import SEO from '../components/seo/SEO'
import { company } from '../data/content'
import { organizationSchema, websiteSchema } from '../utils/structuredData'

export default function HomePage() {
  return (
    <>
      <SEO
        title="Custom Software & AI Solutions"
        description={`${company.name} — ${company.tagline} We build custom software with AI, microservices, and automation to streamline operations and drive growth.`}
        path="/"
        jsonLd={[organizationSchema(), websiteSchema()]}
      />
      <Hero />
      <ServicesOverview />
      <IndustriesPreview />
      <RecentProjects />
      <WhyTriML />
      <DevelopmentProcess />
      <ContactCTA />
    </>
  )
}
