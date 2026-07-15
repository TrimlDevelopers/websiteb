export type EnquiryStatus = 'New' | 'In Progress' | 'Closed'

export interface ContactEnquiryInput {
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  message: string
}

export interface ContactEnquiryDocument extends ContactEnquiryInput {
  status: EnquiryStatus
  createdAt: Date
  updatedAt: Date
}

export interface EnquiryEmailPayload {
  name: string
  email: string
  phone?: string | null
  company?: string | null
  service?: string | null
  message: string
  createdAt: Date
}

export interface RenderedEmail {
  subject: string
  html: string
  text: string
}
