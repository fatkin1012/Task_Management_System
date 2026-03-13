export type TaskStatus = 'todo' | 'in_progress' | 'waiting' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  dueTime: string | null
  estimatedDurationMinutes: number
  category: string
  tags: string[]
  subtasks: Subtask[]
  reminder: string | null
  pinned: boolean
  createdAt: string
  updatedAt: string
  linkedCalendarEventId: string | null
}

export type TaskSortKey =
  | 'dueDate'
  | 'priority'
  | 'createdAt'
  | 'status'
  | 'manual'

export type TaskFilterPreset =
  | 'inbox'
  | 'today'
  | 'upcoming'
  | 'overdue'
  | 'completed'
  | 'incomplete'

export type TaskViewMode = 'list' | 'board' | 'calendar'

export interface TaskFilters {
  preset: TaskFilterPreset
  priorities: TaskPriority[]
  categories: string[]
  tags: string[]
  search: string
}
