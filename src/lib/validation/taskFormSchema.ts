import { z } from 'zod'

import type { TaskPriority, TaskStatus } from '../../types'

export const taskStatusOptions: TaskStatus[] = [
  'todo',
  'in_progress',
  'waiting',
  'blocked',
  'done',
]
export const taskPriorityOptions: TaskPriority[] = ['low', 'medium', 'high', 'urgent']

const toNullableString = (value: string | undefined) => {
  if (!value) {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
  description: z.string().trim().max(1000, 'Description is too long').optional(),
  status: z.enum(taskStatusOptions),
  priority: z.enum(taskPriorityOptions),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  estimatedDurationMinutes: z.number().int().min(0).max(1440),
  category: z.string().trim().min(1, 'Category is required').max(80),
  projectId: z.string().trim().max(80).optional(),
  tags: z.string().optional(),
  reminder: z.string().optional(),
  pinned: z.boolean().default(false),
})

export type TaskFormValues = z.input<typeof taskFormSchema>

export interface NormalizedTaskFormValues {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  dueTime: string | null
  estimatedDurationMinutes: number
  category: string
  projectId: string | null
  tags: string[]
  reminder: string | null
  pinned: boolean
}

export const normalizeTaskFormValues = (
  values: TaskFormValues,
): NormalizedTaskFormValues => {
  const tagSet = new Set(
    (values.tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  )

  return {
    title: values.title.trim(),
    description: (values.description ?? '').trim(),
    status: values.status,
    priority: values.priority,
    dueDate: toNullableString(values.dueDate),
    dueTime: toNullableString(values.dueTime),
    estimatedDurationMinutes: values.estimatedDurationMinutes,
    category: values.category.trim(),
    projectId: toNullableString(values.projectId),
    tags: Array.from(tagSet),
    reminder: toNullableString(values.reminder),
    pinned: Boolean(values.pinned),
  }
}
