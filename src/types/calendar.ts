import type { Task } from './task'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: string
  end: string
  location?: string
  attendees?: string[]
  source: 'google' | 'task-planner' | 'mock'
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

export interface PlannerViewState {
  range: 'day' | 'week'
  selectedDate: string
  showTasks: boolean
  showEvents: boolean
}
