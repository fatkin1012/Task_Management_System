import type { TaskPriority } from '../../types'

const colorMap: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-sky-100 text-sky-700',
  high: 'bg-amber-100 text-amber-700',
  urgent: 'bg-rose-100 text-rose-700',
}

interface PriorityBadgeProps {
  priority: TaskPriority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colorMap[priority]}`}>
      {priority.replace('_', ' ')}
    </span>
  )
}
