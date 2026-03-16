import { isBefore, isToday, parseISO } from 'date-fns'
import { useMemo } from 'react'

import { useReminderStore } from '../store/reminderStore'

export const useDueReminders = () => {
  const reminders = useReminderStore((state) => state.reminders)

  return useMemo(() => {
    const now = new Date()

    const active = reminders.filter((reminder) => reminder.status === 'pending' || reminder.status === 'snoozed')

    const due = active.filter((reminder) => {
      const target = reminder.snoozedUntil ?? reminder.remindAt
      const targetDate = parseISO(target)
      return !isBefore(now, targetDate) && isToday(targetDate)
    })

    const overdue = active.filter((reminder) => {
      const target = reminder.snoozedUntil ?? reminder.remindAt
      const targetDate = parseISO(target)
      return isBefore(targetDate, now) && !isToday(targetDate)
    })

    const upcoming = active.filter((reminder) => {
      const target = reminder.snoozedUntil ?? reminder.remindAt
      return isBefore(now, parseISO(target))
    })

    return {
      due,
      overdue,
      upcoming,
    }
  }, [reminders])
}