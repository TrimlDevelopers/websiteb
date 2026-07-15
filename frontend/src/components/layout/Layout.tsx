import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import Chatbot from '../chatbot/Chatbot'

export default function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      el?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-white">
      <Header />
      <main className="w-full min-w-0 max-w-full flex-1 overflow-x-clip pt-[calc(3.5rem+env(safe-area-inset-top,0px))] pb-[env(safe-area-inset-bottom,0px)] sm:pt-[calc(4rem+env(safe-area-inset-top,0px))]">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
