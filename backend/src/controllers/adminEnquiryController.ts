import type { Request, Response } from 'express'
import { ENQUIRY_STATUSES, type EnquiryStatus } from '../models/Enquiry.js'
import {
  deleteEnquiry,
  getEnquiryById,
  getEnquiryStats,
  listEnquiries,
  updateEnquiryStatus,
} from '../services/enquiryService.js'

function serializeEnquiry(doc: {
  _id: { toString(): string }
  name: string
  email: string
  phone?: string | null
  company?: string | null
  service?: string | null
  message: string
  status: string
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    phone: doc.phone ?? '',
    company: doc.company ?? '',
    service: doc.service ?? '',
    message: doc.message,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export async function listAdminEnquiries(req: Request, res: Response): Promise<void> {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined
    const statusRaw = typeof req.query.status === 'string' ? req.query.status : 'All'
    const sort = req.query.sort === 'oldest' ? 'oldest' : 'newest'
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    const status =
      statusRaw === 'All' || ENQUIRY_STATUSES.includes(statusRaw as EnquiryStatus)
        ? (statusRaw as EnquiryStatus | 'All')
        : 'All'

    const result = await listEnquiries({ search, status, sort, page, limit })

    res.status(200).json({
      success: true,
      items: result.items.map(serializeEnquiry),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    })
  } catch (error) {
    console.error('[admin] Failed to list enquiries:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to load enquiries.',
    })
  }
}

export async function getAdminEnquiry(req: Request, res: Response): Promise<void> {
  try {
    const enquiry = await getEnquiryById(req.params.id)
    if (!enquiry) {
      res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      })
      return
    }

    res.status(200).json({
      success: true,
      enquiry: serializeEnquiry(enquiry),
    })
  } catch (error) {
    console.error('[admin] Failed to get enquiry:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to load enquiry.',
    })
  }
}

export async function updateAdminEnquiryStatus(req: Request, res: Response): Promise<void> {
  try {
    const status = typeof req.body?.status === 'string' ? req.body.status.trim() : ''

    if (!ENQUIRY_STATUSES.includes(status as EnquiryStatus)) {
      res.status(400).json({
        success: false,
        message: 'Status must be one of: New, Contacted, Closed.',
      })
      return
    }

    const enquiry = await updateEnquiryStatus(req.params.id, status as EnquiryStatus)
    if (!enquiry) {
      res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      })
      return
    }

    console.log('[admin] Status updated', { id: String(enquiry._id), status: enquiry.status })

    res.status(200).json({
      success: true,
      enquiry: serializeEnquiry(enquiry),
    })
  } catch (error) {
    console.error('[admin] Failed to update status:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to update enquiry status.',
    })
  }
}

export async function deleteAdminEnquiry(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await deleteEnquiry(req.params.id)
    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      })
      return
    }

    console.log('[admin] Enquiry deleted', { id: req.params.id })

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully.',
    })
  } catch (error) {
    console.error('[admin] Failed to delete enquiry:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to delete enquiry.',
    })
  }
}

export async function getAdminEnquiryStats(_req: Request, res: Response): Promise<void> {
  try {
    const stats = await getEnquiryStats()
    res.status(200).json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('[admin] Failed to load stats:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to load enquiry stats.',
    })
  }
}
