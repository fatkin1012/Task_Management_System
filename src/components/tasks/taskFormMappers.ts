import type { Task } from '../../types'
import type { TaskFormValues } from '../../lib/validation/taskFormSchema'

export const defaultTaskFormValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  dueTime: '',
  estimatedDurationMinutes: 30,
  category: 'Inbox',
  projectId: '',
  tags: '',
  reminder: '',
  pinned: false,
}

export const mapTaskToFormValues = (task: Task): TaskFormValues => ({
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate ?? '',
  dueTime: task.dueTime ?? '',
  estimatedDurationMinutes: task.estimatedDurationMinutes,
  category: task.category,
  projectId: task.projectId ?? '',
  tags: task.tags.join(', '),
  reminder: task.reminder ?? '',
  pinned: task.pinned,
})
