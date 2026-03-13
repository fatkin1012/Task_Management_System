import type { Task } from './task'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: string
  end: string
  source: 'google' | 'task-planner'
}

export interface FreeBusySlot {
  start: string
  end: string
  isBusy: boolean
}

export interface ScheduleSuggestion {
  start: string
  end: string
  reason: string
}

export interface CalendarConnectionState {
  connected: boolean
  provider: 'google' | null
  accountEmail: string | null
}

export interface MapTaskToEventInput {
  task: Task
  preferredStart?: string
}
