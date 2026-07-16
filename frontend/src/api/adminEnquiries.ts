import { apiDelete, apiGet, apiPatch } from './client'

export type EnquiryStatus = 'New' | 'Contacted' | 'Closed'

export interface Enquiry {
  id: string
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  status: EnquiryStatus
  createdAt: string
  updatedAt: string
}

export interface EnquiryListResponse {
  success: boolean
  items: Enquiry[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface EnquiryStatsResponse {
  success: boolean
  stats: {
    total: number
    new: number
    contacted: number
    closed: number
  }
}

export function fetchEnquiries(params: {
  search?: string
  status?: EnquiryStatus | 'All'
  sort?: 'newest' | 'oldest'
  page?: number
  limit?: number
}): Promise<EnquiryListResponse> {
  const qs = new URLSearchParams()
  if (params.search) qs.set('search', params.search)
  if (params.status && params.status !== 'All') qs.set('status', params.status)
  if (params.sort) qs.set('sort', params.sort)
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))

  const query = qs.toString()
  return apiGet<EnquiryListResponse>(`/api/admin/enquiries${query ? `?${query}` : ''}`)
}

export function fetchEnquiryStats(): Promise<EnquiryStatsResponse> {
  return apiGet<EnquiryStatsResponse>('/api/admin/enquiries/stats')
}

export function fetchEnquiryById(id: string): Promise<{ success: boolean; enquiry: Enquiry }> {
  return apiGet(`/api/admin/enquiries/${id}`)
}

export function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
): Promise<{ success: boolean; enquiry: Enquiry }> {
  return apiPatch(`/api/admin/enquiries/${id}/status`, { status })
}

export function deleteEnquiry(id: string): Promise<{ success: boolean; message: string }> {
  return apiDelete(`/api/admin/enquiries/${id}`)
}
