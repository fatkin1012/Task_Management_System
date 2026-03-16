import { format, parseISO } from 'date-fns'

import type { Note, Reminder, Task } from '../../types'

interface ReminderListProps {
  title: string
  reminders: Reminder[]
  tasks: Task[]
  notes: Note[]
  onSnooze: (reminderId: string, minutes: number) => void
  onStatus: (reminderId: string, status: 'dismissed' | 'delivered') => void
  onDelete: (reminderId: string) => void
}

export function ReminderList({
  title,
  reminders,
  tasks,
  notes,
  onSnooze,
  onStatus,
  onDelete,
}: ReminderListProps) {
  const taskLookup = new Map(tasks.map((task) => [task.id, task.title]))
  const noteLookup = new Map(notes.map((note) => [note.id, note.title]))

  return (
    <section className="space-y-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
      {reminders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          No reminders in this section.
        </p>
      ) : (
        reminders.map((reminder) => (
          <article key={reminder.id} className="rounded-2xl bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{reminder.message}</p>
            <p className="mt-1 text-xs text-slate-500">
              {format(parseISO(reminder.snoozedUntil ?? reminder.remindAt), 'MMM d, p')}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              {reminder.taskId ? (
                <span className="rounded-full bg-sky-100 px-2 py-1 text-sky-700">
                  Task: {taskLookup.get(reminder.taskId) ?? 'Unknown'}
                </span>
              ) : null}
              {reminder.noteId ? (
                <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-700">
                  Note: {noteLookup.get(reminder.noteId) ?? 'Unknown'}
                </span>
              ) : null}
              <span className="rounded-full bg-white px-2 py-1 text-slate-600 ring-1 ring-slate-200">
                {reminder.status}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => onSnooze(reminder.id, 10)}
                className="rounded-lg bg-white px-2 py-1 text-slate-700 ring-1 ring-slate-200"
              >
                Snooze 10m
              </button>
              <button
                type="button"
                onClick={() => onStatus(reminder.id, 'delivered')}
                className="rounded-lg bg-emerald-100 px-2 py-1 text-emerald-700"
              >
                Mark done
              </button>
              <button
                type="button"
                onClick={() => onStatus(reminder.id, 'dismissed')}
                className="rounded-lg bg-amber-100 px-2 py-1 text-amber-700"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => onDelete(reminder.id)}
                className="rounded-lg bg-rose-100 px-2 py-1 text-rose-700"
              >
                Delete
              </button>
            </div>
          </article>
        ))
      )}
    </section>
  )
}