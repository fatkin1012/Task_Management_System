export interface DashboardStats {
  dueTodayCount: number
  overdueCount: number
  completedTodayCount: number
  upcomingCount: number
  totalTaskCount: number
  doneTaskCount: number
  urgentTaskCount: number
  blockedTaskCount: number
  inboxTaskCount: number
  completionRate: number
  nextFreeTimeSuggestion: string | null
  focusTimeTodayMinutes?: number
  workloadMinutesToday?: number
  workloadByCategory?: Array<{ label: string; value: number }>
  priorityDistribution?: Array<{ label: string; value: number }>
}
