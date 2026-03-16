import { safeLocalStorage } from '../lib/storage'
import type { Reminder } from '../types'
import type { ReminderRepository } from '../repositories/reminderRepository'

const REMINDERS_STORAGE_KEY = 'task-planner.reminders.v1'

const normalizeReminder = (reminder: Partial<Reminder>, index: number): Reminder => ({
  id: reminder.id ?? `reminder-${index + 1}`,
  taskId: reminder.taskId ?? null,
  noteId: reminder.noteId ?? null,
  remindAt: reminder.remindAt ?? new Date().toISOString(),
  snoozedUntil: reminder.snoozedUntil ?? null,
  message: reminder.message ?? 'Task reminder',
  status: reminder.status ?? 'pending',
  createdAt: reminder.createdAt ?? new Date().toISOString(),
  updatedAt: reminder.updatedAt ?? reminder.createdAt ?? new Date().toISOString(),
})

const normalizeReminders = (reminders: Partial<Reminder>[]) => reminders.map(normalizeReminder)

export class LocalStorageReminderRepository implements ReminderRepository {
  async list(): Promise<Reminder[]> {
    const raw = safeLocalStorage.getItem(REMINDERS_STORAGE_KEY)
    if (!raw) {
      return []
    }

    try {
      const parsed = JSON.parse(raw) as Partial<Reminder>[]
      return normalizeReminders(parsed)
    } catch {
      return []
    }
  }

  async save(reminders: Reminder[]): Promise<void> {
    safeLocalStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(normalizeReminders(reminders)))
  }
}

export const reminderRepository: ReminderRepository = new LocalStorageReminderRepository()