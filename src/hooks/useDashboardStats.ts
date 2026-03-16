import { compareAsc, isBefore, isToday, parseISO } from 'date-fns'

import { useTaskStore } from '../store/taskStore'
import type { DashboardStats } from '../types'

export const useDashboardStats = (): DashboardStats => {
  const tasks = useTaskStore((state) => state.tasks)
  const now = new Date()
  const openTasks = tasks.filter((task) => task.status !== 'done')
  const doneTaskCount = tasks.filter((task) => task.status === 'done').length
  const totalTaskCount = tasks.length
  const dueTodayTasks = openTasks.filter((task) => task.dueDate && isToday(parseISO(task.dueDate)))
  const completedTodayTasks = tasks.filter(
    (task) => task.updatedAt && isToday(parseISO(task.updatedAt)) && task.status === 'done',
  )
  const workloadByCategory = Object.entries(
    openTasks.reduce<Record<string, number>>((acc, task) => {
      const key = task.projectId ?? task.category
      acc[key] = (acc[key] ?? 0) + task.estimatedDurationMinutes
      return acc
    }, {}),
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }))

  const priorityDistribution = (['urgent', 'high', 'medium', 'low'] as const).map((priority) => ({
    label: priority,
    value: openTasks.filter((task) => task.priority === priority).length,
  }))

  const nextDueTask = [...dueTodayTasks]
    .sort((left, right) => {
      if (!left.dueDate || !right.dueDate) {
        return 0
      }

      return compareAsc(parseISO(left.dueDate), parseISO(right.dueDate))
    })
    .at(0)

  return {
    dueTodayCount: dueTodayTasks.length,
    overdueCount: openTasks.filter(
      (task) => task.dueDate && isBefore(parseISO(task.dueDate), now) && task.status !== 'done',
    ).length,
    completedTodayCount: completedTodayTasks.length,
    upcomingCount: tasks.filter((task) => task.dueDate && !isToday(parseISO(task.dueDate))).length,
    totalTaskCount,
    doneTaskCount,
    urgentTaskCount: openTasks.filter((task) => task.priority === 'urgent').length,
    blockedTaskCount: openTasks.filter((task) => task.status === 'blocked').length,
    inboxTaskCount: openTasks.filter((task) => task.category === 'Inbox').length,
    completionRate: totalTaskCount > 0 ? Math.round((doneTaskCount / totalTaskCount) * 100) : 0,
    nextFreeTimeSuggestion: nextDueTask
      ? `Protect time for ${nextDueTask.title}`
      : 'Calendar has room for a focus block this afternoon',
    focusTimeTodayMinutes: completedTodayTasks.reduce(
      (total, task) => total + task.estimatedDurationMinutes,
      0,
    ),
    workloadMinutesToday: dueTodayTasks.reduce(
      (total, task) => total + task.estimatedDurationMinutes,
      0,
    ),
    workloadByCategory,
    priorityDistribution,
  }
}
