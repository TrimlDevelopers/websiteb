import { Suspense, lazy, type ComponentType, type ReactNode } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { pageLoaders, type PageKey } from './routes/pageLoaders'

const HomePage = lazy(pageLoaders.home)
const ServicesPage = lazy(pageLoaders.services)
const ServiceDetailPage = lazy(pageLoaders.serviceDetail)
const ProductsPage = lazy(pageLoaders.products)
const IndustriesPage = lazy(pageLoaders.industries)
const AboutPage = lazy(pageLoaders.about)
const ContactPage = lazy(pageLoaders.contact)
const FaqPage = lazy(pageLoaders.faq)
const PrivacyPage = lazy(pageLoaders.privacy)
const TermsPage = lazy(pageLoaders.terms)
const AdminLoginPage = lazy(pageLoaders.adminLogin)
const AdminEnquiriesPage = lazy(pageLoaders.adminEnquiries)
const NotFoundPage = lazy(pageLoaders.notFound)

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

interface InitialPage {
  key: PageKey
  Component: ComponentType
}

interface AppProps {
  /** Preloaded page for the first URL so hydration never swaps prerendered HTML for a fallback. */
  initialPage?: InitialPage
}

function PageRoute({
  pageKey,
  Lazy,
  initialPage,
}: {
  pageKey: PageKey
  Lazy: ComponentType
  initialPage?: InitialPage
}) {
  if (initialPage?.key === pageKey) {
    const SyncPage = initialPage.Component
    return <SyncPage />
  }

  return (
    <LazyRoute>
      <Lazy />
    </LazyRoute>
  )
}

export default function App({ initialPage }: AppProps) {
  return (
    <Routes>
      <Route
        path="/admin/login"
        element={<PageRoute pageKey="adminLogin" Lazy={AdminLoginPage} initialPage={initialPage} />}
      />
      <Route
        path="/admin/enquiries"
        element={
          <PageRoute pageKey="adminEnquiries" Lazy={AdminEnquiriesPage} initialPage={initialPage} />
        }
      />
      <Route element={<Layout />}>
        <Route
          path="/"
          element={<PageRoute pageKey="home" Lazy={HomePage} initialPage={initialPage} />}
        />
        <Route
          path="/services"
          element={<PageRoute pageKey="services" Lazy={ServicesPage} initialPage={initialPage} />}
        />
        <Route
          path="/services/:id"
          element={
            <PageRoute pageKey="serviceDetail" Lazy={ServiceDetailPage} initialPage={initialPage} />
          }
        />
        <Route
          path="/products"
          element={<PageRoute pageKey="products" Lazy={ProductsPage} initialPage={initialPage} />}
        />
        <Route
          path="/industries"
          element={
            <PageRoute pageKey="industries" Lazy={IndustriesPage} initialPage={initialPage} />
          }
        />
        <Route
          path="/about"
          element={<PageRoute pageKey="about" Lazy={AboutPage} initialPage={initialPage} />}
        />
        <Route
          path="/contact"
          element={<PageRoute pageKey="contact" Lazy={ContactPage} initialPage={initialPage} />}
        />
        <Route
          path="/faq"
          element={<PageRoute pageKey="faq" Lazy={FaqPage} initialPage={initialPage} />}
        />
        <Route
          path="/privacy"
          element={<PageRoute pageKey="privacy" Lazy={PrivacyPage} initialPage={initialPage} />}
        />
        <Route
          path="/terms"
          element={<PageRoute pageKey="terms" Lazy={TermsPage} initialPage={initialPage} />}
        />
        <Route
          path="*"
          element={<PageRoute pageKey="notFound" Lazy={NotFoundPage} initialPage={initialPage} />}
        />
      </Route>
    </Routes>
  )
}
