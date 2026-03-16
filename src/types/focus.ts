export type FocusSessionMode = 'pomodoro' | 'deep_work' | 'custom'

export interface FocusSession {
  id: string
  taskId: string | null
  mode: FocusSessionMode
  durationMinutes: number
  breakDurationMinutes: number
  startedAt: string | null
  endedAt: string | null
  completed: boolean
  createdAt: string
}