import { Outlet, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'

const Chatbot = lazy(() => import('../chatbot/Chatbot'))

export default function Layout() {
  const { pathname, hash } = useLocation()
  const [chatbotReady, setChatbotReady] = useState(false)

  useEffect(() => {
    if (hash) {
      const frame = window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      })
      return () => window.cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  useEffect(() => {
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(() => setChatbotReady(true), { timeout: 2500 })
    } else {
      timeoutId = setTimeout(() => setChatbotReady(true), 1200)
    }

    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-white">
      <Header />
      <main className="w-full min-w-0 max-w-full flex-1 overflow-x-clip pt-[calc(3.5rem+env(safe-area-inset-top,0px))] pb-[env(safe-area-inset-bottom,0px)] sm:pt-[calc(4rem+env(safe-area-inset-top,0px))]">
        <Outlet />
      </main>
      <Footer />
      {chatbotReady ? (
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      ) : null}
    </div>
  )
}
