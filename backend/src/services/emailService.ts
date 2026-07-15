import nodemailer, { type Transporter } from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'
import { renderCustomerConfirmationEmail } from '../templates/customerConfirmationEmail.js'
import { renderInternalEnquiryEmail } from '../templates/internalEnquiryEmail.js'
import type { EnquiryEmailPayload } from '../types/contact.js'
import { cleanEnv } from '../utils/env.js'

export type { EnquiryEmailPayload }

function getSmtpConfig(): SMTPTransport.Options | null {
  const host = cleanEnv(process.env.SMTP_SERVER)
  const port = Number(cleanEnv(process.env.SMTP_PORT)) || 465
  const user = cleanEnv(process.env.SMTP_USERNAME)
  const pass = cleanEnv(process.env.SMTP_PASSWORD)

  if (!host || !user || !pass || pass === 'YOUR_MAILBOX_PASSWORD') {
    return null
  }

  if (port === 465) {
    return {
      host,
      port: 465,
      secure: true,
      auth: { user, pass },
    }
  }

  return {
    host,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
  }
}

function getTransporter(): Transporter {
  const config = getSmtpConfig()
  if (!config) {
    throw new Error('SMTP is not configured. Check SMTP_* environment variables.')
  }
  return nodemailer.createTransport(config)
}

function getMailFrom(): { address: string; name: string } {
  const address = cleanEnv(process.env.MAIL_FROM) || 'enquiry@triboundtech.com'
  const name = cleanEnv(process.env.MAIL_FROM_NAME) || 'Tribound Tech'
  return { address, name }
}

function getInternalRecipient(): string {
  return cleanEnv(process.env.CONTACT_TO_EMAIL) || 'info@triboundtech.com'
}

export class EmailService {
  static async sendInternalNotification(enquiry: EnquiryEmailPayload): Promise<void> {
    const transporter = getTransporter()
    const from = getMailFrom()
    const to = getInternalRecipient()
    const template = renderInternalEnquiryEmail(enquiry)

    await transporter.sendMail({
      from: `"${from.name}" <${from.address}>`,
      to,
      replyTo: {
        name: enquiry.name,
        address: enquiry.email,
      },
      subject: template.subject,
      html: template.html,
      text: template.text,
      headers: {
        'X-Contact-Form-Reply-To': enquiry.email,
      },
    })
  }

  static async sendCustomerConfirmation(enquiry: EnquiryEmailPayload): Promise<void> {
    const transporter = getTransporter()
    const from = getMailFrom()
    const template = renderCustomerConfirmationEmail(enquiry)

    await transporter.sendMail({
      from: `"${from.name}" <${from.address}>`,
      to: enquiry.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }
}
