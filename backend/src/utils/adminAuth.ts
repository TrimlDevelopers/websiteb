import crypto from 'node:crypto'
import type { CookieOptions, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cleanEnv } from './env.js'

export const ADMIN_COOKIE_NAME = 'tribound_admin_token'
const JWT_EXPIRES_IN = '24h'
const JWT_EXPIRES_MS = 24 * 60 * 60 * 1000

export interface AdminJwtPayload {
  sub: string
  username: string
  role: 'admin'
}

export function getJwtSecret(): string {
  const secret = cleanEnv(process.env.JWT_SECRET)
  if (!secret || secret.length < 16) {
    throw new Error('JWT_SECRET is missing or too short (min 16 characters)')
  }
  return secret
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(
    cleanEnv(process.env.ADMIN_USERNAME) &&
      cleanEnv(process.env.ADMIN_PASSWORD) &&
      cleanEnv(process.env.JWT_SECRET) &&
      cleanEnv(process.env.JWT_SECRET).length >= 16,
  )
}

function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    // Still compare to reduce timing leaks on length
    crypto.timingSafeEqual(bufA, bufA)
    return false
  }
  return crypto.timingSafeEqual(bufA, bufB)
}

/**
 * Verifies admin password against ADMIN_PASSWORD env.
 * Supports bcrypt hashes (future DB / hashed env) or plaintext env (timing-safe).
 * Never log the password or hash.
 */
export async function verifyAdminPassword(inputPassword: string): Promise<boolean> {
  const expected = cleanEnv(process.env.ADMIN_PASSWORD)
  if (!expected || !inputPassword) return false

  if (expected.startsWith('$2a$') || expected.startsWith('$2b$') || expected.startsWith('$2y$')) {
    return bcrypt.compare(inputPassword, expected)
  }

  return timingSafeEqualString(inputPassword, expected)
}

export function verifyAdminUsername(inputUsername: string): boolean {
  const expected = cleanEnv(process.env.ADMIN_USERNAME)
  if (!expected || !inputUsername) return false
  return timingSafeEqualString(inputUsername.trim(), expected)
}

export function signAdminToken(username: string): string {
  const payload: AdminJwtPayload = {
    sub: 'admin',
    username,
    role: 'admin',
  }
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN })
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AdminJwtPayload
    if (decoded.role !== 'admin' || !decoded.username) return null
    return decoded
  } catch {
    return null
  }
}

export function getAdminCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true'

  return {
    httpOnly: true,
    secure: isProd,
    // Cross-site frontend (triboundtech.com) → API (onrender.com) needs None+Secure
    sameSite: isProd ? 'none' : 'lax',
    maxAge: JWT_EXPIRES_MS,
    path: '/',
  }
}

export function setAdminAuthCookie(res: Response, token: string): void {
  res.cookie(ADMIN_COOKIE_NAME, token, getAdminCookieOptions())
}

export function clearAdminAuthCookie(res: Response): void {
  res.clearCookie(ADMIN_COOKIE_NAME, {
    ...getAdminCookieOptions(),
    maxAge: 0,
  })
}

export function readAdminTokenFromRequest(req: Request): string | null {
  const cookies = req.cookies as Record<string, string> | undefined
  const fromCookie = cookies?.[ADMIN_COOKIE_NAME]
  if (typeof fromCookie === 'string' && fromCookie.trim()) {
    return fromCookie.trim()
  }

  const auth = req.header('authorization') ?? ''
  if (auth.toLowerCase().startsWith('bearer ')) {
    const token = auth.slice(7).trim()
    return token || null
  }

  return null
}
