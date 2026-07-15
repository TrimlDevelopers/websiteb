import './loadEnv.js'
import cors from 'cors'
import express from 'express'
import { getAllowedOrigins, getCorsOptions } from './config/cors.js'
import { connectDatabase } from './config/db.js'
import contactRouter from './routes/contact.js'

const app = express()

// Render injects PORT — never hardcode a production port
const port = Number(process.env.PORT) || 3001

app.use(cors(getCorsOptions()))
app.use(express.json({ limit: '32kb' }))

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    allowedOrigins: getAllowedOrigins(),
  })
})

app.use('/api/contact', contactRouter)

async function start(): Promise<void> {
  await connectDatabase()

  app.listen(port, '0.0.0.0', () => {
    console.log(`[server] Listening on 0.0.0.0:${port}`)
    console.log(`[server] NODE_ENV=${process.env.NODE_ENV ?? 'undefined'}`)
    console.log(`[server] RENDER=${process.env.RENDER ?? 'undefined'}`)
    console.log(`[server] CORS origins: ${getAllowedOrigins().join(', ')}`)
  })
}

start().catch((error) => {
  console.error('[server] Failed to start:', error)
  process.exit(1)
})
