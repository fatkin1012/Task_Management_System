import { seedTasks } from '../data/seedTasks'
import { safeLocalStorage } from '../lib/storage'
import type { Task } from '../types'
import type { TaskRepository } from './taskRepository'

const TASKS_STORAGE_KEY = 'task-planner.tasks.v1'

const normalizeTask = (task: Partial<Task>, index: number): Task => ({
  id: task.id ?? `task-${index + 1}`,
  title: task.title ?? 'Untitled task',
  description: task.description ?? '',
  status: task.status ?? 'todo',
  priority: task.priority ?? 'medium',
  dueDate: task.dueDate ?? null,
  dueTime: task.dueTime ?? null,
  estimatedDurationMinutes: task.estimatedDurationMinutes ?? 30,
  category: task.category ?? 'Inbox',
  projectId: task.projectId ?? null,
  tags: task.tags ?? [],
  subtasks: task.subtasks ?? [],
  reminder: task.reminder ?? null,
  pinned: task.pinned ?? false,
  recurringRule: task.recurringRule ?? null,
  createdAt: task.createdAt ?? new Date().toISOString(),
  updatedAt: task.updatedAt ?? task.createdAt ?? new Date().toISOString(),
  linkedCalendarEventId: task.linkedCalendarEventId ?? null,
  notesId: task.notesId ?? null,
  order: task.order ?? index,
})

const normalizeTasks = (tasks: Partial<Task>[]) =>
  tasks
    .map((task, index) => normalizeTask(task, index))
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
    .map((task, index) => ({ ...task, order: index }))

export class LocalStorageTaskRepository implements TaskRepository {
  async list(): Promise<Task[]> {
    const raw = safeLocalStorage.getItem(TASKS_STORAGE_KEY)
    if (!raw) {
      return normalizeTasks(seedTasks)
    }

    try {
      const parsed = JSON.parse(raw) as Partial<Task>[]
      return parsed.length > 0 ? normalizeTasks(parsed) : normalizeTasks(seedTasks)
    } catch {
      return normalizeTasks(seedTasks)
    }
  }

  async save(tasks: Task[]): Promise<void> {
    safeLocalStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(normalizeTasks(tasks)))
  }
}

export const taskRepository: TaskRepository = new LocalStorageTaskRepository()
