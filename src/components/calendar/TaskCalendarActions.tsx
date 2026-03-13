import { addDays, endOfDay, format, formatISO, parseISO, startOfDay } from 'date-fns'

import { useCreateGoogleCalendarEvent, useScheduleSuggestion } from '../../hooks/useGoogleCalendar'
import { useTaskStore } from '../../store/taskStore'
import { useUiStore } from '../../store/uiStore'
import type { Task } from '../../types'

interface TaskCalendarActionsProps {
  task: Task
}

export function TaskCalendarActions({ task }: TaskCalendarActionsProps) {
  const calendarConnection = useUiStore((state) => state.calendarConnection)
  const updateTask = useTaskStore((state) => state.updateTask)

  const createEventMutation = useCreateGoogleCalendarEvent()
  const suggestionMutation = useScheduleSuggestion()

  const suggestion = suggestionMutation.data

  const handleSuggestSchedule = () => {
    const rangeStart = formatISO(startOfDay(new Date()))
    const rangeEnd = formatISO(endOfDay(addDays(new Date(), 1)))

    suggestionMutation.mutate({
      durationMinutes: task.estimatedDurationMinutes,
      rangeStart,
      rangeEnd,
    })
  }

  const handleCreateEvent = () => {
    createEventMutation.mutate(
      {
        task,
        preferredStart: suggestion?.start,
      },
      {
        onSuccess: (event) => {
          updateTask(task.id, { linkedCalendarEventId: event.id })
        },
      },
    )
  }

  if (!calendarConnection.connected) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-600">
        Connect Google Calendar to enable scheduling and event creation.
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-600">
        Connected as <span className="font-medium text-slate-800">{calendarConnection.accountEmail}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSuggestSchedule}
          disabled={suggestionMutation.isPending}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-60"
        >
          {suggestionMutation.isPending ? 'Finding slot...' : 'Suggest schedule slot'}
        </button>
        <button
          type="button"
          onClick={handleCreateEvent}
          disabled={createEventMutation.isPending}
          className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
        >
          {createEventMutation.isPending
            ? 'Creating event...'
            : 'Create Google Calendar Event'}
        </button>
      </div>

      {suggestion && (
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-2 text-xs text-sky-900">
          <p className="font-semibold">Suggested time</p>
          <p>
            {format(parseISO(suggestion.start), 'MMM d, p')} -{' '}
            {format(parseISO(suggestion.end), 'p')}
          </p>
          <p className="mt-1">{suggestion.reason}</p>
        </div>
      )}

      {task.linkedCalendarEventId && (
        <p className="text-xs text-emerald-700">
          Linked calendar event: <span className="font-medium">{task.linkedCalendarEventId}</span>
        </p>
      )}
    </div>
  )
}
