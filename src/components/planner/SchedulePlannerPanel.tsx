import { format, formatISO, parseISO, set } from 'date-fns'
import { useMemo, useState } from 'react'

import { useCreateGoogleCalendarEvent, useScheduleSuggestion } from '../../hooks/useGoogleCalendar'
import { usePlannerSettingsStore } from '../../store/plannerSettingsStore'
import { useTaskStore } from '../../store/taskStore'
import { useUiStore } from '../../store/uiStore'

export function SchedulePlannerPanel() {
  const tasks = useTaskStore((state) => state.tasks)
  const updateTask = useTaskStore((state) => state.updateTask)
  const settings = usePlannerSettingsStore((state) => state.settings)
  const updateSettings = usePlannerSettingsStore((state) => state.updateSettings)
  const calendarConnection = useUiStore((state) => state.calendarConnection)

  const createEventMutation = useCreateGoogleCalendarEvent()
  const suggestionMutation = useScheduleSuggestion()
  const [selectedTaskId, setSelectedTaskId] = useState('')

  const unscheduledTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'done' && !task.linkedCalendarEventId),
    [tasks],
  )

  const selectedTask = unscheduledTasks.find((task) => task.id === selectedTaskId) ?? null

  const handleSuggest = () => {
    if (!selectedTask) {
      return
    }

    const rangeStart = formatISO(
      set(new Date(), { hours: settings.dayStartHour, minutes: 0, seconds: 0, milliseconds: 0 }),
    )
    const rangeEnd = formatISO(
      set(new Date(), { hours: settings.dayEndHour, minutes: 0, seconds: 0, milliseconds: 0 }),
    )

    suggestionMutation.mutate({
      durationMinutes: selectedTask.estimatedDurationMinutes,
      rangeStart,
      rangeEnd,
    })
  }

  const handleScheduleTask = () => {
    if (!selectedTask || !suggestionMutation.data) {
      return
    }

    createEventMutation.mutate(
      {
        task: selectedTask,
        preferredStart: suggestionMutation.data.start,
      },
      {
        onSuccess: (event) => {
          updateTask(selectedTask.id, { linkedCalendarEventId: event.id })
        },
      },
    )
  }

  return (
    <section className="space-y-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Scheduling planner</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Task-to-calendar assistant</h2>
        <p className="mt-1 text-sm text-slate-600">
          Pick an unscheduled task, get a suggested free slot, and map it to a calendar event.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Day starts at
          <input
            type="number"
            min={0}
            max={23}
            value={settings.dayStartHour}
            onChange={(event) => updateSettings({ dayStartHour: Number(event.target.value) })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Day ends at
          <input
            type="number"
            min={0}
            max={23}
            value={settings.dayEndHour}
            onChange={(event) => updateSettings({ dayEndHour: Number(event.target.value) })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </label>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Unscheduled task</label>
        <select
          value={selectedTaskId}
          onChange={(event) => setSelectedTaskId(event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        >
          <option value="">Select task</option>
          {unscheduledTasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title} ({task.estimatedDurationMinutes}m)
            </option>
          ))}
        </select>
      </div>

      {!calendarConnection.connected ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Connect Google Calendar in the events panel to enable task-to-event scheduling.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSuggest}
          disabled={!selectedTask || suggestionMutation.isPending}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
        >
          {suggestionMutation.isPending ? 'Finding slot...' : 'Suggest free slot'}
        </button>
        <button
          type="button"
          onClick={handleScheduleTask}
          disabled={!selectedTask || !suggestionMutation.data || createEventMutation.isPending}
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {createEventMutation.isPending ? 'Scheduling...' : 'Schedule task block'}
        </button>
      </div>

      {suggestionMutation.data ? (
        <div className="rounded-2xl bg-sky-50 p-3 text-sm text-sky-900">
          <p className="font-semibold">Suggested slot</p>
          <p>
            {format(parseISO(suggestionMutation.data.start), 'p')} - {format(parseISO(suggestionMutation.data.end), 'p')}
          </p>
          <p className="mt-1 text-xs">{suggestionMutation.data.reason}</p>
        </div>
      ) : null}
    </section>
  )
}