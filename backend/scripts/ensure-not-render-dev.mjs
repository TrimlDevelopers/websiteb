/**
 * Prevent starting the API with `npm run dev` on Render.
 * Render must use:
 *   Root Directory: backend
 *   Build Command:  npm ci && npm run build
 *   Start Command:  npm start
 */
if (process.env.RENDER === 'true') {
  console.error('')
  console.error('[server] REFUSING to run "npm run dev" on Render.')
  console.error('[server] In the Render dashboard set:')
  console.error('[server]   Root Directory: backend')
  console.error('[server]   Build Command:  npm ci && npm run build')
  console.error('[server]   Start Command:  npm start')
  console.error('[server] Do not set PORT manually (Render provides it).')
  console.error('')
  process.exit(1)
}
