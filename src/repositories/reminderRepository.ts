import type { Reminder } from '../types'

export interface ReminderRepository {
  list(): Promise<Reminder[]>
  save(reminders: Reminder[]): Promise<void>
}