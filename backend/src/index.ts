import './loadEnv.js'
import cors from 'cors'
import express from 'express'
import { connectDatabase } from './config/db.js'
import contactRouter from './routes/contact.js'

const app = express()
const port = Number(process.env.PORT) || 3001
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(
  cors({
    origin: frontendUrl,
    methods: ['GET', 'POST'],
  }),
)
app.use(express.json({ limit: '32kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/contact', contactRouter)

async function start(): Promise<void> {
  await connectDatabase()

  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`)
  })
}

start().catch((error) => {
  console.error('[server] Failed to start:', error)
  process.exit(1)
})
