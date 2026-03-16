import { Bolt, Filter, Plus } from 'lucide-react'

interface HeaderActionsProps {
  activeFilterCount: number
  onQuickCapture: () => void
  onToggleFilter: () => void
  onAddTask: () => void
}

export function HeaderActions({
  activeFilterCount,
  onQuickCapture,
  onToggleFilter,
  onAddTask,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onQuickCapture}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
      >
        <Bolt size={16} />
        Quick Capture
      </button>
      <button
        type="button"
        onClick={onToggleFilter}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
      >
        <Filter size={16} />
        Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
      </button>
      <button
        type="button"
        onClick={onAddTask}
        className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
      >
        <Plus size={16} />
        Add Task
      </button>
    </div>
  )
}
