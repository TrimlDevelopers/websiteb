import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '../.env')
const result = dotenv.config({ path: envPath })

const err = result.error as NodeJS.ErrnoException | undefined

if (!err) {
  console.log(`[env] Loaded ${envPath}`)
} else if (err.code === 'ENOENT') {
  // Expected on Render / production — use dashboard environment variables
  console.log('[env] No .env file found; using process environment variables')
} else {
  console.warn(`[env] Failed to load ${envPath}:`, err.message)
}

export default result
