interface EmailLayoutOptions {
  preheader?: string
  title: string
  bodyHtml: string
  footerNote?: string
}

/** Shared branded HTML shell — table-based for email client compatibility. */
export function renderEmailLayout({
  preheader = '',
  title,
  bodyHtml,
  footerNote = 'Tribound Tech · Kolhapur, Maharashtra, India',
}: EmailLayoutOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background-color:#0f172a;padding:24px 28px;">
              <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#93c5fd;font-weight:700;">Tribound Tech</p>
              <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">${title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 6px;font-size:13px;color:#475569;">
                <a href="mailto:info@triboundtech.com" style="color:#2563eb;text-decoration:none;">info@triboundtech.com</a>
                &nbsp;·&nbsp;
                <a href="https://triboundtech.com" style="color:#2563eb;text-decoration:none;">triboundtech.com</a>
              </p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">${footerNote}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function detailRow(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;width:140px;vertical-align:top;font-size:13px;font-weight:700;color:#64748b;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;vertical-align:top;font-size:14px;color:#0f172a;line-height:1.5;">${valueHtml}</td>
  </tr>`
}
