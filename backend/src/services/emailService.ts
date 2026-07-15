import nodemailer, { type Transporter } from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'
import { renderCustomerConfirmationEmail } from '../templates/customerConfirmationEmail.js'
import { renderInternalEnquiryEmail } from '../templates/internalEnquiryEmail.js'
import type { EnquiryEmailPayload } from '../types/contact.js'
import { cleanEnv } from '../utils/env.js'

export type { EnquiryEmailPayload }

/** Hard ceiling so SMTP can never block indefinitely (Render ↔ Hostinger TCP often stalls). */
const SMTP_TIMEOUT_MS = Number(process.env.SMTP_TIMEOUT_MS) || 10_000

let sharedTransporter: Transporter | null = null

/** Shared Hostinger SMTP options used by EmailService and /api/test-smtp. */
export function getSmtpConfig(): SMTPTransport.Options | null {
  const host = cleanEnv(process.env.SMTP_SERVER)
  const port = Number(cleanEnv(process.env.SMTP_PORT)) || 465
  const user = cleanEnv(process.env.SMTP_USERNAME)
  const pass = cleanEnv(process.env.SMTP_PASSWORD)

  if (!host || !user || !pass || pass === 'YOUR_MAILBOX_PASSWORD') {
    return null
  }

  const timeouts = {
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
  }

  // Hostinger: 465 = SSL (secure: true); 587 = STARTTLS
  if (port === 465) {
    return {
      host,
      port: 465,
      secure: true,
      auth: { user, pass },
      ...timeouts,
    }
  }

  return {
    host,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
    ...timeouts,
  }
}

function getTransporter(): Transporter {
  if (sharedTransporter) {
    return sharedTransporter
  }

  const config = getSmtpConfig()
  if (!config) {
    throw new Error('SMTP is not configured. Check SMTP_* environment variables.')
  }

  console.log('[email] Creating shared Nodemailer transporter', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS ?? false,
    connectionTimeout: SMTP_TIMEOUT_MS,
  })

  sharedTransporter = nodemailer.createTransport(config)
  return sharedTransporter
}

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`[email] ${label} timed out after ${SMTP_TIMEOUT_MS}ms`))
    }, SMTP_TIMEOUT_MS)
  })

  try {
    return await Promise.race([promise, timeout])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

function getMailFrom(): { address: string; name: string } {
  const address = cleanEnv(process.env.MAIL_FROM) || 'enquiry@triboundtech.com'
  const name = cleanEnv(process.env.MAIL_FROM_NAME) || 'Tribound Tech'
  return { address, name }
}

function getInternalRecipient(): string {
  return cleanEnv(process.env.CONTACT_TO_EMAIL) || 'info@triboundtech.com'
}

function toPayload(enquiry: EnquiryEmailPayload): EnquiryEmailPayload {
  return {
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    company: enquiry.company,
    service: enquiry.service,
    message: enquiry.message,
    createdAt: enquiry.createdAt instanceof Date ? enquiry.createdAt : new Date(enquiry.createdAt),
  }
}

export class EmailService {
  /**
   * Optional one-time SMTP check at process startup (never inside request handlers).
   * Failures are logged only — the HTTP server still starts.
   */
  static async initAtStartup(): Promise<void> {
    console.log('[email] Startup SMTP init...')
    try {
      const transporter = getTransporter()
      const auth = getSmtpConfig()?.auth
      const user =
        auth && typeof auth === 'object' && 'user' in auth ? String(auth.user) : undefined
      console.log('[email] Startup verify config', {
        host: cleanEnv(process.env.SMTP_SERVER),
        port: cleanEnv(process.env.SMTP_PORT) || '465',
        username: user,
        passwordExists: Boolean(cleanEnv(process.env.SMTP_PASSWORD)),
        passwordLength: cleanEnv(process.env.SMTP_PASSWORD).length,
      })

      await withTimeout(transporter.verify(), 'startup transporter.verify()')
      console.log('[email] Startup SMTP verify succeeded')
    } catch (error) {
      console.error(
        '[email] Startup SMTP verify failed — contact form will still accept enquiries; emails may fail on Render if outbound SMTP is blocked:',
        error,
      )
    }
  }

  static async sendInternalNotification(enquiry: EnquiryEmailPayload): Promise<void> {
    console.log('[email] Sending internal email...')
    const transporter = getTransporter()
    const from = getMailFrom()
    const to = getInternalRecipient()
    const template = renderInternalEnquiryEmail(enquiry)

    const info = await withTimeout(
      transporter.sendMail({
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
      }),
      'internal sendMail()',
    )

    console.log('[email] Internal email sent', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    })
  }

  static async sendCustomerConfirmation(enquiry: EnquiryEmailPayload): Promise<void> {
    console.log('[email] Sending auto-reply...')
    const transporter = getTransporter()
    const from = getMailFrom()
    const template = renderCustomerConfirmationEmail(enquiry)

    const info = await withTimeout(
      transporter.sendMail({
        from: `"${from.name}" <${from.address}>`,
        to: enquiry.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      }),
      'auto-reply sendMail()',
    )

    console.log('[email] Auto-reply sent', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    })
  }

  /**
   * Send both emails after the HTTP response has already been returned.
   * Each send is timed out so neither can hang the Node process indefinitely.
   */
  static async dispatchEnquiryEmails(enquiry: EnquiryEmailPayload): Promise<void> {
    const payload = toPayload(enquiry)

    try {
      await EmailService.sendInternalNotification(payload)
    } catch (error) {
      console.error('[email] Internal notification failed:', error)
    }

    try {
      await EmailService.sendCustomerConfirmation(payload)
    } catch (error) {
      console.error('[email] Auto-reply failed:', error)
    }

    console.log('[email] Enquiry email dispatch finished')
  }
}
