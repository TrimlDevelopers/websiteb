import { company } from './content'

export const aboutContent = {
  label: 'About Tribound Tech',
  title: 'IT and software company in Kolhapur',
  description:
    'Tribound Tech is a Kolhapur, Maharashtra-based technology company delivering custom software, website and mobile app development, AI solutions, ERP, business automation, and cloud systems.',
  story: [
    `${company.name} helps businesses replace manual processes with reliable software. From Kolhapur, we partner with manufacturers, service companies, and startups across India to design, build, and support production-grade systems.`,
    'Our team focuses on practical outcomes: faster operations, fewer errors, better visibility, and software your staff actually uses. We combine modern web technologies with AI and automation where they create measurable value.',
    'Whether you need a high-converting business website, a custom ERP module, or end-to-end cloud software, we deliver with clear milestones, transparent communication, and long-term support.',
  ],
  pillars: [
    {
      title: 'Custom Software Development',
      text: 'Tailored applications with secure architecture, APIs, and AI-ready features for unique business workflows.',
      href: '/services/custom-software',
    },
    {
      title: 'Website Development',
      text: 'Fast, mobile-friendly, SEO-aware websites that generate enquiries and represent your brand professionally.',
      href: '/services/website-development',
    },
    {
      title: 'AI & Business Automation',
      text: 'Automate repetitive work, connect systems, and add intelligent insights without unnecessary complexity.',
      href: '/services/business-automation',
    },
    {
      title: 'Cloud & ERP Solutions',
      text: 'Scalable cloud deployments and ERP-style systems that unify operations, inventory, and reporting.',
      href: '/services',
    },
  ],
}

export const privacyContent = {
  title: 'Privacy Policy',
  updated: '16 July 2026',
  sections: [
    {
      heading: 'Introduction',
      body: `This Privacy Policy explains how ${company.name} ("we", "us") collects, uses, and protects information when you use ${company.website} or contact us. By using our website or submitting an enquiry, you agree to this policy.`,
    },
    {
      heading: 'Information we collect',
      body: 'When you submit our contact form or email us, we may collect your name, email address, phone number, company name, service interest, and message. We may also collect basic technical data such as browser type and pages visited for security and analytics.',
    },
    {
      heading: 'How we use information',
      body: 'We use enquiry details to respond to your request, prepare proposals, deliver services, improve our website, and maintain legitimate business records. We do not sell your personal information.',
    },
    {
      heading: 'Storage and security',
      body: 'Enquiry data may be stored in our secure databases and accessed only by authorized team members. We apply reasonable technical and organizational measures to protect your information.',
    },
    {
      heading: 'Sharing',
      body: 'We may share information with trusted infrastructure providers (for example hosting or email delivery) solely to operate our business, or when required by law.',
    },
    {
      heading: 'Your choices',
      body: `You may request access, correction, or deletion of your enquiry data by contacting ${company.email} or ${company.phone}.`,
    },
    {
      heading: 'Contact',
      body: `${company.name}, ${company.location}. Email: ${company.email}. Phone: ${company.phone}.`,
    },
  ],
}

export const termsContent = {
  title: 'Terms & Conditions',
  updated: '16 July 2026',
  sections: [
    {
      heading: 'Agreement',
      body: `By accessing ${company.website}, you agree to these Terms & Conditions. If you do not agree, please do not use the site.`,
    },
    {
      heading: 'Services',
      body: `${company.name} provides software consulting and development services including custom software, websites, AI solutions, ERP, automation, and cloud solutions. Project scope, fees, and timelines are defined in separate proposals or contracts.`,
    },
    {
      heading: 'Website content',
      body: 'Content on this website is for general information. We may update service descriptions, pricing guidance, and case examples without notice. Nothing on the site constitutes a binding offer unless confirmed in writing.',
    },
    {
      heading: 'Intellectual property',
      body: `Unless otherwise agreed in a project contract, ${company.name} retains ownership of site content, branding, and pre-existing frameworks. Deliverables for paid projects are governed by the signed agreement.`,
    },
    {
      heading: 'Limitation of liability',
      body: 'To the maximum extent permitted by law, Tribound Tech is not liable for indirect or consequential damages arising from use of this website. For client projects, liability terms are stated in the service agreement.',
    },
    {
      heading: 'Governing law',
      body: 'These terms are governed by the laws of India. Disputes shall be subject to the courts of Kolhapur, Maharashtra, unless otherwise agreed in writing.',
    },
    {
      heading: 'Contact',
      body: `Questions about these terms: ${company.email}, ${company.phone}, ${company.location}.`,
    },
  ],
}
