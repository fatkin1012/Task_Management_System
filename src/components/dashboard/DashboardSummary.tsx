import { DistributionCard } from './DistributionCard'
import { MetricCard } from './MetricCard'
import { ProductivitySummaryPanel } from './ProductivitySummaryPanel'

interface DashboardSummaryProps {
  dueTodayCount: number
  overdueCount: number
  completedTodayCount: number
  upcomingCount: number
  totalTaskCount: number
  doneTaskCount: number
  urgentTaskCount: number
  blockedTaskCount: number
  inboxTaskCount: number
  completionRate: number
  nextFreeTimeSuggestion: string | null
  focusTimeTodayMinutes?: number
  workloadMinutesToday?: number
  workloadByCategory?: Array<{ label: string; value: number }>
  priorityDistribution?: Array<{ label: string; value: number }>
}

export function DashboardSummary(props: DashboardSummaryProps) {
  const topRow = [
    { label: 'Due today', value: props.dueTodayCount, tone: 'neutral' as const },
    { label: 'Overdue', value: props.overdueCount, tone: 'danger' as const },
    { label: 'Completed today', value: props.completedTodayCount, tone: 'success' as const },
    { label: 'Upcoming', value: props.upcomingCount, tone: 'neutral' as const },
    { label: 'Blocked', value: props.blockedTaskCount, tone: 'warning' as const },
    { label: 'Inbox', value: props.inboxTaskCount, tone: 'neutral' as const },
  ]

  return (
    <section className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {topRow.map((item) => (
          <MetricCard key={item.label} label={item.label} value={item.value} tone={item.tone} />
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
        <ProductivitySummaryPanel
          completionRate={props.completionRate}
          nextFreeTimeSuggestion={props.nextFreeTimeSuggestion}
          focusTimeTodayMinutes={props.focusTimeTodayMinutes}
          workloadMinutesToday={props.workloadMinutesToday}
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <MetricCard
            label="Open work"
            value={props.totalTaskCount - props.doneTaskCount}
            hint={`${props.doneTaskCount} of ${props.totalTaskCount} completed`}
          />
          <MetricCard
            label="Urgent open"
            value={props.urgentTaskCount}
            tone={props.urgentTaskCount > 0 ? 'danger' : 'success'}
            hint="High-priority tasks still active"
          />
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <DistributionCard
          title="Workload by category"
          items={props.workloadByCategory ?? []}
          formatValue={(value) => `${value} min`}
        />
        <DistributionCard title="Priority distribution" items={props.priorityDistribution ?? []} />
      </div>
    </section>
  )
}
