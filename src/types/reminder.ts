export type ReminderStatus = 'pending' | 'snoozed' | 'dismissed' | 'delivered'

export interface Reminder {
  id: string
  taskId: string | null
  noteId: string | null
  remindAt: string
  snoozedUntil: string | null
  message: string
  status: ReminderStatus
  createdAt: string
  updatedAt: string
}