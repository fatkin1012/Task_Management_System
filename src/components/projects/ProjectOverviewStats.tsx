interface ProjectOverviewStatsProps {
  totalProjects: number
  activeProjects: number
  atRiskProjects: number
  unassignedTasks: number
}

const cardTone: Record<'neutral' | 'danger' | 'warning' | 'success', string> = {
  neutral: 'bg-white ring-slate-200 text-slate-900',
  danger: 'bg-rose-50 ring-rose-200 text-rose-900',
  warning: 'bg-amber-50 ring-amber-200 text-amber-900',
  success: 'bg-emerald-50 ring-emerald-200 text-emerald-900',
}

export function ProjectOverviewStats({
  totalProjects,
  activeProjects,
  atRiskProjects,
  unassignedTasks,
}: ProjectOverviewStatsProps) {
  const cards = [
    { label: 'Projects', value: totalProjects, tone: 'neutral' as const },
    { label: 'Active', value: activeProjects, tone: 'success' as const },
    { label: 'At risk', value: atRiskProjects, tone: atRiskProjects > 0 ? ('danger' as const) : ('success' as const) },
    { label: 'Unassigned tasks', value: unassignedTasks, tone: unassignedTasks > 0 ? ('warning' as const) : ('neutral' as const) },
  ]

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.label} className={`rounded-2xl p-4 shadow-sm ring-1 ${cardTone[card.tone]}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">{card.label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight">{card.value}</p>
        </article>
      ))}
    </section>
  )
}
