import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { BackendStatusProvider } from './context/BackendStatusContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <BackendStatusProvider>
          <App />
        </BackendStatusProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
