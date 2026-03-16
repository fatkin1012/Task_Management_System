import { ArrowRight, Clock3 } from 'lucide-react'

import type { Task } from '../../types'

interface TodayTopPrioritiesProps {
  tasks: Task[]
  onSelectTask: (taskId: string) => void
}

export function TodayTopPriorities({ tasks, onSelectTask }: TodayTopPrioritiesProps) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Top 3 priorities</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Focus list for today</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {tasks.length} selected
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {tasks.map((task, index) => (
          <button
            key={task.id}
            type="button"
            onClick={() => onSelectTask(task.id)}
            className="rounded-2xl bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Priority {index + 1}</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{task.title}</p>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{task.description || 'No description yet.'}</p>
            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock3 size={12} />
                {task.estimatedDurationMinutes} min
              </span>
              <span className="inline-flex items-center gap-1 text-sky-700">
                Open
                <ArrowRight size={12} />
              </span>
            </div>
          </button>
        ))}
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 md:col-span-3">
            No active priorities. Capture a task or pull work from the inbox.
          </div>
        ) : null}
      </div>
    </section>
  )
}