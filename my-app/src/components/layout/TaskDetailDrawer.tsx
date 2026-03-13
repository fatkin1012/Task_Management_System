import { useEffect } from 'react'

import { useTaskStore } from '../../store/taskStore'
import { useUiStore } from '../../store/uiStore'
import { TaskDetailPanel } from './TaskDetailPanel'

export function TaskDetailDrawer() {
  const isOpen = useUiStore((state) => state.isTaskDrawerOpen)
  const setOpen = useUiStore((state) => state.setTaskDrawerOpen)
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId)

  useEffect(() => {
    if (!selectedTaskId) {
      setOpen(false)
    }
  }, [selectedTaskId, setOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/35"
        aria-label="Close task detail drawer"
        onClick={() => setOpen(false)}
      />
      <div className="absolute bottom-0 left-0 right-0 max-h-[88svh] overflow-y-auto rounded-t-3xl bg-slate-100 p-3">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-sm font-semibold text-slate-700">Task details</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
          >
            Close
          </button>
        </div>
        <TaskDetailPanel />
      </div>
    </div>
  )
}
