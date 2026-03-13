import { useState } from 'react'

interface DashboardSummaryProps {
  dueTodayCount: number
  overdueCount: number
  completedTodayCount: number
  upcomingCount: number
  totalTaskCount: number
  doneTaskCount: number
  urgentTaskCount: number
  completionRate: number
  nextFreeTimeSuggestion: string | null
}

export function DashboardSummary(props: DashboardSummaryProps) {
  const [showMore, setShowMore] = useState(false)

  const primaryItems = [
    { label: 'Due today', value: props.dueTodayCount },
    { label: 'Overdue', value: props.overdueCount },
    { label: 'Completed today', value: props.completedTodayCount },
    { label: 'Upcoming', value: props.upcomingCount },
  ]

  const secondaryItems = [
    { label: 'Total tasks', value: props.totalTaskCount },
    { label: 'Done tasks', value: props.doneTaskCount },
    { label: 'Urgent open', value: props.urgentTaskCount },
  ]

  return (
    <section className="space-y-3">
      <div className="grid gap-3 md:grid-cols-4">
        {primaryItems.map((item) => (
          <article key={item.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-wider text-slate-500">Completion progress</p>
            <button
              type="button"
              onClick={() => setShowMore((open) => !open)}
              className="text-xs font-medium text-sky-700"
            >
              {showMore ? 'Hide details' : 'See details'}
            </button>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${props.completionRate}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {props.doneTaskCount} of {props.totalTaskCount} tasks complete ({props.completionRate}%)
          </p>
        </article>

        <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs uppercase tracking-wider text-slate-500">Scheduling tip</p>
          <p className="mt-2 text-sm text-sky-900">
            Next free time suggestion: {props.nextFreeTimeSuggestion ?? 'No suggestion available'}
          </p>
        </article>
      </div>

      {showMore ? (
        <div className="grid gap-3 md:grid-cols-3">
          {secondaryItems.map((item) => (
            <article key={item.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
