import net from 'node:net'
import type { Request, Response } from 'express'

const TAG = '[socket-test]'
const HOST = 'smtp.hostinger.com'
const PORT = 465
const TIMEOUT_MS = 5_000

function log(...args: unknown[]): void {
  console.log(TAG, ...args)
}

export function socketTest(_req: Request, res: Response): void {
  log('===== SOCKET TEST START =====')
  log(`Connecting to ${HOST}:${PORT} (timeout ${TIMEOUT_MS}ms)`)

  const started = Date.now()
  let settled = false

  const finish = (
    status: number,
    body: { connected: true; elapsedMs: number } | { connected: false; error: string; code: string; elapsedMs?: number },
  ) => {
    if (settled) return
    settled = true
    log('Response', body)
    log('===== SOCKET TEST END =====')
    if (!res.headersSent) {
      res.status(status).json(body)
    }
  }

  let socket: net.Socket
  try {
    socket = net.connect({ host: HOST, port: PORT })
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    log('net.connect threw synchronously', { code: err.code, message: err.message })
    finish(200, {
      connected: false,
      error: err.message ?? String(error),
      code: err.code ?? 'EUNKNOWN',
      elapsedMs: Date.now() - started,
    })
    return
  }

  socket.setTimeout(TIMEOUT_MS)

  socket.once('connect', () => {
    const elapsedMs = Date.now() - started
    log('TCP connect succeeded', { elapsedMs })
    try {
      socket.destroy()
    } catch {
      // ignore
    }
    finish(200, { connected: true, elapsedMs })
  })

  socket.once('timeout', () => {
    const elapsedMs = Date.now() - started
    log('TCP connect timed out', { elapsedMs })
    try {
      socket.destroy()
    } catch {
      // ignore
    }
    finish(200, {
      connected: false,
      error: `Connection timed out after ${TIMEOUT_MS}ms`,
      code: 'ETIMEDOUT',
      elapsedMs,
    })
  })

  socket.once('error', (error: NodeJS.ErrnoException) => {
    const elapsedMs = Date.now() - started
    log('TCP connect failed', { code: error.code, message: error.message, elapsedMs })
    try {
      socket.destroy()
    } catch {
      // ignore
    }
    finish(200, {
      connected: false,
      error: error.message,
      code: error.code ?? 'EUNKNOWN',
      elapsedMs,
    })
  })
}
