import type { NextFunction, Request, Response } from 'express'
import { cleanEnv } from '../utils/env.js'

/**
 * Protects /api/admin/* routes.
 * Expects: Authorization: Bearer <ADMIN_API_KEY>
 * or header: x-admin-api-key: <ADMIN_API_KEY>
 *
 * Set ADMIN_API_KEY in the environment. Until a full auth system exists,
 * this shared secret gates the enquiry dashboard APIs.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const expected = cleanEnv(process.env.ADMIN_API_KEY)

  if (!expected) {
    console.error('[admin] ADMIN_API_KEY is not configured')
    res.status(503).json({
      success: false,
      message: 'Admin access is not configured on this server.',
    })
    return
  }

  const headerKey = cleanEnv(req.header('x-admin-api-key') ?? undefined)
  const auth = req.header('authorization') ?? ''
  const bearer =
    auth.toLowerCase().startsWith('bearer ') ? cleanEnv(auth.slice(7)) : ''

  const provided = headerKey || bearer

  if (!provided || provided !== expected) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized. Valid admin credentials are required.',
    })
    return
  }

  next()
}
