import { addMinutes, formatISO } from 'date-fns'
import { create } from 'zustand'

import type { Reminder, ReminderStatus } from '../types'
import { reminderRepository } from '../services/localStorageReminderRepository'

interface ReminderState {
  reminders: Reminder[]
  isLoaded: boolean
  isLoading: boolean
  loadReminders: () => Promise<void>
  persistReminders: () => Promise<void>
  addReminder: (input: {
    taskId: string | null
    noteId: string | null
    remindAt: string
    message: string
  }) => void
  updateReminderStatus: (reminderId: string, status: ReminderStatus) => void
  snoozeReminder: (reminderId: string, minutes: number) => void
  deleteReminder: (reminderId: string) => void
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  isLoaded: false,
  isLoading: false,
  loadReminders: async () => {
    if (get().isLoaded || get().isLoading) {
      return
    }

    set({ isLoading: true })
    const reminders = await reminderRepository.list()
    set({ reminders, isLoaded: true, isLoading: false })
  },
  persistReminders: async () => {
    await reminderRepository.save(get().reminders)
  },
  addReminder: (input) => {
    const nowIso = formatISO(new Date())
    const reminderId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `reminder-${Date.now()}`

    const reminder: Reminder = {
      id: reminderId,
      taskId: input.taskId,
      noteId: input.noteId,
      remindAt: input.remindAt,
      snoozedUntil: null,
      message: input.message,
      status: 'pending',
      createdAt: nowIso,
      updatedAt: nowIso,
    }

    set((state) => ({ reminders: [reminder, ...state.reminders] }))
  },
  updateReminderStatus: (reminderId, status) => {
    const nowIso = formatISO(new Date())
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === reminderId
          ? {
              ...reminder,
              status,
              updatedAt: nowIso,
            }
          : reminder,
      ),
    }))
  },
  snoozeReminder: (reminderId, minutes) => {
    const nowIso = formatISO(new Date())
    const snoozedUntil = formatISO(addMinutes(new Date(), minutes))
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === reminderId
          ? {
              ...reminder,
              status: 'snoozed',
              snoozedUntil,
              updatedAt: nowIso,
            }
          : reminder,
      ),
    }))
  },
  deleteReminder: (reminderId) => {
    set((state) => ({ reminders: state.reminders.filter((reminder) => reminder.id !== reminderId) }))
  },
}))