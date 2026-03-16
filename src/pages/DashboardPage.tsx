import { DashboardSummary } from '../components/dashboard/DashboardSummary'
import { ModulePage } from '../components/ui/ModulePage'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useTaskStore } from '../store/taskStore'

export function DashboardPage() {
  const stats = useDashboardStats()
  const tasks = useTaskStore((state) => state.tasks)

  const riskTasks = tasks
    .filter((task) => task.status !== 'done')
    .sort((left, right) => {
      if (left.priority === right.priority) {
        return (left.dueDate ?? '').localeCompare(right.dueDate ?? '')
      }
      return right.priority.localeCompare(left.priority)
    })
    .slice(0, 5)

  return (
    <ModulePage
      eyebrow="Dashboard"
      title="Productivity analytics hub"
      description="Review the current state of work, spot overdue tasks, and prepare the next planning decision from one place."
    >
      <DashboardSummary {...stats} />
      <section className="grid gap-3 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-900">Priority radar</p>
          <div className="mt-4 space-y-3">
            {riskTasks.map((task) => (
              <div key={task.id} className="rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-900">{task.title}</p>
                  <span className="rounded-full bg-white px-2 py-1 text-xs capitalize text-slate-600 ring-1 ring-slate-200">
                    {task.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {task.projectId ?? task.category} • {task.status.replace('_', ' ')}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-900">Operational notes</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>Use the Today workspace to convert dashboard signals into a realistic daily plan.</p>
            <p>Blocked tasks should be addressed first if they are also urgent or overdue.</p>
            <p>Inbox count is now visible so quick capture does not silently turn into backlog debt.</p>
          </div>
        </article>
      </section>
    </ModulePage>
  )
}