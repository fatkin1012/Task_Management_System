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
  const duplicateTask = useTaskStore((state) => state.duplicateTask)
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
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
              {selectedTask.status.replace('_', ' ')}
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-800">
              {selectedTask.priority}
            </span>
            <span className="rounded-full bg-violet-50 px-2 py-1 text-xs text-violet-700">
              {selectedTask.projectId ?? 'No project'}
            </span>
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
          <p>
            <span className="font-medium text-slate-700">Project:</span>{' '}
            {selectedTask.projectId ?? 'No project'}
          </p>
          <div>
            <p className="font-medium text-slate-700">Tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTask.tags.length > 0 ? (
                selectedTask.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-sky-50 px-2 py-1 text-xs text-sky-700">
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No tags</span>
              )}
            </div>
          </div>
          <div>
            <p className="font-medium text-slate-700">Subtasks</p>
            <div className="mt-2 space-y-2">
              {selectedTask.subtasks.length > 0 ? (
                selectedTask.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                    <input type="checkbox" checked={subtask.completed} readOnly className="size-4" />
                    <span className={subtask.completed ? 'text-slate-500 line-through' : 'text-slate-700'}>
                      {subtask.title}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No subtasks yet.</p>
              )}
            </div>
          </div>
          <div className="grid gap-2 rounded-2xl bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Scheduling metadata</p>
            <p className="text-sm text-slate-600">
              Reminder: {selectedTask.reminder ?? 'Not scheduled'}
            </p>
            <p className="text-sm text-slate-600">
              Linked calendar event: {selectedTask.linkedCalendarEventId ?? 'Not linked'}
            </p>
          </div>
          <TaskCalendarActions task={selectedTask} />
          <button
            type="button"
            onClick={() => duplicateTask(selectedTask.id)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Duplicate task
          </button>
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
