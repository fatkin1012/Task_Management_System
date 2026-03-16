import { ModulePage } from '../components/ui/ModulePage'
import { TodayWorkspace } from '../components/planner/TodayWorkspace'
import { useTaskStore } from '../store/taskStore'
import { useUiStore } from '../store/uiStore'

export function TodayPage() {
  const setSelectedTaskId = useTaskStore((state) => state.setSelectedTaskId)
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const duplicateTask = useTaskStore((state) => state.duplicateTask)
  const setTaskDrawerOpen = useUiStore((state) => state.setTaskDrawerOpen)

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setTaskDrawerOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
    setTaskDrawerOpen(false)
  }

  return (
    <ModulePage
      eyebrow="Today"
      title="Daily focus workspace"
      description="Run the day from one screen: pick the top three priorities, review overdue work, watch your calendar load, and choose the next block intentionally."
    >
      <TodayWorkspace
        onSelectTask={handleSelectTask}
        onToggleTask={toggleTaskCompletion}
        onDeleteTask={handleDeleteTask}
        onDuplicateTask={duplicateTask}
      />
    </ModulePage>
  )
}