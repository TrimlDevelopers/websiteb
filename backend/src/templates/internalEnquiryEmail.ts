import type { EnquiryEmailPayload, RenderedEmail } from '../types/contact.js'
import { escapeHtml, formatDate } from '../utils/env.js'
import { detailRow, renderEmailLayout } from './emailLayout.js'

function display(value?: string | null): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : '—'
}

export function renderInternalEnquiryEmail(enquiry: EnquiryEmailPayload): RenderedEmail {
  const submittedOn = formatDate(enquiry.createdAt)
  const safeName = escapeHtml(enquiry.name)
  const safeEmail = escapeHtml(enquiry.email)
  const safePhone = escapeHtml(display(enquiry.phone))
  const safeCompany = escapeHtml(display(enquiry.company))
  const safeService = escapeHtml(display(enquiry.service))
  const safeMessage = escapeHtml(enquiry.message).replace(/\n/g, '<br>')
  const safeSubmitted = escapeHtml(submittedOn)

  const bodyHtml = `
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#334155;">
      New enquiry received from the website.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      ${detailRow('Name', safeName)}
      ${detailRow('Email', `<a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none;">${safeEmail}</a>`)}
      ${detailRow('Phone', safePhone)}
      ${detailRow('Company', safeCompany)}
      ${detailRow('Service', safeService)}
      ${detailRow('Message', safeMessage)}
      ${detailRow('Submitted On', safeSubmitted)}
    </table>
    <p style="margin:0;padding:14px 16px;background-color:#eff6ff;border-radius:8px;font-size:13px;line-height:1.5;color:#1e40af;">
      Reply to this email to respond directly to <strong>${safeName}</strong>.
    </p>
  `

  const text = [
    'New enquiry received from the website.',
    '',
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${display(enquiry.phone)}`,
    `Company: ${display(enquiry.company)}`,
    `Service: ${display(enquiry.service)}`,
    '',
    'Message:',
    enquiry.message,
    '',
    `Submitted On: ${submittedOn}`,
    '',
    `Reply to this email to respond directly to ${enquiry.name}.`,
  ].join('\n')

  return {
    subject: 'New Website Enquiry | Tribound Tech',
    html: renderEmailLayout({
      title: 'New Website Enquiry',
      preheader: `New enquiry from ${enquiry.name}`,
      bodyHtml,
    }),
    text,
  }
}
