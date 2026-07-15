import dotenv from 'dotenv'

// Loads backend/.env when running locally (cwd = backend).
// On Render there is no .env file — process.env is already populated by the dashboard.
dotenv.config()
