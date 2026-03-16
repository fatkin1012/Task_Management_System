export type TaskStatus = 'todo' | 'in_progress' | 'waiting' | 'blocked' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Subtask {
  id: string
  title: string
  completed: boolean
  estimatedDurationMinutes?: number
}

export interface RecurringRule {
  frequency: 'daily' | 'weekly' | 'monthly'
  interval?: number
  daysOfWeek?: number[]
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
  projectId?: string | null
  tags: string[]
  subtasks: Subtask[]
  reminder: string | null
  pinned: boolean
  recurringRule?: RecurringRule | null
  createdAt: string
  updatedAt: string
  linkedCalendarEventId: string | null
  notesId?: string | null
  order?: number
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

export type TaskViewMode = 'list' | 'board' | 'calendar' | 'planner'

export type TaskGroupBy = 'none' | 'category' | 'project'

export interface TaskFilters {
  preset: TaskFilterPreset
  statuses: TaskStatus[]
  priorities: TaskPriority[]
  categories: string[]
  tags: string[]
  search: string
}
