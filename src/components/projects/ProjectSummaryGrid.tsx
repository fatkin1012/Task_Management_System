import { format, parseISO } from 'date-fns'

import type { ProjectSummary } from '../../hooks/useProjectSummaries'

interface ProjectSummaryGridProps {
  projects: ProjectSummary[]
  selectedProjectId: string | null
  onSelectProject: (projectId: string) => void
}

const healthStyles: Record<ProjectSummary['health'], string> = {
  stable: 'bg-emerald-50 text-emerald-700',
  watch: 'bg-amber-50 text-amber-700',
  'at-risk': 'bg-rose-50 text-rose-700',
}

export function ProjectSummaryGrid({
  projects,
  selectedProjectId,
  onSelectProject,
}: ProjectSummaryGridProps) {
  if (projects.length === 0) {
    return (
      <article className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        <p className="font-medium text-slate-700">No projects yet.</p>
        <p className="mt-2 text-sm">Assign a project name to tasks and the project workspace will populate automatically.</p>
      </article>
    )
  }

  return (
    <section className="grid gap-3 lg:grid-cols-2">
      {projects.map((project) => {
        const isSelected = project.id === selectedProjectId
        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onSelectProject(project.id)}
            className={`rounded-3xl p-5 text-left shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md ${
              isSelected
                ? 'bg-sky-100 text-slate-900 ring-sky-200'
                : 'bg-white text-slate-900 ring-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                    isSelected ? 'bg-white text-sky-700' : 'bg-sky-50 text-sky-700'
                  }`}
                >
                  {project.primaryCategory}
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-tight">{project.title}</h2>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isSelected ? 'bg-white text-slate-700 ring-1 ring-slate-200' : healthStyles[project.health]
                }`}
              >
                {project.health.replace('-', ' ')}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <div>
                <p className={`text-xs uppercase ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>Open</p>
                <p className="mt-1 text-2xl font-bold">{project.openCount}</p>
              </div>
              <div>
                <p className={`text-xs uppercase ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>Done</p>
                <p className="mt-1 text-2xl font-bold">{project.doneCount}</p>
              </div>
              <div>
                <p className={`text-xs uppercase ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>Blocked</p>
                <p className="mt-1 text-2xl font-bold">{project.blockedCount}</p>
              </div>
              <div>
                <p className={`text-xs uppercase ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>Complete</p>
                <p className="mt-1 text-2xl font-bold">{project.completionRate}%</p>
              </div>
            </div>

            <div className={`mt-5 flex flex-wrap items-center gap-2 text-xs ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>
              <span className={`rounded-full px-2 py-1 ${isSelected ? 'bg-white text-slate-700 ring-1 ring-sky-200' : 'bg-slate-100'}`}>
                {project.estimatedMinutes} min open workload
              </span>
              <span className={`rounded-full px-2 py-1 ${isSelected ? 'bg-white text-slate-700 ring-1 ring-sky-200' : 'bg-slate-100'}`}>
                {project.completedMinutes} min finished
              </span>
              <span className={`rounded-full px-2 py-1 ${isSelected ? 'bg-white text-slate-700 ring-1 ring-sky-200' : 'bg-slate-100'}`}>
                {project.nextDueDate ? format(parseISO(project.nextDueDate), 'MMM d, yyyy') : 'No due date'}
              </span>
            </div>
          </button>
        )
      })}
    </section>
  )
}
