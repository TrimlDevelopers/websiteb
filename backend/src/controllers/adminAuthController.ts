import type { Request, Response } from 'express'
import type { AuthedAdminRequest } from '../middleware/requireAdmin.js'
import {
  clearAdminAuthCookie,
  isAdminAuthConfigured,
  setAdminAuthCookie,
  signAdminToken,
  verifyAdminPassword,
  verifyAdminUsername,
} from '../utils/adminAuth.js'
import { cleanEnv } from '../utils/env.js'

function parseCredentials(body: unknown): { username: string; password: string } {
  const data = (body ?? {}) as Record<string, unknown>
  return {
    username: typeof data.username === 'string' ? data.username.trim() : '',
    password: typeof data.password === 'string' ? data.password : '',
  }
}

export async function adminLogin(req: Request, res: Response): Promise<void> {
  try {
    if (!isAdminAuthConfigured()) {
      console.error('[admin] Login attempted but auth env vars are not configured')
      res.status(503).json({
        success: false,
        message: 'Admin authentication is not configured on this server.',
      })
      return
    }

    const { username, password } = parseCredentials(req.body)

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required.',
      })
      return
    }

    if (username.length > 128 || password.length > 256) {
      res.status(400).json({
        success: false,
        message: 'Invalid credentials.',
      })
      return
    }

    const userOk = verifyAdminUsername(username)
    const passOk = await verifyAdminPassword(password)

    if (!userOk || !passOk) {
      console.log('[admin] Failed login attempt')
      res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      })
      return
    }

    const adminUsername = cleanEnv(process.env.ADMIN_USERNAME)
    const token = signAdminToken(adminUsername)
    setAdminAuthCookie(res, token)

    console.log('[admin] Successful login')
    res.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      admin: { username: adminUsername },
    })
  } catch (error) {
    console.error('[admin] Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to sign in. Please try again.',
    })
  }
}

export async function adminLogout(_req: Request, res: Response): Promise<void> {
  clearAdminAuthCookie(res)
  res.status(200).json({
    success: true,
    message: 'Signed out successfully.',
  })
}

export async function adminMe(req: Request, res: Response): Promise<void> {
  const admin = (req as AuthedAdminRequest).admin
  if (!admin) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized.',
    })
    return
  }

  res.status(200).json({
    success: true,
    admin: {
      username: admin.username,
      role: admin.role,
    },
  })
}
