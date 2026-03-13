import { format, parseISO } from 'date-fns'

import type { Task } from '../../types'
import { PriorityBadge } from '../ui/PriorityBadge'

interface TaskListViewProps {
  tasks: Task[]
  onSelectTask: (taskId: string) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskListView({
  tasks,
  onSelectTask,
  onToggleTask,
  onDeleteTask,
}: TaskListViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        <p className="font-medium text-slate-700">No tasks match current filters.</p>
        <p className="mt-2 text-sm">Try clearing filters or add a new task.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <article
          key={task.id}
          className="w-full rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={task.status === 'done'}
                onChange={() => onToggleTask(task.id)}
                className="mt-1 size-4"
                aria-label={`Mark ${task.title} as done`}
              />
              <button type="button" onClick={() => onSelectTask(task.id)}>
                <p
                  className={`text-base font-semibold ${
                    task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </p>
                <p className="mt-1 text-sm text-slate-600 line-clamp-1">{task.description}</p>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={task.priority} />
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
            <span className="rounded-full bg-slate-100 px-2 py-1">{task.category}</span>
            <span>
              {task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : 'No due date'}
            </span>
            <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700">{task.status}</span>
          </div>
        </article>
      ))}
    </div>
  )
}
