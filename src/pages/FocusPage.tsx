import { isToday, parseISO } from 'date-fns'
import { useEffect } from 'react'

import { FocusSessionHistory } from '../components/focus/FocusSessionHistory'
import { FocusTimerPanel } from '../components/focus/FocusTimerPanel'
import { ModulePage } from '../components/ui/ModulePage'
import { useFocusStore } from '../store/focusStore'
import { usePlannerSettingsStore } from '../store/plannerSettingsStore'
import { useTaskStore } from '../store/taskStore'

export function FocusPage() {
  const tasks = useTaskStore((state) => state.tasks)

  const sessions = useFocusStore((state) => state.sessions)
  const loadSessions = useFocusStore((state) => state.loadSessions)
  const persistSessions = useFocusStore((state) => state.persistSessions)
  const startSession = useFocusStore((state) => state.startSession)
  const stopSession = useFocusStore((state) => state.stopSession)
  const isLoaded = useFocusStore((state) => state.isLoaded)

  const plannerSettings = usePlannerSettingsStore((state) => state.settings)
  const loadPlannerSettings = usePlannerSettingsStore((state) => state.loadSettings)
  const persistPlannerSettings = usePlannerSettingsStore((state) => state.persistSettings)
  const plannerSettingsLoaded = usePlannerSettingsStore((state) => state.isLoaded)

  useEffect(() => {
    void loadSessions()
    void loadPlannerSettings()
  }, [loadPlannerSettings, loadSessions])

  useEffect(() => {
    if (isLoaded) {
      void persistSessions()
    }
  }, [isLoaded, persistSessions, sessions])

  useEffect(() => {
    if (plannerSettingsLoaded) {
      void persistPlannerSettings()
    }
  }, [persistPlannerSettings, plannerSettings, plannerSettingsLoaded])

  const todayFocusMinutes = sessions
    .filter((session) => session.completed && session.startedAt && isToday(parseISO(session.startedAt)))
    .reduce((total, session) => total + session.durationMinutes, 0)

  return (
    <ModulePage
      eyebrow="Focus"
      title="Pomodoro and deep work"
      description="Run focused work sessions, bind sessions to tasks, and prepare a daily focus log that feeds the dashboard."
    >
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <FocusTimerPanel onStart={startSession} onStop={stopSession} />
        <div className="space-y-4">
          <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Daily progress</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{todayFocusMinutes} focused minutes</h2>
            <p className="mt-2 text-sm text-slate-600">
              Completed sessions contribute to this total and can be compared with workload in the dashboard.
            </p>
          </article>
          <FocusSessionHistory sessions={sessions} tasks={tasks} />
        </div>
      </div>
    </ModulePage>
  )
}