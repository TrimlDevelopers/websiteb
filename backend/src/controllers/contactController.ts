import type { Request, Response } from 'express'
import { createEnquiry } from '../services/enquiryService.js'
import type { EnquiryInput } from '../types/enquiry.js'
import { isValidEmail } from '../utils/env.js'

const SUCCESS_MESSAGE =
  'Thank you! Your enquiry has been received successfully. Our team will contact you shortly.'

function parseBody(body: unknown): EnquiryInput {
  const data = (body ?? {}) as Record<string, unknown>

  return {
    name: typeof data.name === 'string' ? data.name.trim() : '',
    email: typeof data.email === 'string' ? data.email.trim() : '',
    phone: typeof data.phone === 'string' ? data.phone.trim() : '',
    company: typeof data.company === 'string' ? data.company.trim() : '',
    service: typeof data.service === 'string' ? data.service.trim() : '',
    message: typeof data.message === 'string' ? data.message.trim() : '',
  }
}

export async function createContactEnquiry(req: Request, res: Response): Promise<void> {
  try {
    console.log('[contact] New enquiry received')

    const payload = parseBody(req.body)

    if (!payload.name || !payload.email || !payload.message) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      })
      return
    }

    if (!isValidEmail(payload.email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      })
      return
    }

    const enquiry = await createEnquiry(payload)
    console.log('[contact] Enquiry saved', { id: String(enquiry._id) })

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGE,
    })
  } catch (error) {
    console.error('[contact] Failed to save enquiry:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to save your enquiry. Please try again later.',
    })
  }
}
