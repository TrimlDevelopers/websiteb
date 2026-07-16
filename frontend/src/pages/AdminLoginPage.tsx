import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { adminLogin, fetchAdminMe } from '../api/adminAuth'
import { ApiError } from '../api/client'
import SEO from '../components/seo/SEO'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from &&
    String((location.state as { from?: string }).from).startsWith('/admin')
      ? String((location.state as { from?: string }).from)
      : '/admin/enquiries'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const [alreadyAuthed, setAlreadyAuthed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchAdminMe()
      .then(() => {
        if (!cancelled) setAlreadyAuthed(true)
      })
      .catch(() => {
        if (!cancelled) setAlreadyAuthed(false)
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminLogin(username.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Invalid username or password.')
      } else {
        setError('Unable to sign in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">
        Loading…
      </div>
    )
  }

  if (alreadyAuthed) {
    return <Navigate to="/admin/enquiries" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900 px-4">
      <SEO
        title="Admin Login"
        description="Tribound Tech admin sign-in."
        path="/admin/login"
        noindex
      />
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Tribound Tech
        </p>
        <h1 className="mt-2 text-2xl font-bold text-navy-900">Admin sign in</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your admin credentials to manage enquiries.
        </p>

        <label className="mt-6 block text-sm font-medium text-slate-700" htmlFor="admin-username">
          Username
        </label>
        <input
          id="admin-username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          required
          maxLength={128}
          disabled={loading}
        />

        <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="admin-password">
          Password
        </label>
        <div className="relative mt-1">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-11 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            required
            maxLength={256}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-800"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={loading}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
