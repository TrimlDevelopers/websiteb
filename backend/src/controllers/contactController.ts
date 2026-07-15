import type { Request, Response } from 'express'
import { ContactEnquiryModel } from '../models/ContactEnquiry.js'
import { EmailService } from '../services/emailService.js'
import type { ContactEnquiryInput } from '../types/contact.js'
import { isValidEmail } from '../utils/env.js'

const SUCCESS_MESSAGE =
  'Thank you for contacting Tribound Tech. Your enquiry has been received successfully.'

function parseBody(body: unknown): ContactEnquiryInput {
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
  console.log('[contact] Starting validation')

  const payload = parseBody(req.body)

  if (!payload.name || !payload.email || !payload.message) {
    console.log('[contact] Validation failed: missing required fields')
    res.status(400).json({
      success: false,
      message: 'Name, email, and message are required.',
    })
    return
  }

  if (!isValidEmail(payload.email)) {
    console.log('[contact] Validation failed: invalid email')
    res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    })
    return
  }

  console.log('[contact] Validation complete')

  let enquiry
  try {
    console.log('[contact] Saving enquiry to MongoDB...')
    enquiry = await ContactEnquiryModel.create({
      ...payload,
      status: 'New',
    })
    console.log('[contact] MongoDB save complete', { id: String(enquiry._id) })
  } catch (error) {
    console.error('[contact] Failed to save enquiry:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to save your enquiry. Please try again later.',
    })
    return
  }

  // Respond immediately — do not await SMTP (can ETIMEDOUT on Render).
  console.log('[contact] Returning HTTP response')
  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGE,
  })

  // Background email dispatch (after response). Failures are logged only.
  const emailPayload = {
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    company: enquiry.company,
    service: enquiry.service,
    message: enquiry.message,
    createdAt: enquiry.createdAt,
  }

  setImmediate(() => {
    console.log('[contact] Starting background email dispatch')
    void EmailService.dispatchEnquiryEmails(emailPayload)
      .then(() => {
        console.log('[contact] Background email dispatch finished')
      })
      .catch((error) => {
        console.error('[contact] Background email dispatch crashed:', error)
      })
  })
}
