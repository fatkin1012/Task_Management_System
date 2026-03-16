import { compareAsc, parseISO } from 'date-fns'

import type { Task, TaskSortKey } from '../types'

const priorityRank: Record<Task['priority'], number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}

const statusRank: Record<Task['status'], number> = {
  blocked: 0,
  in_progress: 1,
  waiting: 2,
  todo: 3,
  done: 4,
}

export const sortTasks = (tasks: Task[], sortKey: TaskSortKey) => {
  return [...tasks].sort((a, b) => {
    if (sortKey === 'manual') {
      return (a.order ?? 0) - (b.order ?? 0)
    }

    if (sortKey === 'priority') {
      return priorityRank[b.priority] - priorityRank[a.priority]
    }

    if (sortKey === 'createdAt') {
      return compareAsc(parseISO(b.createdAt), parseISO(a.createdAt))
    }

    if (sortKey === 'status') {
      return statusRank[a.status] - statusRank[b.status]
    }

    const aDue = a.dueDate ? parseISO(a.dueDate) : new Date(8640000000000000)
    const bDue = b.dueDate ? parseISO(b.dueDate) : new Date(8640000000000000)
    return compareAsc(aDue, bDue)
  })
}