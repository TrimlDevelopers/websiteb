import { company, products, services } from '../data/content'
import {
  chatbotConfig,
  contactInfoText,
  findProductMatch,
  findServiceMatch,
  productListText,
  resolveQuickReplyId,
  rootSuggestions,
  serviceListText,
  type ChatSuggestion,
  type QuickReplyId,
} from '../data/chatbot'

export type ChatMessage = {
  id: string
  role: 'user' | 'bot'
  text: string
  links?: { label: string; href: string }[]
  suggestions?: ChatSuggestion[]
}

export type SuggestionResult = {
  userLabel: string
  reply: ChatMessage
  navigate?: string
}

export function createMessageId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function menuSuggestion(): ChatSuggestion {
  return { id: 'menu', label: 'Main menu' }
}

export function getRootSuggestions(): ChatSuggestion[] {
  return [...rootSuggestions]
}

export function getServiceListSuggestions(): ChatSuggestion[] {
  return [
    ...services.map((service) => ({
      id: `service:${service.id}`,
      label: service.navLabel,
    })),
    { id: 'nav:/services', label: 'View all services' },
    { id: 'qr:quote', label: 'Get a quote' },
    menuSuggestion(),
  ]
}

export function getServiceDetailSuggestions(serviceId: string): ChatSuggestion[] {
  return [
    { id: `nav:/services/${serviceId}`, label: 'Learn more' },
    { id: 'qr:quote', label: 'Get a quote' },
    { id: 'list:services', label: 'Other services' },
    menuSuggestion(),
  ]
}

export function getProductListSuggestions(): ChatSuggestion[] {
  return [
    ...products.map((product) => ({
      id: `product:${product.id}`,
      label: product.title,
    })),
    { id: 'nav:/products', label: 'Explore all solutions' },
    { id: 'qr:quote', label: 'Get a quote' },
    menuSuggestion(),
  ]
}

export function getProductDetailSuggestions(_productId: string): ChatSuggestion[] {
  return [
    { id: 'nav:/products', label: 'View all solutions' },
    { id: 'qr:quote', label: 'Get a quote' },
    { id: 'list:solutions', label: 'More solutions' },
    menuSuggestion(),
  ]
}

export function getContactFollowUpSuggestions(): ChatSuggestion[] {
  return [
    { id: 'action:call', label: 'Call us' },
    { id: 'action:email', label: 'Email us' },
    { id: 'action:contact-form', label: 'Contact form' },
    menuSuggestion(),
  ]
}

export function getQuoteFollowUpSuggestions(): ChatSuggestion[] {
  return [
    { id: 'action:contact-form', label: 'Free consultation' },
    { id: 'action:call', label: 'Call us' },
    { id: 'action:pricing', label: 'How pricing works' },
    menuSuggestion(),
  ]
}

export function getIndustriesSuggestions(): ChatSuggestion[] {
  return [
    { id: 'nav:/industries', label: 'View industries' },
    { id: 'qr:services', label: 'Our services' },
    { id: 'qr:quote', label: 'Get a quote' },
    menuSuggestion(),
  ]
}

export function getAboutSuggestions(): ChatSuggestion[] {
  return [
    { id: 'qr:services', label: 'Our services' },
    { id: 'qr:contact', label: 'Contact info' },
    { id: 'nav:/#about', label: 'About us' },
    menuSuggestion(),
  ]
}

export function createGreetingMessage(): ChatMessage {
  return {
    id: 'greeting',
    role: 'bot',
    text: chatbotConfig.greeting,
    suggestions: getRootSuggestions(),
  }
}

export function getQuickReplyResponse(id: QuickReplyId): ChatMessage {
  switch (id) {
    case 'services':
      return {
        id: createMessageId('bot'),
        role: 'bot',
        text: `We offer these services:\n\n${serviceListText}`,
        links: [{ label: 'View all services', href: '/services' }],
        suggestions: getServiceListSuggestions(),
      }
    case 'solutions':
      return {
        id: createMessageId('bot'),
        role: 'bot',
        text: `Our ready-to-deploy solutions:\n\n${productListText}`,
        links: [{ label: 'Explore solutions', href: '/products' }],
        suggestions: getProductListSuggestions(),
      }
    case 'contact':
      return {
        id: createMessageId('bot'),
        role: 'bot',
        text: contactInfoText,
        links: [
          { label: 'Contact form', href: '/#contact' },
          { label: 'Call us', href: `tel:${company.phone.replace(/\s/g, '')}` },
          { label: 'Email us', href: `mailto:${company.email}` },
        ],
        suggestions: getContactFollowUpSuggestions(),
      }
    case 'quote':
      return {
        id: createMessageId('bot'),
        role: 'bot',
        text: `We'd love to discuss your project. Share your requirements through our contact form or call ${company.phone}. We offer a free consultation to understand your goals and provide a tailored estimate.`,
        links: [{ label: 'Free consultation', href: '/#contact' }],
        suggestions: getQuoteFollowUpSuggestions(),
      }
    default:
      return {
        id: createMessageId('bot'),
        role: 'bot',
        text: chatbotConfig.greeting,
        suggestions: getRootSuggestions(),
      }
  }
}

function getServiceResponse(serviceId: string): ChatMessage {
  const service = services.find((item) => item.id === serviceId)
  if (!service) {
    return getQuickReplyResponse('services')
  }

  return {
    id: createMessageId('bot'),
    role: 'bot',
    text: `${service.title}\n\n${service.shortDescription}\n\n${service.description}`,
    links: [{ label: 'Learn more', href: `/services/${service.id}` }],
    suggestions: getServiceDetailSuggestions(service.id),
  }
}

function getProductResponse(productId: string): ChatMessage {
  const product = products.find((item) => item.id === productId)
  if (!product) {
    return getQuickReplyResponse('solutions')
  }

  return {
    id: createMessageId('bot'),
    role: 'bot',
    text: `${product.title}\n${product.subtitle}\n\n${product.description}`,
    links: [{ label: 'View solutions', href: '/products' }],
    suggestions: getProductDetailSuggestions(product.id),
  }
}

export function resolveSuggestion(suggestion: ChatSuggestion): SuggestionResult {
  const { id, label } = suggestion

  if (id === 'menu') {
    return {
      userLabel: label,
      reply: {
        id: createMessageId('bot'),
        role: 'bot',
        text: 'What would you like to explore?',
        suggestions: getRootSuggestions(),
      },
    }
  }

  if (id.startsWith('qr:')) {
    const quickReplyId = id.slice(3) as QuickReplyId
    return {
      userLabel: label,
      reply: getQuickReplyResponse(quickReplyId),
    }
  }

  if (id === 'list:services') {
    return {
      userLabel: label,
      reply: getQuickReplyResponse('services'),
    }
  }

  if (id === 'list:solutions') {
    return {
      userLabel: label,
      reply: getQuickReplyResponse('solutions'),
    }
  }

  if (id.startsWith('service:')) {
    const serviceId = id.slice(8)
    return {
      userLabel: label,
      reply: getServiceResponse(serviceId),
    }
  }

  if (id.startsWith('product:')) {
    const productId = id.slice(8)
    return {
      userLabel: label,
      reply: getProductResponse(productId),
    }
  }

  if (id.startsWith('nav:')) {
    const href = id.slice(4)
    return {
      userLabel: label,
      reply: {
        id: createMessageId('bot'),
        role: 'bot',
        text: `Sure — opening ${label.toLowerCase()}.`,
      },
      navigate: href,
    }
  }

  if (id === 'action:call') {
    const phoneHref = `tel:${company.phone.replace(/\s/g, '')}`
    return {
      userLabel: label,
      reply: {
        id: createMessageId('bot'),
        role: 'bot',
        text: `You can reach us at ${company.phone}.`,
        suggestions: getContactFollowUpSuggestions().filter((item) => item.id !== 'action:call'),
      },
      navigate: phoneHref,
    }
  }

  if (id === 'action:email') {
    const emailHref = `mailto:${company.email}`
    return {
      userLabel: label,
      reply: {
        id: createMessageId('bot'),
        role: 'bot',
        text: `Email us at ${company.email}. We typically respond within 24 business hours.`,
        suggestions: getContactFollowUpSuggestions().filter((item) => item.id !== 'action:email'),
      },
      navigate: emailHref,
    }
  }

  if (id === 'action:contact-form') {
    return {
      userLabel: label,
      reply: {
        id: createMessageId('bot'),
        role: 'bot',
        text: 'Opening the contact form — share your project details and we will get back to you shortly.',
        suggestions: getQuoteFollowUpSuggestions().filter((item) => item.id !== 'action:contact-form'),
      },
      navigate: '/#contact',
    }
  }

  if (id === 'action:pricing') {
    return {
      userLabel: label,
      reply: {
        id: createMessageId('bot'),
        role: 'bot',
        text: 'Pricing depends on project scope, timeline, and technology stack. We provide a free consultation first, then share a tailored estimate.',
        links: [{ label: 'Get a free consultation', href: '/#contact' }],
        suggestions: getQuoteFollowUpSuggestions(),
      },
    }
  }

  return {
    userLabel: label,
    reply: {
      id: createMessageId('bot'),
      role: 'bot',
      text: "I didn't quite catch that. Try one of the options below.",
      suggestions: getRootSuggestions(),
    },
  }
}

export function getBotReply(input: string): ChatMessage {
  const text = input.trim()
  const normalized = text.toLowerCase()
  const id = createMessageId('bot')

  if (!text) {
    return {
      id,
      role: 'bot',
      text: 'Please type a message or choose one of the options below.',
      suggestions: getRootSuggestions(),
    }
  }

  const quickReplyId = resolveQuickReplyId(text)
  if (quickReplyId) {
    return getQuickReplyResponse(quickReplyId)
  }

  const matchedService = findServiceMatch(normalized)
  if (matchedService) {
    return getServiceResponse(matchedService.id)
  }

  const matchedProduct = findProductMatch(normalized)
  if (matchedProduct) {
    return getProductResponse(matchedProduct.id)
  }

  if (/^(hi|hello|hey|hola|good\s*(morning|afternoon|evening)|namaste)\b/.test(normalized)) {
    return {
      id,
      role: 'bot',
      text: `Hello! Welcome to ${company.name}. ${company.tagline}\n\nWhat would you like to know — services, solutions, pricing, or contact details?`,
      suggestions: getRootSuggestions(),
    }
  }

  if (/\b(service|services|what do you (do|offer)|develop|software|website|mobile|microservice|automation|analytics)\b/.test(normalized)) {
    return {
      id,
      role: 'bot',
      text: `Here's what we offer:\n\n${serviceListText}`,
      links: [{ label: 'View all services', href: '/services' }],
      suggestions: getServiceListSuggestions(),
    }
  }

  if (/\b(solution|solutions|product|products|cmms|trimaint|vision|platform)\b/.test(normalized)) {
    return {
      id,
      role: 'bot',
      text: `Our solutions include:\n\n${productListText}`,
      links: [{ label: 'Explore solutions', href: '/products' }],
      suggestions: getProductListSuggestions(),
    }
  }

  if (/\b(industr|manufactur|healthcare|education|logistics|retail)\b/.test(normalized)) {
    return {
      id,
      role: 'bot',
      text: "We work across manufacturing, healthcare, logistics, education, retail, and more — building software tailored to each industry's operations.",
      links: [{ label: 'Industries we serve', href: '/industries' }],
      suggestions: getIndustriesSuggestions(),
    }
  }

  if (/\b(price|pricing|cost|quote|budget|how much|estimate)\b/.test(normalized)) {
    return {
      id,
      role: 'bot',
      text: 'Pricing depends on project scope, timeline, and technology stack. We provide a free consultation first, then share a tailored estimate.',
      links: [{ label: 'Get a free consultation', href: '/#contact' }],
      suggestions: getQuoteFollowUpSuggestions(),
    }
  }

  if (/\b(contact|email|phone|call|reach|location|address|where are you)\b/.test(normalized)) {
    return {
      id,
      role: 'bot',
      text: contactInfoText,
      links: [
        { label: 'Contact form', href: '/#contact' },
        { label: 'Email us', href: `mailto:${company.email}` },
        { label: 'Call us', href: `tel:${company.phone.replace(/\s/g, '')}` },
      ],
      suggestions: getContactFollowUpSuggestions(),
    }
  }

  if (/\b(about|who are you|company|tribound)\b/.test(normalized)) {
    return {
      id,
      role: 'bot',
      text: `${company.name} — ${company.tagline}\n\n${company.positioning}`,
      links: [
        { label: 'About us', href: '/#about' },
        { label: 'Contact us', href: '/#contact' },
      ],
      suggestions: getAboutSuggestions(),
    }
  }

  if (/\b(thank|thanks|thank you|bye|goodbye)\b/.test(normalized)) {
    return {
      id,
      role: 'bot',
      text: `You're welcome! Reach us anytime at ${company.email} or ${company.phone}. Have a great day!`,
      suggestions: [menuSuggestion()],
    }
  }

  if (/\b(help|support|assist)\b/.test(normalized)) {
    return {
      id,
      role: 'bot',
      text: 'I can help with:\n• Our services & solutions\n• Pricing & consultations\n• Contact details\n• Industries we serve\n\nChoose an option below or ask a specific question.',
      suggestions: getRootSuggestions(),
    }
  }

  return {
    id,
    role: 'bot',
    text: "I didn't quite catch that. Try asking about our services, solutions, pricing, or contact info — or pick an option below.",
    links: [
      { label: 'Contact our team', href: '/#contact' },
      { label: 'Browse services', href: '/services' },
    ],
    suggestions: getRootSuggestions(),
  }
}
