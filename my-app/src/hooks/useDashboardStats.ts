import { isBefore, isToday, parseISO } from 'date-fns'

import { useTaskStore } from '../store/taskStore'
import type { DashboardStats } from '../types'

export const useDashboardStats = (): DashboardStats => {
  const tasks = useTaskStore((state) => state.tasks)
  const now = new Date()
  const doneTaskCount = tasks.filter((task) => task.status === 'done').length
  const totalTaskCount = tasks.length

  return {
    dueTodayCount: tasks.filter((task) => task.dueDate && isToday(parseISO(task.dueDate))).length,
    overdueCount: tasks.filter(
      (task) => task.dueDate && isBefore(parseISO(task.dueDate), now) && task.status !== 'done',
    ).length,
    completedTodayCount: tasks.filter(
      (task) => task.updatedAt && isToday(parseISO(task.updatedAt)) && task.status === 'done',
    ).length,
    upcomingCount: tasks.filter((task) => task.dueDate && !isToday(parseISO(task.dueDate))).length,
    totalTaskCount,
    doneTaskCount,
    urgentTaskCount: tasks.filter((task) => task.priority === 'urgent' && task.status !== 'done').length,
    completionRate: totalTaskCount > 0 ? Math.round((doneTaskCount / totalTaskCount) * 100) : 0,
    nextFreeTimeSuggestion: '2:00 PM - 3:00 PM',
  }
}
