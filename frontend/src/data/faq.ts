/** Search-intent FAQs for Tribound Tech (Kolhapur / India software services). */
export interface FaqItem {
  id: string
  question: string
  answer: string
  category: 'pricing' | 'services' | 'process' | 'local' | 'general'
}

export const faqs: FaqItem[] = [
  {
    id: 'website-cost',
    question: 'How much does website development cost in India?',
    answer:
      'Website development cost depends on scope — a business marketing site is typically more affordable than a custom web application with logins, payments, or integrations. Tribound Tech in Kolhapur provides a free consultation with a clear estimate after understanding your goals, pages, and features. Contact us for a tailored quote.',
    category: 'pricing',
  },
  {
    id: 'custom-vs-saas',
    question: 'Custom software vs SaaS — which should my business choose?',
    answer:
      'SaaS works well for standard needs (CRM, accounting, email). Custom software is better when your workflows are unique, you need deep integrations, industry-specific logic, or long-term ownership of the product. Tribound Tech helps you evaluate build-vs-buy and can deliver custom software with AI and automation where SaaS falls short.',
    category: 'services',
  },
  {
    id: 'erp-development',
    question: 'What is ERP development and do you build ERP systems?',
    answer:
      'ERP (Enterprise Resource Planning) connects finance, inventory, operations, and reporting in one system. Tribound Tech builds custom ERP modules and integrations tailored to manufacturers, warehouses, and growing businesses — so you are not forced into rigid off-the-shelf packages that do not match how you work.',
    category: 'services',
  },
  {
    id: 'ai-automation',
    question: 'How can AI automation help my business?',
    answer:
      'AI automation can reduce manual data entry, flag anomalies, power chat assistants, improve forecasting, and speed up decision-making. We embed practical AI into custom software and workflows — not hype demos — so your team saves time and reduces errors. Discuss your processes with Tribound Tech for a realistic AI roadmap.',
    category: 'services',
  },
  {
    id: 'business-website',
    question: 'Do you build SEO-friendly business websites?',
    answer:
      'Yes. Our website development includes responsive design, fast performance, clear structure for search engines, and conversion-focused layouts. We build business websites that help Kolhapur and pan-India companies generate enquiries, not just look modern.',
    category: 'services',
  },
  {
    id: 'kolhapur-software-company',
    question: 'Is Tribound Tech an IT and software company in Kolhapur?',
    answer:
      'Yes. Tribound Tech is an IT and software company based in Kolhapur, Maharashtra, India. We deliver custom software development, website development, mobile apps, AI solutions, ERP, business automation, data analytics, and cloud solutions for local businesses and clients across India.',
    category: 'local',
  },
  {
    id: 'kolhapur-it-services',
    question: 'What IT services do you provide in Kolhapur?',
    answer:
      'Our Kolhapur IT services include custom software, responsive business websites, mobile application development, ERP modules, AI solutions, workflow automation, microservices, cloud deployment, dashboards, and data analytics. We begin with a consultation to recommend the right approach for your business goals and budget.',
    category: 'local',
  },
  {
    id: 'outside-kolhapur',
    question: 'Do you work with clients outside Kolhapur?',
    answer:
      'Yes. Our team is based in Kolhapur and works remotely with businesses across Maharashtra and India. Discovery meetings, project updates, demonstrations, and support can be handled online, while local meetings can be arranged when appropriate.',
    category: 'local',
  },
  {
    id: 'project-timeline',
    question: 'How long does a custom software project take?',
    answer:
      'Small websites may launch in a few weeks. Custom applications and ERP modules usually take several weeks to a few months depending on complexity, integrations, and feedback cycles. After discovery, we share a milestone plan so you know what ships when.',
    category: 'process',
  },
  {
    id: 'cloud-solutions',
    question: 'What cloud solutions do you offer?',
    answer:
      'We design and deploy cloud-native applications, secure hosting setups, APIs, and scalable architectures on platforms such as AWS and Azure. Cloud solutions help your software stay available, secure, and ready to grow with your business.',
    category: 'services',
  },
  {
    id: 'maintenance',
    question: 'Do you provide support after launch?',
    answer:
      'Yes. Tribound Tech offers ongoing maintenance, monitoring, feature updates, and support so your software stays secure and reliable after go-live. Support plans are defined during the proposal stage.',
    category: 'process',
  },
  {
    id: 'get-started',
    question: 'How do I start a project with Tribound Tech?',
    answer:
      'Share your requirements via our contact form, email info@triboundtech.com, or call +91 94048 93174. We schedule a free consultation, clarify scope, and send a proposal with timeline and investment. You can also explore our Services and Solutions pages first.',
    category: 'general',
  },
]

export const faqPageIntro =
  'Answers to common questions about custom software, website development, AI automation, ERP, and working with Tribound Tech in Kolhapur, Maharashtra.'
