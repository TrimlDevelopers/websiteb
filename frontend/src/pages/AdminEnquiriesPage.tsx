import { useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  deleteEnquiry,
  fetchEnquiries,
  fetchEnquiryStats,
  type Enquiry,
  type EnquiryStatus,
  updateEnquiryStatus,
} from '../api/adminEnquiries'
import SEO from '../components/seo/SEO'

type StatusFilter = EnquiryStatus | 'All'
type SortOption = 'newest' | 'oldest'

const STATUS_OPTIONS: EnquiryStatus[] = ['New', 'Contacted', 'Closed']

function statusBadgeClass(status: EnquiryStatus): string {
  switch (status) {
    case 'New':
      return 'bg-sky-500 text-white ring-2 ring-sky-200'
    case 'Contacted':
      return 'bg-amber-500 text-white ring-2 ring-amber-200'
    case 'Closed':
      return 'bg-emerald-600 text-white ring-2 ring-emerald-200'
    default:
      return 'bg-slate-400 text-white'
  }
}

function statusRowClass(status: EnquiryStatus): string {
  switch (status) {
    case 'New':
      return 'border-l-4 border-l-sky-500 bg-sky-50/70 hover:bg-sky-50'
    case 'Contacted':
      return 'border-l-4 border-l-amber-500 bg-amber-50/70 hover:bg-amber-50'
    case 'Closed':
      return 'border-l-4 border-l-emerald-600 bg-emerald-50/70 hover:bg-emerald-50'
    default:
      return 'border-l-4 border-l-slate-300 hover:bg-slate-50'
  }
}

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return value
  }
}

export default function AdminEnquiriesPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState<StatusFilter>('All')
  const [sort, setSort] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)

  const [items, setItems] = useState<Enquiry[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, closed: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [viewEnquiry, setViewEnquiry] = useState<Enquiry | null>(null)
  const [messagePopup, setMessagePopup] = useState<Enquiry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [list, statsRes] = await Promise.all([
        fetchEnquiries({ search, status, sort, page, limit: 10 }),
        fetchEnquiryStats(),
      ])
      setItems(list.items)
      setTotal(list.total)
      setTotalPages(list.totalPages)
      setStats(statsRes.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enquiries')
    } finally {
      setLoading(false)
    }
  }, [search, status, sort, page])

  useEffect(() => {
    void loadData()
  }, [loadData])

  function applySearch(e: FormEvent) {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
  }

  async function handleStatusChange(enquiry: Enquiry, next: EnquiryStatus) {
    if (next === enquiry.status) return
    setBusyId(enquiry.id)
    try {
      await updateEnquiryStatus(enquiry.id, next)
      await loadData()
      if (viewEnquiry?.id === enquiry.id) {
        setViewEnquiry({ ...enquiry, status: next })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setBusyId(null)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setBusyId(deleteTarget.id)
    try {
      await deleteEnquiry(deleteTarget.id)
      setDeleteTarget(null)
      if (viewEnquiry?.id === deleteTarget.id) setViewEnquiry(null)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete enquiry')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <SEO
        title="Enquiry Management"
        description="Internal enquiry management dashboard for Tribound Tech."
        path="/admin/enquiries"
        noindex
      />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            Tribound Tech
          </p>
          <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">Enquiry Management</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Total Enquiries',
              value: stats.total,
              card: 'border-slate-300 bg-white',
              valueClass: 'text-navy-900',
            },
            {
              label: 'New Enquiries',
              value: stats.new,
              card: 'border-sky-500 bg-sky-50',
              valueClass: 'text-sky-700',
            },
            {
              label: 'Contacted',
              value: stats.contacted,
              card: 'border-amber-500 bg-amber-50',
              valueClass: 'text-amber-700',
            },
            {
              label: 'Closed',
              value: stats.closed,
              card: 'border-emerald-600 bg-emerald-50',
              valueClass: 'text-emerald-700',
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`rounded-xl border-l-4 p-4 shadow-sm ${card.card}`}
            >
              <p className="text-sm font-medium text-slate-600">{card.label}</p>
              <p className={`mt-1 text-3xl font-bold ${card.valueClass}`}>{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-xl bg-white p-4 shadow-sm sm:p-5">
          <form
            onSubmit={applySearch}
            className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-500" htmlFor="search">
                  Search (name, email, company)
                </label>
                <input
                  id="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search…"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => {
                    setPage(1)
                    setStatus(e.target.value as StatusFilter)
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="All">All</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500" htmlFor="sort">
                  Sort
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => {
                    setPage(1)
                    setSort(e.target.value as SortOption)
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Search
            </button>
          </form>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-3 font-semibold">Name</th>
                  <th className="px-3 py-3 font-semibold">Email</th>
                  <th className="hidden px-3 py-3 font-semibold md:table-cell">Phone</th>
                  <th className="hidden px-3 py-3 font-semibold lg:table-cell">Company</th>
                  <th className="hidden px-3 py-3 font-semibold lg:table-cell">Service</th>
                  <th className="hidden px-3 py-3 font-semibold md:table-cell">Message</th>
                  <th className="px-3 py-3 font-semibold">Created</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-8 text-center text-slate-500">
                      Loading enquiries…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-8 text-center text-slate-500">
                      No enquiries found.
                    </td>
                  </tr>
                ) : (
                  items.map((enquiry) => (
                    <tr
                      key={enquiry.id}
                      className={`border-b border-slate-100 ${statusRowClass(enquiry.status)}`}
                    >
                      <td className="px-3 py-3 font-medium text-navy-900">{enquiry.name}</td>
                      <td className="px-3 py-3">{enquiry.email}</td>
                      <td className="hidden px-3 py-3 md:table-cell">{enquiry.phone || '—'}</td>
                      <td className="hidden px-3 py-3 lg:table-cell">{enquiry.company || '—'}</td>
                      <td className="hidden px-3 py-3 lg:table-cell">{enquiry.service || '—'}</td>
                      <td className="hidden max-w-[14rem] px-3 py-3 md:table-cell">
                        <button
                          type="button"
                          onClick={() => setMessagePopup(enquiry)}
                          title="Click to view full message"
                          className="w-full truncate text-left text-brand-700 hover:underline"
                        >
                          {enquiry.message}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                        {formatDate(enquiry.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-wide ${statusBadgeClass(enquiry.status)}`}
                        >
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewEnquiry(enquiry)}
                            className="text-xs font-semibold text-brand-700 hover:underline"
                          >
                            View
                          </button>
                          <select
                            aria-label={`Change status for ${enquiry.name}`}
                            value={enquiry.status}
                            disabled={busyId === enquiry.id}
                            onChange={(e) =>
                              void handleStatusChange(enquiry, e.target.value as EnquiryStatus)
                            }
                            className="rounded border border-slate-300 px-1.5 py-1 text-xs"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(enquiry)}
                            className="text-xs font-semibold text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <p>
              Showing page {page} of {totalPages} · {total} total
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>

      {viewEnquiry ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold text-navy-900">Enquiry details</h2>
              <button
                type="button"
                onClick={() => setViewEnquiry(null)}
                className="text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              {(
                [
                  ['Name', viewEnquiry.name],
                  ['Email', viewEnquiry.email],
                  ['Phone', viewEnquiry.phone || '—'],
                  ['Company', viewEnquiry.company || '—'],
                  ['Service', viewEnquiry.service || '—'],
                  ['Created', formatDate(viewEnquiry.createdAt)],
                  ['Updated', formatDate(viewEnquiry.updatedAt)],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                  </dt>
                  <dd className="mt-0.5 text-slate-800">{value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-wide ${statusBadgeClass(viewEnquiry.status)}`}
                  >
                    {viewEnquiry.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Message
                </dt>
                <dd className="mt-0.5 whitespace-pre-wrap text-slate-800">{viewEnquiry.message}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <select
                value={viewEnquiry.status}
                disabled={busyId === viewEnquiry.id}
                onChange={(e) =>
                  void handleStatusChange(viewEnquiry, e.target.value as EnquiryStatus)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(viewEnquiry)
                }}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {messagePopup ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setMessagePopup(null)}
          role="presentation"
        >
          <div
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="message-popup-title"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="message-popup-title" className="text-lg font-bold text-navy-900">
                  Full message
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  From {messagePopup.name} · {messagePopup.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMessagePopup(null)}
                className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                Close
              </button>
            </div>
            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">
              {messagePopup.message}
            </p>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-navy-900">Delete enquiry?</h2>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently delete the enquiry from{' '}
              <span className="font-medium">{deleteTarget.name}</span> ({deleteTarget.email}).
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === deleteTarget.id}
                onClick={() => void confirmDelete()}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
