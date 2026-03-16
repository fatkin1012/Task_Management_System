import { format, isToday, parseISO } from 'date-fns'

import type { FocusSession, Task } from '../../types'

interface FocusSessionHistoryProps {
  sessions: FocusSession[]
  tasks: Task[]
}

export function FocusSessionHistory({ sessions, tasks }: FocusSessionHistoryProps) {
  const taskLookup = new Map(tasks.map((task) => [task.id, task.title]))
  const todaySessions = sessions.filter(
    (session) => session.startedAt && isToday(parseISO(session.startedAt)),
  )

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Session history</h3>
      <div className="mt-3 space-y-2">
        {todaySessions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No sessions recorded today.
          </p>
        ) : (
          todaySessions.map((session) => (
            <article key={session.id} className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">
                  {session.mode.replace('_', ' ')} • {session.durationMinutes} min
                </p>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    session.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {session.completed ? 'completed' : 'stopped'}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {session.startedAt ? format(parseISO(session.startedAt), 'p') : 'No start time'}
                {session.endedAt ? ` - ${format(parseISO(session.endedAt), 'p')}` : ''}
              </p>
              {session.taskId ? (
                <p className="mt-1 text-xs text-sky-700">Task: {taskLookup.get(session.taskId) ?? 'Unknown'}</p>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  )
}