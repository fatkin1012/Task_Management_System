import type { Task } from '../types'

export interface TaskRepository {
  list(): Promise<Task[]>
  save(tasks: Task[]): Promise<void>
}
