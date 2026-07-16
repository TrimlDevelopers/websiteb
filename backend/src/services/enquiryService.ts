import mongoose from 'mongoose'
import { EnquiryModel, type EnquiryDocument, type EnquiryStatus } from '../models/Enquiry.js'
import type { EnquiryInput, EnquiryListQuery } from '../types/enquiry.js'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export interface EnquiryListResult {
  items: EnquiryDocument[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface EnquiryStats {
  total: number
  new: number
  contacted: number
  closed: number
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function createEnquiry(input: EnquiryInput): Promise<EnquiryDocument> {
  const enquiry = await EnquiryModel.create({
    name: input.name,
    email: input.email,
    phone: input.phone ?? '',
    company: input.company ?? '',
    service: input.service ?? '',
    message: input.message,
    status: 'New',
  })
  return enquiry
}

export async function listEnquiries(query: EnquiryListQuery): Promise<EnquiryListResult> {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || DEFAULT_LIMIT))
  const sortDir = query.sort === 'oldest' ? 1 : -1

  const filter: Record<string, unknown> = {}

  if (query.status && query.status !== 'All') {
    filter.status = query.status
  }

  const search = query.search?.trim()
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i')
    filter.$or = [{ name: pattern }, { email: pattern }, { company: pattern }]
  }

  const [items, total] = await Promise.all([
    EnquiryModel.find(filter)
      .sort({ createdAt: sortDir })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec(),
    EnquiryModel.countDocuments(filter),
  ])

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}

export async function getEnquiryById(id: string): Promise<EnquiryDocument | null> {
  if (!mongoose.isValidObjectId(id)) return null
  return EnquiryModel.findById(id).exec()
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
): Promise<EnquiryDocument | null> {
  if (!mongoose.isValidObjectId(id)) return null
  return EnquiryModel.findByIdAndUpdate(id, { status }, { new: true }).exec()
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  if (!mongoose.isValidObjectId(id)) return false
  const result = await EnquiryModel.findByIdAndDelete(id).exec()
  return Boolean(result)
}

export async function getEnquiryStats(): Promise<EnquiryStats> {
  const [total, newCount, contacted, closed] = await Promise.all([
    EnquiryModel.countDocuments(),
    EnquiryModel.countDocuments({ status: 'New' }),
    EnquiryModel.countDocuments({ status: 'Contacted' }),
    EnquiryModel.countDocuments({ status: 'Closed' }),
  ])

  return {
    total,
    new: newCount,
    contacted,
    closed,
  }
}
