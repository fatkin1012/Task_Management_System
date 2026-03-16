import { format, parseISO } from 'date-fns'

import type { ProjectSummary } from '../../hooks/useProjectSummaries'
import { PriorityBadge } from '../ui/PriorityBadge'

interface ProjectTaskPanelProps {
  project: ProjectSummary | null
  onSelectTask: (taskId: string) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onDuplicateTask: (taskId: string) => void
}

const statusStyles: Record<string, string> = {
  todo: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-sky-100 text-sky-700',
  waiting: 'bg-amber-100 text-amber-700',
  blocked: 'bg-rose-100 text-rose-700',
  done: 'bg-emerald-100 text-emerald-700',
}

export function ProjectTaskPanel({
  project,
  onSelectTask,
  onToggleTask,
  onDeleteTask,
  onDuplicateTask,
}: ProjectTaskPanelProps) {
  if (!project) {
    return null
  }

  return (
    <section className="space-y-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Project drilldown</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{project.title}</h2>
          <p className="mt-2 text-sm text-slate-600">
            {project.openCount} open tasks, {project.overdueCount} overdue, {project.dueTodayCount} due today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700">Primary category: {project.primaryCategory}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1">Total tasks: {project.totalCount}</span>
        </div>
      </header>

      <div className="space-y-3">
        {project.tasks.map((task) => (
          <article key={task.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={() => onToggleTask(task.id)}
                  className="mt-1 size-4"
                  aria-label={`Mark ${task.title} as done`}
                />
                <button type="button" onClick={() => onSelectTask(task.id)} className="text-left">
                  <p
                    className={`text-base font-semibold ${
                      task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{task.description}</p>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <PriorityBadge priority={task.priority} />
                <button
                  type="button"
                  onClick={() => onDuplicateTask(task.id)}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700">{task.category}</span>
              <span className={`rounded-full px-2 py-1 ${statusStyles[task.status] ?? 'bg-slate-100 text-slate-700'}`}>
                {task.status.replace('_', ' ')}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-1">{task.estimatedDurationMinutes} min</span>
              <span>
                {task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : 'No due date'}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
