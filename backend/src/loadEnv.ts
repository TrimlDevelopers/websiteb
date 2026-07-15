import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '../.env')
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.warn(`[env] Failed to load ${envPath}:`, result.error.message)
} else {
  console.log(`[env] Loaded ${envPath}`)
}

export default result
