import { useTaskHeaderControls } from '../../hooks/useTaskHeaderControls'
import type { TaskFilterPreset } from '../../types'
import { ActiveFilterChips } from './header/ActiveFilterChips'
import { HeaderActions } from './header/HeaderActions'
import { TaskDisplayControls } from './header/TaskDisplayControls'
import { TaskFilterPanel } from './header/TaskFilterPanel'

interface HeaderBarProps {
  title: string
  preset: TaskFilterPreset
}

export function HeaderBar({ title, preset }: HeaderBarProps) {
  const {
    isFilterOpen,
    setIsFilterOpen,
    filters,
    sortKey,
    setSortKey,
    currentViewMode,
    setCurrentViewMode,
    taskGroupBy,
    setTaskGroupBy,
    setQuickCaptureOpen,
    setAddTaskModalOpen,
    categoryOptions,
    tagOptions,
    activeFilterCount,
    toggleMultiSelect,
    clearAllFilters,
    updateSearch,
  } = useTaskHeaderControls(preset)

  return (
    <header className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Workspace</p>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        </div>
        <HeaderActions
          activeFilterCount={activeFilterCount}
          onQuickCapture={() => setQuickCaptureOpen(true)}
          onToggleFilter={() => setIsFilterOpen((open) => !open)}
          onAddTask={() => setAddTaskModalOpen(true)}
        />
      </div>

      {isFilterOpen ? (
        <TaskFilterPanel
          filters={filters}
          categoryOptions={categoryOptions}
          tagOptions={tagOptions}
          onClearAll={clearAllFilters}
          onToggleMultiSelect={toggleMultiSelect}
        />
      ) : null}

      <ActiveFilterChips filters={filters} onToggleMultiSelect={toggleMultiSelect} />

      <TaskDisplayControls
        search={filters.search}
        sortKey={sortKey}
        currentViewMode={currentViewMode}
        taskGroupBy={taskGroupBy}
        onSearchChange={updateSearch}
        onSortKeyChange={setSortKey}
        onGroupByChange={setTaskGroupBy}
        onViewModeChange={setCurrentViewMode}
      />
    </header>
  )
}
