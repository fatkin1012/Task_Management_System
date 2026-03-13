import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { useTaskStore } from '../../store/taskStore'
import { LeftSidebar } from './LeftSidebar'
import { TaskDetailDrawer } from './TaskDetailDrawer'
import { TaskDetailPanel } from './TaskDetailPanel'

export function AppShell() {
  const loadTasks = useTaskStore((state) => state.loadTasks)
  const persistTasks = useTaskStore((state) => state.persistTasks)
  const tasks = useTaskStore((state) => state.tasks)
  const isLoaded = useTaskStore((state) => state.isLoaded)
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId)
  const [isDetailCollapsed, setIsDetailCollapsed] = useState(true)

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  useEffect(() => {
    if (isLoaded) {
      void persistTasks()
    }
  }, [isLoaded, persistTasks, tasks])

  useEffect(() => {
    if (!selectedTaskId) {
      setIsDetailCollapsed(true)
      return
    }

    setIsDetailCollapsed(false)
  }, [selectedTaskId])

  return (
    <div className="mx-auto flex w-full max-w-[1600px] gap-4 p-4">
      <LeftSidebar />
      <main className="min-h-[calc(100svh-2rem)] flex-1 space-y-4 rounded-3xl bg-slate-100/80 p-4">
        <Outlet />
      </main>
      <div className="hidden items-stretch xl:flex">
        <button
          type="button"
          onClick={() => setIsDetailCollapsed((collapsed) => !collapsed)}
          aria-label={isDetailCollapsed ? 'Expand task details' : 'Collapse task details'}
          className="mr-2 self-center rounded-full bg-white px-2 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200"
        >
          {isDetailCollapsed ? '<' : '>'}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isDetailCollapsed ? 'w-0 opacity-0' : 'w-[340px] opacity-100'
          }`}
        >
          <TaskDetailPanel />
        </div>
      </div>
      <TaskDetailDrawer />
    </div>
  )
}
