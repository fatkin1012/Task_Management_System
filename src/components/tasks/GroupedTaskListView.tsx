import type { TaskGroup } from '../../hooks/useTaskGroups'
import { TaskListView } from './TaskListView'

interface GroupedTaskListViewProps {
  groups: TaskGroup[]
  onSelectTask: (taskId: string) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onDuplicateTask: (taskId: string) => void
}

export function GroupedTaskListView({
  groups,
  onSelectTask,
  onToggleTask,
  onDeleteTask,
  onDuplicateTask,
}: GroupedTaskListViewProps) {
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.id} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              {group.label}
            </h3>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
              {group.tasks.length}
            </span>
          </div>
          <TaskListView
            tasks={group.tasks}
            onSelectTask={onSelectTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onDuplicateTask={onDuplicateTask}
          />
        </section>
      ))}
    </div>
  )
}