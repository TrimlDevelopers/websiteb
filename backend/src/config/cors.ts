import type { CorsOptions } from 'cors'

const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'https://triboundtech.com',
  'https://www.triboundtech.com',
  'https://websiteb-f1.onrender.com',
]

function parseOrigins(): string[] {
  const fromEnv = [process.env.CORS_ORIGINS, process.env.FRONTEND_URL]
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean)

  return [...new Set([...DEFAULT_ORIGINS, ...fromEnv])]
}

export function getCorsOptions(): CorsOptions {
  const allowedOrigins = parseOrigins()

  return {
    origin(origin, callback) {
      // Allow non-browser tools (no Origin header) and listed frontends.
      // Never use "*" — reflect the request origin explicitly when allowed.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(null, false)
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  }
}

export function getAllowedOrigins(): string[] {
  return parseOrigins()
}
