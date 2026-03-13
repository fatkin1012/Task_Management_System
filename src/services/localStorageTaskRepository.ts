import { seedTasks } from '../data/seedTasks'
import { safeLocalStorage } from '../lib/storage'
import type { Task } from '../types'
import type { TaskRepository } from './taskRepository'

const TASKS_STORAGE_KEY = 'task-planner.tasks.v1'

export class LocalStorageTaskRepository implements TaskRepository {
  async list(): Promise<Task[]> {
    const raw = safeLocalStorage.getItem(TASKS_STORAGE_KEY)
    if (!raw) {
      return seedTasks
    }

    try {
      const parsed = JSON.parse(raw) as Task[]
      return parsed.length > 0 ? parsed : seedTasks
    } catch {
      return seedTasks
    }
  }

  async save(tasks: Task[]): Promise<void> {
    safeLocalStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  }
}

export const taskRepository: TaskRepository = new LocalStorageTaskRepository()
