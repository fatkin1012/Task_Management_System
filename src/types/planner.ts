export interface PlannerCapacitySummary {
  date: string
  scheduledMinutes: number
  freeMinutes: number
  focusMinutes: number
}

export interface SuggestedTaskSlot {
  taskId: string
  start: string
  end: string
  confidence: 'low' | 'medium' | 'high'
  reason: string
}

export interface PlannerSettings {
  dayStartHour: number
  dayEndHour: number
  defaultFocusMinutes: number
  breakMinutes: number
  autoSuggestSlots: boolean
  updatedAt: string | null
}