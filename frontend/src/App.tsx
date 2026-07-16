import { Suspense, lazy, type ReactNode } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute'

const HomePage = lazy(() => import('./pages/HomePage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const IndustriesPage = lazy(() => import('./pages/IndustriesPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))
const AdminEnquiriesPage = lazy(() => import('./pages/AdminEnquiriesPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

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

function LazyRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/login"
        element={
          <LazyRoute>
            <AdminLoginPage />
          </LazyRoute>
        }
      />
      <Route
        path="/admin/enquiries"
        element={
          <LazyRoute>
            <AdminProtectedRoute>
              <AdminEnquiriesPage />
            </AdminProtectedRoute>
          </LazyRoute>
        }
      />
      <Route element={<Layout />}>
        <Route path="/" element={<LazyRoute><HomePage /></LazyRoute>} />
        <Route path="/services" element={<LazyRoute><ServicesPage /></LazyRoute>} />
        <Route path="/services/:id" element={<LazyRoute><ServiceDetailPage /></LazyRoute>} />
        <Route path="/products" element={<LazyRoute><ProductsPage /></LazyRoute>} />
        <Route path="/industries" element={<LazyRoute><IndustriesPage /></LazyRoute>} />
        <Route path="/about" element={<LazyRoute><AboutPage /></LazyRoute>} />
        <Route path="/contact" element={<LazyRoute><ContactPage /></LazyRoute>} />
        <Route path="/faq" element={<LazyRoute><FaqPage /></LazyRoute>} />
        <Route path="/privacy" element={<LazyRoute><PrivacyPage /></LazyRoute>} />
        <Route path="/terms" element={<LazyRoute><TermsPage /></LazyRoute>} />
        <Route path="*" element={<LazyRoute><NotFoundPage /></LazyRoute>} />
      </Route>
    </Routes>
  )
}
