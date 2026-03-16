export interface ProjectCategory {
  id: string
  name: string
  color: string
  description?: string
}

export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived'

export interface Milestone {
  id: string
  title: string
  dueDate: string | null
  completed: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  categoryId: string | null
  status: ProjectStatus
  startDate: string | null
  endDate: string | null
  estimatedDurationMinutes: number
  spentMinutes: number
  milestoneIds: string[]
  taskIds: string[]
  createdAt: string
  updatedAt: string
}
