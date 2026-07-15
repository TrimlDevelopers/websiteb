import dns from 'node:dns/promises'
import net from 'node:net'
import type { Request, Response } from 'express'
import nodemailer from 'nodemailer'
import { getSmtpConfig } from '../services/emailService.js'
import { cleanEnv } from '../utils/env.js'

const TAG = '[smtp-test]'
const TCP_TIMEOUT_MS = 10_000
const VERIFY_TIMEOUT_MS = 10_000

interface TcpResult {
  port: number
  success: boolean
  elapsedMs: number
  errorCode: string | null
  errorMessage: string | null
}

function log(...args: unknown[]): void {
  console.log(TAG, ...args)
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`))
    }, ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

function probeTcp(host: string, port: number): Promise<TcpResult> {
  return new Promise((resolve) => {
    const started = Date.now()
    log(`TCP connect start host=${host} port=${port}`)

    const socket = net.connect({ host, port })
    let settled = false

    const finish = (success: boolean, errorCode: string | null, errorMessage: string | null) => {
      if (settled) return
      settled = true
      const elapsedMs = Date.now() - started
      try {
        socket.destroy()
      } catch {
        // ignore
      }
      log(`TCP connect end port=${port}`, { success, elapsedMs, errorCode, errorMessage })
      resolve({ port, success, elapsedMs, errorCode, errorMessage })
    }

    socket.setTimeout(TCP_TIMEOUT_MS)

    socket.once('connect', () => {
      finish(true, null, null)
    })

    socket.once('timeout', () => {
      finish(false, 'ETIMEDOUT', `Connection timed out after ${TCP_TIMEOUT_MS}ms`)
    })

    socket.once('error', (error: NodeJS.ErrnoException) => {
      finish(false, error.code ?? 'UNKNOWN', error.message)
    })
  })
}

export async function testSmtp(_req: Request, res: Response): Promise<void> {
  try {
    log('===== SMTP TEST START =====')

    const config = getSmtpConfig()
    const host = cleanEnv(process.env.SMTP_SERVER) || String(config?.host ?? '')
    const port = Number(cleanEnv(process.env.SMTP_PORT) || config?.port || 465)
    const user = cleanEnv(process.env.SMTP_USERNAME)
    const pass = cleanEnv(process.env.SMTP_PASSWORD)
    const secure = port === 465

    log('SMTP configuration:', {
      host,
      port,
      secure,
      username: user || '(empty)',
      passwordExists: Boolean(pass && pass !== 'YOUR_MAILBOX_PASSWORD'),
      passwordLength: pass && pass !== 'YOUR_MAILBOX_PASSWORD' ? pass.length : 0,
    })

    if (!config || !host || !user || !pass || pass === 'YOUR_MAILBOX_PASSWORD') {
      log('SMTP not configured — aborting test')
      res.status(500).json({
        success: false,
        message: 'SMTP verification failed',
        error: 'SMTP environment variables are missing or incomplete',
        code: 'ENOTCONFIGURED',
      })
      return
    }

    // DNS
    log('DNS lookup start')
    let dnsAddress: string | null = null
    try {
      const dnsResult = await withTimeout(dns.lookup(host), TCP_TIMEOUT_MS, 'DNS lookup')
      dnsAddress = dnsResult.address
      log('DNS lookup complete', { address: dnsAddress, family: dnsResult.family })
    } catch (error) {
      const err = error as NodeJS.ErrnoException
      log('DNS lookup failed', { code: err.code, message: err.message })
      res.status(500).json({
        success: false,
        message: 'SMTP verification failed',
        error: err.message,
        code: err.code ?? 'EDNS',
        dns: { ok: false },
      })
      log('===== SMTP TEST END =====')
      return
    }

    // TCP probes
    log('TCP probes start')
    const tcp465 = await probeTcp(host, 465)
    const tcp587 = await probeTcp(host, 587)
    log('TCP probes complete', { tcp465, tcp587 })

    // Nodemailer verify
    log('Creating Nodemailer transporter')
    const transporter = nodemailer.createTransport(config)

    log('transporter.verify() start')
    try {
      await withTimeout(transporter.verify(), VERIFY_TIMEOUT_MS, 'transporter.verify()')
      log('transporter.verify() success')
      log('===== SMTP TEST END =====')

      res.status(200).json({
        success: true,
        message: 'SMTP connection successful',
        host,
        port,
        verify: true,
        dns: { ok: true, address: dnsAddress },
        tcp: {
          465: tcp465,
          587: tcp587,
        },
      })
    } catch (error) {
      const err = error as {
        code?: string
        message?: string
        response?: string
        command?: string
      }
      log('transporter.verify() failed', {
        code: err.code,
        message: err.message,
        response: err.response,
        command: err.command,
      })
      log('===== SMTP TEST END =====')

      res.status(500).json({
        success: false,
        message: 'SMTP verification failed',
        error: err.message ?? String(error),
        code: err.code ?? 'EVERIFY',
        host,
        port,
        verify: false,
        dns: { ok: true, address: dnsAddress },
        tcp: {
          465: tcp465,
          587: tcp587,
        },
      })
    }
  } catch (error) {
    const err = error as { code?: string; message?: string }
    log('Unhandled SMTP test error', { code: err.code, message: err.message })
    log('===== SMTP TEST END =====')

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'SMTP verification failed',
        error: err.message ?? String(error),
        code: err.code ?? 'EUNKNOWN',
      })
    }
  }
}
