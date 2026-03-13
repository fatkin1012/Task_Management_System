import { format, parseISO } from 'date-fns'

import { normalizeTaskFormValues, type TaskFormValues } from '../../lib/validation/taskFormSchema'
import { useTaskStore } from '../../store/taskStore'
import { useUiStore } from '../../store/uiStore'
import { TaskCalendarActions } from '../calendar/TaskCalendarActions'
import { EditTaskForm } from '../tasks/EditTaskForm'

export function TaskDetailPanel() {
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId)
  const tasks = useTaskStore((state) => state.tasks)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const setTaskDrawerOpen = useUiStore((state) => state.setTaskDrawerOpen)

  const selectedTask = tasks.find((task) => task.id === selectedTaskId)

  const handleUpdateTask = (taskId: string, values: TaskFormValues) => {
    updateTask(taskId, normalizeTaskFormValues(values))
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
    setTaskDrawerOpen(false)
  }

  return (
    <aside className="h-fit rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-sm font-semibold text-slate-900">Task Details</h3>
      {!selectedTask ? (
        <p className="mt-3 text-sm text-slate-500">Select a task to view details.</p>
      ) : (
        <div className="mt-3 space-y-3 text-sm">
          <div>
            <p className="font-semibold text-slate-900">{selectedTask.title}</p>
            <p className="text-slate-600">{selectedTask.description}</p>
          </div>
          <p>
            <span className="font-medium text-slate-700">Status:</span> {selectedTask.status}
          </p>
          <p>
            <span className="font-medium text-slate-700">Priority:</span> {selectedTask.priority}
          </p>
          <p>
            <span className="font-medium text-slate-700">Due:</span>{' '}
            {selectedTask.dueDate
              ? format(parseISO(selectedTask.dueDate), 'MMM d, yyyy')
              : 'No due date'}
          </p>
          <p>
            <span className="font-medium text-slate-700">Duration:</span>{' '}
            {selectedTask.estimatedDurationMinutes} minutes
          </p>
          <TaskCalendarActions task={selectedTask} />
          <EditTaskForm
            task={selectedTask}
            onSubmitTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      )}
    </aside>
  )
}
