import { useMemo, useState } from 'react'

import { useFocusTimer } from '../../hooks/useFocusTimer'
import { usePlannerSettingsStore } from '../../store/plannerSettingsStore'
import { useTaskStore } from '../../store/taskStore'
import type { FocusSessionMode } from '../../types'

interface FocusTimerPanelProps {
  onStart: (input: {
    taskId: string | null
    mode: FocusSessionMode
    durationMinutes: number
    breakDurationMinutes: number
  }) => void
  onStop: (completed: boolean) => void
}

const formatSeconds = (seconds: number) => {
  const safeSeconds = Math.max(seconds, 0)
  const minutes = Math.floor(safeSeconds / 60)
  const remainder = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

export function FocusTimerPanel({ onStart, onStop }: FocusTimerPanelProps) {
  const tasks = useTaskStore((state) => state.tasks)
  const settings = usePlannerSettingsStore((state) => state.settings)
  const { activeSession, remainingSeconds, isComplete } = useFocusTimer()

  const [mode, setMode] = useState<FocusSessionMode>('pomodoro')
  const [duration, setDuration] = useState(settings.defaultFocusMinutes)
  const [breakDuration, setBreakDuration] = useState(settings.breakMinutes)
  const [taskId, setTaskId] = useState('')

  const activeTaskTitle = useMemo(() => {
    if (!activeSession?.taskId) {
      return null
    }
    const match = tasks.find((task) => task.id === activeSession.taskId)
    return match?.title ?? null
  }, [activeSession?.taskId, tasks])

  return (
    <section className="space-y-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Focus timer</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{formatSeconds(remainingSeconds)}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {activeSession
            ? `Running ${activeSession.mode.replace('_', ' ')} session${activeTaskTitle ? ` for ${activeTaskTitle}` : ''}`
            : 'Start a session to track deep work and pomodoro cycles.'}
        </p>
        {isComplete && activeSession ? (
          <p className="mt-2 text-sm font-medium text-emerald-700">Session target reached. Mark it complete.</p>
        ) : null}
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Mode</label>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as FocusSessionMode)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          >
            <option value="pomodoro">Pomodoro</option>
            <option value="deep_work">Deep work</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Bind to task</label>
          <select
            value={taskId}
            onChange={(event) => setTaskId(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          >
            <option value="">No task</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Duration (minutes)
          <input
            type="number"
            min={5}
            step={5}
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Break (minutes)
          <input
            type="number"
            min={1}
            step={1}
            value={breakDuration}
            onChange={(event) => setBreakDuration(Number(event.target.value))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            onStart({
              taskId: taskId || null,
              mode,
              durationMinutes: duration,
              breakDurationMinutes: breakDuration,
            })
          }
          disabled={Boolean(activeSession)}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Start session
        </button>
        <button
          type="button"
          onClick={() => onStop(true)}
          disabled={!activeSession}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Complete session
        </button>
        <button
          type="button"
          onClick={() => onStop(false)}
          disabled={!activeSession}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
        >
          Stop early
        </button>
      </div>
    </section>
  )
}