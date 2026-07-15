import type { CSSProperties } from 'react'
import { CheckCircle2, Monitor, Smartphone, Zap } from 'lucide-react'

export default function WhyTriMLVisual() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden lg:max-w-none">
      <div
        aria-hidden
        className="why-orb pointer-events-none absolute left-0 top-4 h-28 w-28 rounded-full bg-brand-500/10 blur-3xl sm:-left-6 sm:h-48 sm:w-48"
      />
      <div
        aria-hidden
        className="why-orb why-orb--secondary pointer-events-none absolute bottom-16 right-0 h-24 w-24 rounded-full bg-blue-300/15 blur-3xl sm:-right-4 sm:h-36 sm:w-36"
      />

      <div className="why-visual-enter relative z-10 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60 sm:rounded-2xl sm:p-4 lg:rounded-3xl lg:p-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="flex shrink-0 gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400 sm:h-2.5 sm:w-2.5" />
            <span className="h-2 w-2 rounded-full bg-amber-400 sm:h-2.5 sm:w-2.5" />
            <span className="h-2 w-2 rounded-full bg-emerald-400 sm:h-2.5 sm:w-2.5" />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <Monitor size={16} className="shrink-0 text-brand-500" />
            <span className="truncate text-sm font-semibold text-navy-900">Responsive Design</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-brand-50/30 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Project Health
              </p>
              <p className="mt-0.5 text-lg font-bold text-navy-900 sm:text-xl">On Track</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/10">
              <CheckCircle2 size={18} className="text-brand-500" />
            </div>
          </div>

          <div className="mt-4 flex h-14 items-end gap-1.5 sm:h-16">
            {[35, 55, 45, 72, 60, 85, 78].map((height, index) => (
              <div
                key={index}
                className="why-chart-bar flex-1 rounded-t bg-gradient-to-t from-brand-600 to-brand-400"
                style={
                  {
                    '--bar-height': `${height}%`,
                    '--bar-delay': `${index * 70}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {['Design', 'Build', 'Launch'].map((phase, index) => (
              <div
                key={phase}
                className={`rounded-md py-1.5 text-center text-[10px] font-semibold sm:text-xs ${
                  index === 1
                    ? 'bg-brand-500 text-white'
                    : 'bg-white text-slate-500 ring-1 ring-slate-200'
                }`}
              >
                {phase}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="h-7 rounded-md bg-slate-100 sm:h-8" />
          <div className="h-7 rounded-md bg-slate-100 sm:h-8" />
          <div className="h-7 rounded-md bg-brand-500/15 ring-1 ring-brand-500/20 sm:h-8" />
        </div>
      </div>

      <div className="relative z-20 -mt-2 hidden w-full sm:-mt-4 sm:ml-auto sm:mr-6 sm:block sm:w-fit">
        <div className="animate-float rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg sm:p-3">
          <Smartphone size={14} className="mx-auto text-brand-500" />
          <div className="mt-2 h-14 w-9 rounded-md bg-gradient-to-b from-brand-500/20 to-brand-500/5 sm:h-16 sm:w-10">
            <div className="mx-auto mt-2 h-1 w-5 rounded-full bg-brand-500/25" />
            <div className="mx-1.5 mt-2 space-y-1">
              <div className="h-1 rounded-full bg-brand-500/35" />
              <div className="h-1 w-4/5 rounded-full bg-brand-500/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-center sm:gap-3">
        <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm sm:w-auto sm:min-w-[140px]">
          <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
          <span className="text-xs font-semibold text-slate-700">Quality Assured</span>
        </div>
        <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm sm:w-auto sm:min-w-[140px]">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-500/10">
            <Zap size={14} className="text-brand-500" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-slate-400">Performance</p>
            <p className="text-xs font-bold text-navy-900">99.9% Uptime</p>
          </div>
        </div>
      </div>
    </div>
  )
}
