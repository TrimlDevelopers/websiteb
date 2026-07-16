import { Suspense, lazy, type ReactNode } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

const HomePage = lazy(() => import('./pages/HomePage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const IndustriesPage = lazy(() => import('./pages/IndustriesPage'))
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
        path="/admin/enquiries"
        element={
          <LazyRoute>
            <AdminEnquiriesPage />
          </LazyRoute>
        }
      />
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <LazyRoute>
              <HomePage />
            </LazyRoute>
          }
        />
        <Route
          path="/services"
          element={
            <LazyRoute>
              <ServicesPage />
            </LazyRoute>
          }
        />
        <Route
          path="/services/:id"
          element={
            <LazyRoute>
              <ServiceDetailPage />
            </LazyRoute>
          }
        />
        <Route
          path="/products"
          element={
            <LazyRoute>
              <ProductsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/industries"
          element={
            <LazyRoute>
              <IndustriesPage />
            </LazyRoute>
          }
        />
        <Route
          path="*"
          element={
            <LazyRoute>
              <NotFoundPage />
            </LazyRoute>
          }
        />
      </Route>
    </Routes>
  )
}
