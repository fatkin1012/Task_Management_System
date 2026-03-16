import { TaskListView } from '../tasks/TaskListView'
import type { Task } from '../../types'

interface TodayTaskBucketProps {
  title: string
  description: string
  tasks: Task[]
  emptyMessage: string
  onSelectTask: (taskId: string) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onDuplicateTask: (taskId: string) => void
}

export function TodayTaskBucket({
  title,
  description,
  tasks,
  emptyMessage,
  onSelectTask,
  onToggleTask,
  onDeleteTask,
  onDuplicateTask,
}: TodayTaskBucketProps) {
  return (
    <section className="space-y-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </header>
      {tasks.length > 0 ? (
        <TaskListView
          tasks={tasks}
          onSelectTask={onSelectTask}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onDuplicateTask={onDuplicateTask}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          {emptyMessage}
        </div>
      )}
    </section>
  )
}