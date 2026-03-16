import { useEffect } from 'react'

import { HeaderBar } from '../components/layout/HeaderBar'
import { MobilePlannerNav } from '../components/layout/MobilePlannerNav'
import { DashboardSummary } from '../components/dashboard/DashboardSummary'
import { TaskListView } from '../components/tasks/TaskListView'
import { TaskBoardView } from '../components/tasks/TaskBoardView'
import { GroupedTaskListView } from '../components/tasks/GroupedTaskListView'
import { QuickCapturePanel } from '../components/tasks/QuickCapturePanel'
import { TodayEventsPanel } from '../components/calendar/TodayEventsPanel'
import { AddTaskModal } from '../components/tasks/AddTaskModal'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useFilteredTasks } from '../hooks/useFilteredTasks'
import { useTaskGroups } from '../hooks/useTaskGroups'
import { useTaskStore } from '../store/taskStore'
import { useUiStore } from '../store/uiStore'
import type { TaskFilterPreset } from '../types'

interface TaskViewPageProps {
  title: string
  preset: TaskFilterPreset
}

export function TaskViewPage({ title, preset }: TaskViewPageProps) {
  const stats = useDashboardStats()
  const filteredTasks = useFilteredTasks()
  const taskGroups = useTaskGroups(filteredTasks)
  const setSelectedTaskId = useTaskStore((state) => state.setSelectedTaskId)
  const updateFilters = useTaskStore((state) => state.updateFilters)
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const duplicateTask = useTaskStore((state) => state.duplicateTask)
  const moveTask = useTaskStore((state) => state.moveTask)
  const currentViewMode = useUiStore((state) => state.currentViewMode)
  const taskGroupBy = useUiStore((state) => state.taskGroupBy)
  const setTaskDrawerOpen = useUiStore((state) => state.setTaskDrawerOpen)

  useEffect(() => {
    updateFilters({ preset })
  }, [preset, updateFilters])

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setTaskDrawerOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
    setTaskDrawerOpen(false)
  }

  return (
    <div className="space-y-4">
      <MobilePlannerNav />
      <HeaderBar title={title} preset={preset} />
      <QuickCapturePanel />
      <DashboardSummary {...stats} />
      <div
        className={`grid gap-4 ${
          currentViewMode === 'board' ? 'grid-cols-1' : '2xl:grid-cols-[1fr_320px]'
        }`}
      >
        <section>
          {currentViewMode === 'list' && taskGroupBy === 'none' && (
            <TaskListView
              tasks={filteredTasks}
              onSelectTask={handleSelectTask}
              onToggleTask={toggleTaskCompletion}
              onDeleteTask={handleDeleteTask}
              onDuplicateTask={duplicateTask}
            />
          )}
          {currentViewMode === 'list' && taskGroupBy !== 'none' && (
            <GroupedTaskListView
              groups={taskGroups}
              onSelectTask={handleSelectTask}
              onToggleTask={toggleTaskCompletion}
              onDeleteTask={handleDeleteTask}
              onDuplicateTask={duplicateTask}
            />
          )}
          {currentViewMode === 'board' && (
            <TaskBoardView
              tasks={filteredTasks}
              onSelectTask={handleSelectTask}
              onToggleTask={toggleTaskCompletion}
              onDeleteTask={handleDeleteTask}
              onMoveTask={moveTask}
            />
          )}
          {currentViewMode === 'calendar' && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Calendar view placeholder (Phase 3 implementation).
            </div>
          )}

          {currentViewMode === 'board' ? (
            <div className="mt-4">
              <TodayEventsPanel />
            </div>
          ) : null}
        </section>

        {currentViewMode !== 'board' ? <TodayEventsPanel /> : null}
      </div>
      <AddTaskModal />
    </div>
  )
}
