import { QuickCapturePanel } from '../tasks/QuickCapturePanel'
import { TodayEventsPanel } from '../calendar/TodayEventsPanel'
import { TodayPlanningPanel } from './TodayPlanningPanel'
import { TodayTaskBucket } from './TodayTaskBucket'
import { TodayTopPriorities } from './TodayTopPriorities'
import { useTodayAvailability } from '../../hooks/useTodayAvailability'
import { useTodayWorkspace } from '../../hooks/useTodayWorkspace'

interface TodayWorkspaceProps {
  onSelectTask: (taskId: string) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onDuplicateTask: (taskId: string) => void
}

export function TodayWorkspace({
  onSelectTask,
  onToggleTask,
  onDeleteTask,
  onDuplicateTask,
}: TodayWorkspaceProps) {
  const todayData = useTodayWorkspace()
  const availability = useTodayAvailability()

  return (
    <div className="space-y-4">
      <QuickCapturePanel />
      <TodayTopPriorities tasks={todayData.topPriorities} onSelectTask={onSelectTask} />

      <div className="grid gap-4 2xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <TodayTaskBucket
            title="Due today"
            description="Tasks that should land today. Use this list to keep the schedule realistic."
            tasks={todayData.dueTodayTasks}
            emptyMessage="Nothing is due today. Pull one item from your priorities or inbox."
            onSelectTask={onSelectTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onDuplicateTask={onDuplicateTask}
          />
          <TodayTaskBucket
            title="Overdue attention"
            description="Unfinished work that is already late and likely blocking the week."
            tasks={todayData.overdueTasks}
            emptyMessage="No overdue work right now."
            onSelectTask={onSelectTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onDuplicateTask={onDuplicateTask}
          />
        </div>

        <div className="space-y-4">
          <TodayPlanningPanel
            remainingWorkloadMinutes={todayData.remainingWorkloadMinutes}
            freeMinutes={availability.freeMinutes}
            eventCount={availability.eventCount}
            inboxTasksCount={todayData.inboxTasksCount}
            nextFreeBlockLabel={availability.nextFreeBlockLabel}
            suggestedNextTaskTitle={todayData.suggestedNextTask?.title ?? null}
          />
          <TodayEventsPanel />
        </div>
      </div>
    </div>
  )
}