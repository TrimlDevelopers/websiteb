import { apiPost } from './client'

export interface ContactEnquiryPayload {
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  message: string
}

export interface ContactEnquiryResponse {
  success: boolean
  message: string
}

export function submitContactEnquiry(
  payload: ContactEnquiryPayload,
): Promise<ContactEnquiryResponse> {
  return apiPost<ContactEnquiryResponse>('/api/contact', payload)
}
