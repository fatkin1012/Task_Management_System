import type { NormalizedTaskFormValues } from '../../../lib/validation/taskFormSchema'
import type { Task, TaskStatus } from '../../../types'

export type TaskUpdatePatch = Partial<
  NormalizedTaskFormValues & {
    linkedCalendarEventId: string | null
    notesId: string | null
    order: number
  }
>

export const createTaskId = (prefix = 'task') =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}`

export const resequenceTasks = (tasks: Task[]): Task[] =>
  tasks.map((task, index) => ({
    ...task,
    order: index,
  }))

export const buildTaskFromFormInput = (
  input: NormalizedTaskFormValues,
  nowIso: string,
): Task => ({
  id: createTaskId('task'),
  title: input.title,
  description: input.description,
  status: input.status,
  priority: input.priority,
  dueDate: input.dueDate,
  dueTime: input.dueTime,
  estimatedDurationMinutes: input.estimatedDurationMinutes,
  category: input.category,
  projectId: input.projectId,
  tags: input.tags,
  subtasks: [],
  reminder: input.reminder,
  pinned: input.pinned,
  recurringRule: null,
  createdAt: nowIso,
  updatedAt: nowIso,
  linkedCalendarEventId: null,
  notesId: null,
  order: 0,
})

export const buildDuplicatedTask = (sourceTask: Task, nowIso: string): Task => ({
  ...sourceTask,
  id: createTaskId('task'),
  title: `${sourceTask.title} (Copy)`,
  status: 'todo',
  linkedCalendarEventId: null,
  createdAt: nowIso,
  updatedAt: nowIso,
  order: 0,
})

export const updateTaskCollection = (
  tasks: Task[],
  taskId: string,
  patch: TaskUpdatePatch,
  nowIso: string,
) =>
  tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          ...patch,
          updatedAt: nowIso,
        }
      : task,
  )

export const removeTaskFromCollection = (tasks: Task[], taskId: string) =>
  resequenceTasks(tasks.filter((task) => task.id !== taskId))

export const toggleTaskCompletionInCollection = (
  tasks: Task[],
  taskId: string,
  nowIso: string,
) : Task[] =>
  tasks.map((task) => {
    if (task.id !== taskId) {
      return task
    }

    const isDone = task.status === 'done'
    const nextTask: Task = {
      ...task,
      status: isDone ? 'todo' : 'done',
      updatedAt: nowIso,
    }

    return nextTask
  })

export const moveTaskInCollection = (
  tasks: Task[],
  taskId: string,
  nextStatus: TaskStatus,
  nowIso: string,
  overTaskId?: string | null,
) => {
  const fromIndex = tasks.findIndex((task) => task.id === taskId)
  if (fromIndex < 0) {
    return tasks
  }

  const movingTask = tasks[fromIndex]
  const remaining = tasks.filter((task) => task.id !== taskId)

  const updatedTask: Task = {
    ...movingTask,
    status: nextStatus,
    updatedAt: nowIso,
  }

  let targetIndex = remaining.length

  if (overTaskId) {
    const overIndex = remaining.findIndex((task) => task.id === overTaskId)
    if (overIndex >= 0) {
      targetIndex = overIndex
    }
  } else {
    const lastSameStatusIndex = remaining.reduce(
      (lastIndex, task, index) => (task.status === nextStatus ? index : lastIndex),
      -1,
    )
    targetIndex = lastSameStatusIndex >= 0 ? lastSameStatusIndex + 1 : remaining.length
  }

  remaining.splice(targetIndex, 0, updatedTask)
  return resequenceTasks(remaining)
}
