import { useEffect } from 'react'

import { ReminderForm } from '../components/reminders/ReminderForm'
import { ReminderList } from '../components/reminders/ReminderList'
import { ModulePage } from '../components/ui/ModulePage'
import { useDueReminders } from '../hooks/useDueReminders'
import { useNoteStore } from '../store/noteStore'
import { useReminderStore } from '../store/reminderStore'
import { useTaskStore } from '../store/taskStore'

export function RemindersPage() {
  const tasks = useTaskStore((state) => state.tasks)
  const notes = useNoteStore((state) => state.notes)
  const loadNotes = useNoteStore((state) => state.loadNotes)

  const reminders = useReminderStore((state) => state.reminders)
  const loadReminders = useReminderStore((state) => state.loadReminders)
  const persistReminders = useReminderStore((state) => state.persistReminders)
  const addReminder = useReminderStore((state) => state.addReminder)
  const updateReminderStatus = useReminderStore((state) => state.updateReminderStatus)
  const snoozeReminder = useReminderStore((state) => state.snoozeReminder)
  const deleteReminder = useReminderStore((state) => state.deleteReminder)
  const isLoaded = useReminderStore((state) => state.isLoaded)

  const { due, overdue, upcoming } = useDueReminders()

  useEffect(() => {
    void loadNotes()
    void loadReminders()
  }, [loadNotes, loadReminders])

  useEffect(() => {
    if (isLoaded) {
      void persistReminders()
    }
  }, [isLoaded, reminders, persistReminders])

  return (
    <ModulePage
      eyebrow="Reminders"
      title="Reminder center"
      description="A dedicated place for due reminders, overdue follow-ups, snooze controls, and future notification channels."
    >
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ReminderForm tasks={tasks} notes={notes} onCreate={addReminder} />
        <div className="space-y-4">
          <ReminderList
            title="Due now"
            reminders={due}
            tasks={tasks}
            notes={notes}
            onSnooze={snoozeReminder}
            onStatus={updateReminderStatus}
            onDelete={deleteReminder}
          />
          <ReminderList
            title="Upcoming"
            reminders={upcoming}
            tasks={tasks}
            notes={notes}
            onSnooze={snoozeReminder}
            onStatus={updateReminderStatus}
            onDelete={deleteReminder}
          />
          <ReminderList
            title="Overdue"
            reminders={overdue}
            tasks={tasks}
            notes={notes}
            onSnooze={snoozeReminder}
            onStatus={updateReminderStatus}
            onDelete={deleteReminder}
          />
        </div>
      </div>
    </ModulePage>
  )
}