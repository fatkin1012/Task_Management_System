interface TodayPlanningPanelProps {
  remainingWorkloadMinutes: number
  freeMinutes: number
  eventCount: number
  inboxTasksCount: number
  nextFreeBlockLabel: string | null
  suggestedNextTaskTitle: string | null
}

export function TodayPlanningPanel({
  remainingWorkloadMinutes,
  freeMinutes,
  eventCount,
  inboxTasksCount,
  nextFreeBlockLabel,
  suggestedNextTaskTitle,
}: TodayPlanningPanelProps) {
  const workloadHours = (remainingWorkloadMinutes / 60).toFixed(1)
  const freeHours = (freeMinutes / 60).toFixed(1)

  return (
    <section className="space-y-3">
      <article className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm ring-1 ring-slate-800">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Plan my day</p>
        <h2 className="mt-2 text-xl font-semibold">Protect the next block for what matters</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {suggestedNextTaskTitle
            ? `Suggested next task: ${suggestedNextTaskTitle}.`
            : 'No task suggestion yet. Start by clearing inbox or capturing the first action.'}
        </p>
        <div className="mt-4 space-y-2 text-sm text-slate-200">
          <p>Remaining workload today: {remainingWorkloadMinutes} min ({workloadHours} h)</p>
          <p>Available free time: {freeMinutes} min ({freeHours} h)</p>
          <p>Calendar events scheduled: {eventCount}</p>
          <p>Next free block: {nextFreeBlockLabel ?? 'Connect calendar to calculate'}</p>
        </div>
      </article>

      <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-slate-900">Daily execution hints</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Start with one of the top 3 priorities before clearing backlog.</li>
          <li>Keep at least one free block for deep work if your calendar allows it.</li>
          <li>Inbox items waiting for triage: {inboxTasksCount}.</li>
        </ul>
      </article>
    </section>
  )
}