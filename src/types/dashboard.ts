export interface DashboardStats {
  dueTodayCount: number
  overdueCount: number
  completedTodayCount: number
  upcomingCount: number
  totalTaskCount: number
  doneTaskCount: number
  urgentTaskCount: number
  completionRate: number
  nextFreeTimeSuggestion: string | null
}
