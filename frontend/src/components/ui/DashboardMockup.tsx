export default function DashboardMockup() {
  return (
    <div className="animate-float relative w-full max-w-lg sm:max-w-xl lg:max-w-none">
      <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-blue-500/15 sm:rounded-2xl sm:p-2 md:rounded-3xl md:p-3">
        <div className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50 sm:rounded-xl">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 sm:px-4 sm:py-2.5">
            <div className="flex shrink-0 gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400 sm:h-2.5 sm:w-2.5" />
              <span className="h-2 w-2 rounded-full bg-yellow-400 sm:h-2.5 sm:w-2.5" />
              <span className="h-2 w-2 rounded-full bg-green-400 sm:h-2.5 sm:w-2.5" />
            </div>
            <span className="truncate text-[10px] font-semibold text-slate-600 sm:text-xs">
              TriMaint CMMS Dashboard
            </span>
          </div>

          <div className="grid grid-cols-12">
            <div className="col-span-3 hidden border-r border-slate-200 bg-white p-2 sm:block sm:p-3">
              <div className="space-y-1.5 sm:space-y-2">
                {['Dashboard', 'Assets', 'Work Orders', 'Reports'].map((item, i) => (
                  <div
                    key={item}
                    className={`rounded-md px-2 py-1 text-[9px] font-medium sm:py-1.5 sm:text-[10px] ${
                      i === 0 ? 'bg-brand-500 text-white' : 'text-slate-500'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 p-2.5 sm:col-span-9 sm:p-3">
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
                {[
                  { label: 'Total Assets', value: '248' },
                  { label: 'Work Orders', value: '47' },
                  { label: 'Downtime', value: '2.4h' },
                  { label: 'Cost Saved', value: '₹12L' },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg border border-slate-200 bg-white p-1.5 sm:p-2">
                    <p className="truncate text-[10px] text-slate-600 sm:text-[11px]">{m.label}</p>
                    <p className="text-sm font-bold text-brand-700 sm:text-base">{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                <div className="rounded-lg border border-slate-200 bg-white p-2 col-span-1 sm:col-span-3">
                  <p className="text-[10px] font-medium text-slate-500 sm:text-xs">Maintenance Overview</p>
                  <div className="mt-2 flex h-12 items-end gap-1 sm:h-12">
                    {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-brand-500/80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-2 col-span-1 sm:col-span-2">
                  <p className="text-[10px] font-medium text-slate-500 sm:text-xs">Asset Health</p>
                  <div className="relative mx-auto mt-1 h-12 w-12 sm:h-12 sm:w-12">
                    <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#007bff"
                        strokeWidth="3"
                        strokeDasharray="77 100"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-brand-700 sm:text-xs">
                      88%
                    </span>
                  </div>
                  <p className="text-center text-[10px] font-medium text-emerald-700 sm:text-xs">Good</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
