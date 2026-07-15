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

  let enquiry
  try {
    enquiry = await ContactEnquiryModel.create({
      ...payload,
      status: 'New',
    })
  } catch (error) {
    console.error('[contact] Failed to save enquiry:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to save your enquiry. Please try again later.',
    })
    return
  }

  try {
    await EmailService.sendInternalNotification(enquiry)
  } catch (error) {
    console.error('[contact] Internal notification email failed:', error)
  }

  try {
    await EmailService.sendCustomerConfirmation(enquiry)
  } catch (error) {
    console.error('[contact] Customer confirmation email failed:', error)
  }

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGE,
  })
}
