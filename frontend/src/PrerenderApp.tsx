import { Suspense, type ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import ProductsPage from './pages/ProductsPage'
import IndustriesPage from './pages/IndustriesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FaqPage from './pages/FaqPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import NotFoundPage from './pages/NotFoundPage'

function RouteFallback() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500"
      role="status"
      aria-live="polite"
    >
      Loading…
    </div>
  )
}

function PrerenderRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

/** Synchronous route tree used only by the build-time static renderer. */
export default function PrerenderApp() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PrerenderRoute><HomePage /></PrerenderRoute>} />
        <Route path="/services" element={<PrerenderRoute><ServicesPage /></PrerenderRoute>} />
        <Route path="/services/:id" element={<PrerenderRoute><ServiceDetailPage /></PrerenderRoute>} />
        <Route path="/products" element={<PrerenderRoute><ProductsPage /></PrerenderRoute>} />
        <Route path="/industries" element={<PrerenderRoute><IndustriesPage /></PrerenderRoute>} />
        <Route path="/about" element={<PrerenderRoute><AboutPage /></PrerenderRoute>} />
        <Route path="/contact" element={<PrerenderRoute><ContactPage /></PrerenderRoute>} />
        <Route path="/faq" element={<PrerenderRoute><FaqPage /></PrerenderRoute>} />
        <Route path="/privacy" element={<PrerenderRoute><PrivacyPage /></PrerenderRoute>} />
        <Route path="/terms" element={<PrerenderRoute><TermsPage /></PrerenderRoute>} />
        <Route path="*" element={<PrerenderRoute><NotFoundPage /></PrerenderRoute>} />
      </Route>
    </Routes>
  )
}
