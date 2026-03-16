import { useEffect, useState } from 'react'

import { ProjectOverviewStats } from '../components/projects/ProjectOverviewStats'
import { ProjectSummaryGrid } from '../components/projects/ProjectSummaryGrid'
import { ProjectTaskPanel } from '../components/projects/ProjectTaskPanel'
import { ModulePage } from '../components/ui/ModulePage'
import { useProjectSummaries } from '../hooks/useProjectSummaries'
import { useTaskStore } from '../store/taskStore'
import { useUiStore } from '../store/uiStore'

export function ProjectsPage() {
  const { projects, totalProjects, activeProjects, atRiskProjects, unassignedTasks } = useProjectSummaries()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const setSelectedTaskId = useTaskStore((state) => state.setSelectedTaskId)
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const duplicateTask = useTaskStore((state) => state.duplicateTask)
  const setTaskDrawerOpen = useUiStore((state) => state.setTaskDrawerOpen)

  useEffect(() => {
    if (!projects.length) {
      setSelectedProjectId(null)
      return
    }

    setSelectedProjectId((current) =>
      current && projects.some((project) => project.id === current) ? current : projects[0].id,
    )
  }, [projects])

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null

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
      eyebrow="Projects"
      title="Project workload and risk view"
      description="Review work grouped by project assignment, spot delivery risk quickly, and drill into the tasks driving each project's current status."
    >
      <ProjectOverviewStats
        totalProjects={totalProjects}
        activeProjects={activeProjects}
        atRiskProjects={atRiskProjects}
        unassignedTasks={unassignedTasks}
      />
      <ProjectSummaryGrid
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
      />
      <ProjectTaskPanel
        project={selectedProject}
        onSelectTask={handleSelectTask}
        onToggleTask={toggleTaskCompletion}
        onDeleteTask={handleDeleteTask}
        onDuplicateTask={duplicateTask}
      />
    </ModulePage>
  )
}