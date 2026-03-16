import { useEffect } from 'react'

import { TodayEventsPanel } from '../components/calendar/TodayEventsPanel'
import { SchedulePlannerPanel } from '../components/planner/SchedulePlannerPanel'
import { ModulePage } from '../components/ui/ModulePage'
import { usePlannerSettingsStore } from '../store/plannerSettingsStore'

export function CalendarPage() {
  const settings = usePlannerSettingsStore((state) => state.settings)
  const loadSettings = usePlannerSettingsStore((state) => state.loadSettings)
  const persistSettings = usePlannerSettingsStore((state) => state.persistSettings)
  const settingsLoaded = usePlannerSettingsStore((state) => state.isLoaded)

  useEffect(() => {
    void loadSettings()
  }, [loadSettings])

  useEffect(() => {
    if (settingsLoaded) {
      void persistSettings()
    }
  }, [persistSettings, settings, settingsLoaded])

  return (
    <ModulePage
      eyebrow="Calendar"
      title="Schedule planner"
      description="This route is reserved for the daily and weekly planner. It will combine Google Calendar events, scheduled task blocks, conflict detection, and suggested free slots."
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SchedulePlannerPanel />
        <TodayEventsPanel />
      </div>
    </ModulePage>
  )
}