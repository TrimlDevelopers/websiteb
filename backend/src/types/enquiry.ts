import type { EnquiryStatus } from '../models/Enquiry.js'

export type { EnquiryStatus }

export interface EnquiryInput {
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  message: string
}

export interface EnquiryListQuery {
  search?: string
  status?: EnquiryStatus | 'All'
  sort?: 'newest' | 'oldest'
  page?: number
  limit?: number
}
