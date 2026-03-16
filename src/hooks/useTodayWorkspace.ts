import { compareAsc, isBefore, isToday, parseISO } from 'date-fns'
import { useMemo } from 'react'

import { useTaskStore } from '../store/taskStore'
import type { Task } from '../types'

const priorityRank: Record<Task['priority'], number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export const useTodayWorkspace = () => {
  const tasks = useTaskStore((state) => state.tasks)

  return useMemo(() => {
    const now = new Date()
    const openTasks = tasks.filter((task) => task.status !== 'done')
    const dueTodayTasks = openTasks.filter((task) => task.dueDate && isToday(parseISO(task.dueDate)))
    const overdueTasks = openTasks.filter(
      (task) => task.dueDate && isBefore(parseISO(task.dueDate), now) && !isToday(parseISO(task.dueDate)),
    )

    const topPriorities = [...openTasks]
      .sort((left, right) => {
        const priorityDiff = priorityRank[right.priority] - priorityRank[left.priority]
        if (priorityDiff !== 0) {
          return priorityDiff
        }

        const leftDue = left.dueDate ? parseISO(left.dueDate) : new Date(8640000000000000)
        const rightDue = right.dueDate ? parseISO(right.dueDate) : new Date(8640000000000000)
        return compareAsc(leftDue, rightDue)
      })
      .slice(0, 3)

    const suggestedNextTask = topPriorities.at(0) ?? null
    const remainingWorkloadMinutes = dueTodayTasks.reduce(
      (total, task) => total + task.estimatedDurationMinutes,
      0,
    )

    return {
      topPriorities,
      dueTodayTasks,
      overdueTasks,
      suggestedNextTask,
      remainingWorkloadMinutes,
      inboxTasksCount: openTasks.filter((task) => task.category === 'Inbox').length,
    }
  }, [tasks])
}