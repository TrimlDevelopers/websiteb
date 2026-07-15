import { company, products, services } from './content'

export const chatbotConfig = {
  name: `${company.name} Assistant`,
  greeting: `Hi! I'm the ${company.name} assistant. Ask me about our services, solutions, pricing, or how to reach our team.`,
  placeholder: 'Ask about services, pricing, contact...',
  offlineNote: 'For project inquiries, our team responds within 24 business hours.',
}

export const chatbotQuickReplies = [
  { id: 'services', label: 'Our Services' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'contact', label: 'Contact Info' },
  { id: 'quote', label: 'Get a Quote' },
] as const

export type QuickReplyId = (typeof chatbotQuickReplies)[number]['id']

export type ChatSuggestion = {
  id: string
  label: string
}

export const rootSuggestions: ChatSuggestion[] = [
  { id: 'qr:services', label: 'Our Services' },
  { id: 'qr:solutions', label: 'Solutions' },
  { id: 'qr:contact', label: 'Contact Info' },
  { id: 'qr:quote', label: 'Get a Quote' },
]

const quickReplyByLabel = new Map(
  chatbotQuickReplies.map((item) => [item.label.toLowerCase(), item.id]),
)

export function resolveQuickReplyId(input: string): QuickReplyId | null {
  const normalized = input.trim().toLowerCase()
  return quickReplyByLabel.get(normalized) ?? null
}

export const serviceListText = services
  .map((s, i) => `${i + 1}. ${s.navLabel} — ${s.shortDescription}`)
  .join('\n')

export const productListText = products
  .map((p, i) => `${i + 1}. ${p.title} — ${p.subtitle}`)
  .join('\n')

export const contactInfoText = `Here's how to reach ${company.name}:

Phone: ${company.phone}
Email: ${company.email}
Website: ${company.website}
Location: ${company.location}

You can also use the contact form on our website.`

export function findServiceMatch(input: string) {
  const text = input.toLowerCase()
  return services.find((service) => {
    const idPhrase = service.id.replace(/-/g, ' ')
    return (
      text.includes(idPhrase) ||
      text.includes(service.navLabel.toLowerCase()) ||
      text.includes(service.title.toLowerCase())
    )
  })
}

export function findProductMatch(input: string) {
  const text = input.toLowerCase()
  return products.find(
    (product) =>
      text.includes(product.id.replace(/-/g, ' ')) ||
      text.includes(product.title.toLowerCase()) ||
      text.includes(product.subtitle.toLowerCase()),
  )
}
