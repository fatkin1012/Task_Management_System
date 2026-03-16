import { isBefore, isToday, parseISO } from 'date-fns'

import { useTaskStore } from '../store/taskStore'
import type { Task } from '../types'

export interface ProjectSummary {
  id: string
  title: string
  tasks: Task[]
  totalCount: number
  openCount: number
  doneCount: number
  blockedCount: number
  urgentCount: number
  overdueCount: number
  dueTodayCount: number
  estimatedMinutes: number
  completedMinutes: number
  completionRate: number
  health: 'stable' | 'watch' | 'at-risk'
  nextDueDate: string | null
  primaryCategory: string
}

const getProjectTitle = (task: Task) => task.projectId?.trim() || 'Unassigned'

export const useProjectSummaries = () => {
  const tasks = useTaskStore((state) => state.tasks)
  const now = new Date()

  const grouped = tasks.reduce<Map<string, Task[]>>((acc, task) => {
    const key = getProjectTitle(task)
    const existing = acc.get(key) ?? []
    existing.push(task)
    acc.set(key, existing)
    return acc
  }, new Map())

  const projects = [...grouped.entries()]
    .map(([title, projectTasks]) => {
      const openTasks = projectTasks.filter((task) => task.status !== 'done')
      const doneTasks = projectTasks.filter((task) => task.status === 'done')
      const blockedCount = openTasks.filter((task) => task.status === 'blocked').length
      const overdueCount = openTasks.filter(
        (task) => task.dueDate && isBefore(parseISO(task.dueDate), now),
      ).length
      const dueTodayCount = openTasks.filter((task) => task.dueDate && isToday(parseISO(task.dueDate))).length
      const urgentCount = openTasks.filter((task) => task.priority === 'urgent').length
      const estimatedMinutes = openTasks.reduce(
        (total, task) => total + task.estimatedDurationMinutes,
        0,
      )
      const completedMinutes = doneTasks.reduce(
        (total, task) => total + task.estimatedDurationMinutes,
        0,
      )
      const nextDueTask = [...openTasks]
        .filter((task) => task.dueDate)
        .sort((left, right) => (left.dueDate ?? '').localeCompare(right.dueDate ?? ''))
        .at(0)

      const categoryFrequency = projectTasks.reduce<Record<string, number>>((acc, task) => {
        acc[task.category] = (acc[task.category] ?? 0) + 1
        return acc
      }, {})

      const primaryCategory = Object.entries(categoryFrequency)
        .sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'Inbox'

      const health: ProjectSummary['health'] =
        blockedCount > 0 || overdueCount > 0 ? 'at-risk' : urgentCount > 0 || dueTodayCount > 0 ? 'watch' : 'stable'

      return {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        tasks: [...projectTasks].sort((left, right) => {
          if (left.status === right.status) {
            return (left.order ?? 0) - (right.order ?? 0)
          }

          if (left.status === 'done') {
            return 1
          }

          if (right.status === 'done') {
            return -1
          }

          return (left.order ?? 0) - (right.order ?? 0)
        }),
        totalCount: projectTasks.length,
        openCount: openTasks.length,
        doneCount: doneTasks.length,
        blockedCount,
        urgentCount,
        overdueCount,
        dueTodayCount,
        estimatedMinutes,
        completedMinutes,
        completionRate:
          projectTasks.length > 0 ? Math.round((doneTasks.length / projectTasks.length) * 100) : 0,
        health,
        nextDueDate: nextDueTask?.dueDate ?? null,
        primaryCategory,
      }
    })
    .sort((left, right) => {
      const healthRank = { 'at-risk': 0, watch: 1, stable: 2 }
      if (healthRank[left.health] !== healthRank[right.health]) {
        return healthRank[left.health] - healthRank[right.health]
      }

      if (left.openCount !== right.openCount) {
        return right.openCount - left.openCount
      }

      return left.title.localeCompare(right.title)
    })

  return {
    projects,
    totalProjects: projects.length,
    activeProjects: projects.filter((project) => project.openCount > 0).length,
    atRiskProjects: projects.filter((project) => project.health === 'at-risk').length,
    unassignedTasks: tasks.filter((task) => !task.projectId?.trim()).length,
  }
}
