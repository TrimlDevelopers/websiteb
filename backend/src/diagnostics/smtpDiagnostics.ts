/**
 * TEMPORARY SMTP diagnostics for Render ↔ Hostinger debugging.
 * Search logs for: [SMTP-DIAG]
 *
 * REMOVE this file and its imports from emailService.ts once testing is complete.
 * See comment block at bottom of this file for removal checklist.
 */
import dns from 'node:dns/promises'
import net from 'node:net'
import type { Transporter } from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'

const TAG = '[SMTP-DIAG]'
const TCP_TIMEOUT_MS = 10_000

export interface TcpProbeResult {
  port: number
  ok: boolean
  elapsedMs: number
  outcome: string
}

export interface SmtpDiagResult {
  host: string
  dnsOk: boolean
  resolvedAddress: string | null
  tcp465: TcpProbeResult
  tcp587: TcpProbeResult
  anyTcpOk: boolean
}

function log(...args: unknown[]): void {
  console.log(TAG, ...args)
}

function logError(...args: unknown[]): void {
  console.error(TAG, ...args)
}

export async function diagnoseDns(host: string): Promise<{ ok: boolean; address: string | null }> {
  log(`DNS lookup starting for ${host}...`)
  try {
    const result = await dns.lookup(host)
    log(`DNS resolved IP: ${result.address} (family IPv${result.family})`)
    return { ok: true, address: result.address }
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    logError(`DNS resolution failure for ${host}:`, {
      code: err.code,
      message: err.message,
      stack: err.stack,
    })
    return { ok: false, address: null }
  }
}

function probeTcp(host: string, port: number): Promise<TcpProbeResult> {
  return new Promise((resolve) => {
    const started = Date.now()
    log(`Attempting TCP connection to ${host}:${port}...`)

    const socket = net.connect({ host, port })
    let settled = false

    const finish = (outcome: string, ok: boolean) => {
      if (settled) return
      settled = true
      const elapsedMs = Date.now() - started
      try {
        socket.destroy()
      } catch {
        // ignore
      }
      log(`Port ${port}: ${outcome} (elapsed ${elapsedMs}ms)`)
      resolve({ port, ok, elapsedMs, outcome })
    }

    socket.setTimeout(TCP_TIMEOUT_MS)

    socket.once('connect', () => {
      finish('Connected successfully', true)
    })

    socket.once('timeout', () => {
      finish('Connection timeout', false)
    })

    socket.once('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'ECONNREFUSED') {
        finish('Connection refused', false)
        return
      }
      finish(`Socket error: ${error.code ?? 'UNKNOWN'} — ${error.message}`, false)
    })
  })
}

export async function diagnoseTcp(host: string): Promise<{ tcp465: TcpProbeResult; tcp587: TcpProbeResult }> {
  const tcp465 = await probeTcp(host, 465)
  const tcp587 = await probeTcp(host, 587)
  return { tcp465, tcp587 }
}

export function logSmtpConfigBeforeVerify(config: SMTPTransport.Options): void {
  const auth = config.auth
  const user =
    auth && typeof auth === 'object' && 'user' in auth && typeof auth.user === 'string'
      ? auth.user
      : undefined
  const pass =
    auth && typeof auth === 'object' && 'pass' in auth && typeof auth.pass === 'string'
      ? auth.pass
      : undefined

  log('Nodemailer config before transporter.verify():', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS ?? false,
    username: user,
    passwordExists: Boolean(pass),
    passwordLength: pass?.length ?? 0,
  })
}

export async function verifySmtpWithDiagnostics(
  transporter: Transporter,
  config: SMTPTransport.Options,
  network: SmtpDiagResult,
): Promise<boolean> {
  logSmtpConfigBeforeVerify(config)

  try {
    const result = await transporter.verify()
    log('transporter.verify() succeeded:', result)
    log('SMTP configuration is correct.')
    return true
  } catch (error) {
    const err = error as {
      code?: string
      message?: string
      response?: string
      command?: string
      stack?: string
    }

    logError('transporter.verify() failed:', {
      code: err.code,
      message: err.message,
      response: err.response,
      command: err.command,
      stack: err.stack,
    })

    if (network.dnsOk && !network.anyTcpOk) {
      logError('Render cannot establish a TCP connection to Hostinger SMTP.')
    } else if (network.anyTcpOk) {
      logError('SMTP server reachable. Problem is TLS or authentication.')
    }

    return false
  }
}

/**
 * Runs DNS + TCP diagnostics, then returns a summary for verify() conclusions.
 * Call this BEFORE nodemailer.createTransport().
 */
export async function runSmtpNetworkDiagnostics(host: string): Promise<SmtpDiagResult> {
  log('========== SMTP network diagnostics start ==========')
  const dnsResult = await diagnoseDns(host)
  const { tcp465, tcp587 } = await diagnoseTcp(host)
  const anyTcpOk = tcp465.ok || tcp587.ok

  const summary: SmtpDiagResult = {
    host,
    dnsOk: dnsResult.ok,
    resolvedAddress: dnsResult.address,
    tcp465,
    tcp587,
    anyTcpOk,
  }

  log('Network diagnostic summary:', summary)

  if (dnsResult.ok && !anyTcpOk) {
    logError('Render cannot establish a TCP connection to Hostinger SMTP.')
  }

  log('========== SMTP network diagnostics end ==========')
  return summary
}

/*
 * REMOVAL CHECKLIST (after Render testing is complete):
 * 1. Delete this file: backend/src/diagnostics/smtpDiagnostics.ts
 * 2. In backend/src/services/emailService.ts:
 *    - Remove import of runSmtpNetworkDiagnostics / verifySmtpWithDiagnostics
 *    - Restore getTransporter() to sync createTransport only (no diagnostics)
 *    - Remove verify() diagnostic call; keep sendMail as-is
 * 3. Redeploy backend
 */
