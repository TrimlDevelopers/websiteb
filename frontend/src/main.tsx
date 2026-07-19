import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { BackendStatusProvider } from './context/BackendStatusContext'
import { loadInitialPage } from './routes/pageLoaders'
import './index.css'

async function bootstrap() {
  const root = document.getElementById('root')!
  const initialPage = await loadInitialPage(window.location.pathname)

  const app = (
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <BackendStatusProvider>
            <App initialPage={initialPage} />
          </BackendStatusProvider>
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>
  )

  if (root.hasChildNodes()) {
    hydrateRoot(root, app)
  } else {
    createRoot(root).render(app)
  }
}

void bootstrap()
