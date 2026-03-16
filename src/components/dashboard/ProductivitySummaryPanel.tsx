interface ProductivitySummaryPanelProps {
  completionRate: number
  nextFreeTimeSuggestion: string | null
  focusTimeTodayMinutes?: number
  workloadMinutesToday?: number
}

export function ProductivitySummaryPanel({
  completionRate,
  nextFreeTimeSuggestion,
  focusTimeTodayMinutes = 0,
  workloadMinutesToday = 0,
}: ProductivitySummaryPanelProps) {
  return (
    <article className="rounded-2xl bg-sky-50 p-5 text-slate-900 shadow-sm ring-1 ring-sky-100">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Productivity summary</p>
      <h3 className="mt-2 text-xl font-semibold text-slate-900">{completionRate}% completion rate</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {nextFreeTimeSuggestion ?? 'No scheduling suggestion available yet.'}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-3 ring-1 ring-sky-100">
          <p className="text-xs uppercase tracking-wide text-slate-500">Focus time today</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{focusTimeTodayMinutes} min</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-sky-100">
          <p className="text-xs uppercase tracking-wide text-slate-500">Workload due today</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{workloadMinutesToday} min</p>
        </div>
      </div>
    </article>
  )
}