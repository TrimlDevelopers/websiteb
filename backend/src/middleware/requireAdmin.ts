import type { NextFunction, Request, Response } from 'express'
import {
  isAdminAuthConfigured,
  readAdminTokenFromRequest,
  verifyAdminToken,
  type AdminJwtPayload,
} from '../utils/adminAuth.js'

export type AuthedAdminRequest = Request & {
  admin?: AdminJwtPayload
}

/**
 * Requires a valid admin JWT from the HttpOnly cookie (or Bearer token).
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!isAdminAuthConfigured()) {
    console.error('[admin] Auth is not configured (ADMIN_USERNAME / ADMIN_PASSWORD / JWT_SECRET)')
    res.status(503).json({
      success: false,
      message: 'Admin authentication is not configured on this server.',
    })
    return
  }

  const token = readAdminTokenFromRequest(req)
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized. Please sign in.',
    })
    return
  }

  const payload = verifyAdminToken(token)
  if (!payload) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized. Session expired or invalid.',
    })
    return
  }

  ;(req as AuthedAdminRequest).admin = payload
  next()
}
