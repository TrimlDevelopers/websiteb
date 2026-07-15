import type { EnquiryEmailPayload, RenderedEmail } from '../types/contact.js'
import { escapeHtml } from '../utils/env.js'
import { renderEmailLayout } from './emailLayout.js'

export function renderCustomerConfirmationEmail(enquiry: EnquiryEmailPayload): RenderedEmail {
  const safeName = escapeHtml(enquiry.name)
  const serviceLine = enquiry.service?.trim()
    ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
         Regarding: <strong>${escapeHtml(enquiry.service.trim())}</strong>
       </p>`
    : ''

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
      Hello ${safeName},
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
      Thank you for contacting Tribound Tech.
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
      We have successfully received your enquiry.
    </p>
    ${serviceLine}
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
      Our team will review your requirements and contact you within <strong>2 working days</strong>.
    </p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#334155;">
      Thank you for choosing Tribound Tech.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.7;color:#0f172a;">
      Regards,<br />
      <strong>Tribound Tech</strong><br />
      <a href="mailto:info@triboundtech.com" style="color:#2563eb;text-decoration:none;">info@triboundtech.com</a><br />
      <a href="https://triboundtech.com" style="color:#2563eb;text-decoration:none;">https://triboundtech.com</a>
    </p>
  `

  const text = [
    `Hello ${enquiry.name},`,
    '',
    'Thank you for contacting Tribound Tech.',
    '',
    'We have successfully received your enquiry.',
    '',
    ...(enquiry.service?.trim() ? [`Regarding: ${enquiry.service.trim()}`, ''] : []),
    'Our team will review your requirements and contact you within 2 working days.',
    '',
    'Thank you for choosing Tribound Tech.',
    '',
    'Regards,',
    'Tribound Tech',
    'info@triboundtech.com',
    'https://triboundtech.com',
  ].join('\n')

  return {
    subject: 'Thank you for contacting Tribound Tech',
    html: renderEmailLayout({
      title: 'Enquiry Received',
      preheader: 'We have received your enquiry and will contact you within 2 working days.',
      bodyHtml,
      footerNote: 'You are receiving this email because you submitted an enquiry on triboundtech.com.',
    }),
    text,
  }
}
