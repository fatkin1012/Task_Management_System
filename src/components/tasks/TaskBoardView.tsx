import {
  DndContext,
  PointerSensor,
  closestCorners,
  type DragEndEvent,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format, parseISO } from 'date-fns'

import type { Task, TaskStatus } from '../../types'
import { PriorityBadge } from '../ui/PriorityBadge'

interface TaskBoardViewProps {
  tasks: Task[]
  onSelectTask: (taskId: string) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onMoveTask: (taskId: string, nextStatus: TaskStatus, overTaskId?: string | null) => void
}

const columns: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To do' },
  { status: 'in_progress', label: 'In progress' },
  { status: 'waiting', label: 'Waiting' },
  { status: 'done', label: 'Done' },
]

interface BoardCardProps {
  task: Task
  onSelectTask: (taskId: string) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

function BoardCard({ task, onSelectTask, onToggleTask, onDeleteTask }: BoardCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`rounded-xl border bg-white p-3 shadow-sm ${
        isDragging ? 'border-sky-300 ring-2 ring-sky-200' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onSelectTask(task.id)}
          className="min-w-0 flex-1 text-left"
          {...attributes}
          {...listeners}
        >
          <p className={`text-base font-semibold ${task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-900'}`}>
            {task.title}
          </p>
          <p className="mt-1 line-clamp-3 text-sm text-slate-600">{task.description}</p>
        </button>
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-1">{task.category}</span>
        <span>{task.dueDate ? format(parseISO(task.dueDate), 'MMM d') : 'No due date'}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <label className="inline-flex items-center gap-1 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={task.status === 'done'}
            onChange={() => onToggleTask(task.id)}
            className="size-3.5"
          />
          Done
        </label>
        <button
          type="button"
          onClick={() => onDeleteTask(task.id)}
          className="rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
        >
          Delete
        </button>
      </div>
    </article>
  )
}

interface BoardColumnProps {
  status: TaskStatus
  label: string
  tasks: Task[]
  onSelectTask: (taskId: string) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

function BoardColumn({ status, label, tasks, onSelectTask, onToggleTask, onDeleteTask }: BoardColumnProps) {
  const droppableId = `column-${status}`
  const { setNodeRef, isOver } = useDroppable({ id: droppableId })

  return (
    <section className="min-w-0 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">{tasks.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`min-h-24 space-y-2 rounded-xl p-1 transition ${
          isOver ? 'bg-sky-100/60' : 'bg-transparent'
        }`}
      >
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <BoardCard
              key={task.id}
              task={task}
              onSelectTask={onSelectTask}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </SortableContext>
      </div>
    </section>
  )
}

export function TaskBoardView({
  tasks,
  onSelectTask,
  onToggleTask,
  onDeleteTask,
  onMoveTask,
}: TaskBoardViewProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const grouped = {
    todo: tasks.filter((task) => task.status === 'todo'),
    in_progress: tasks.filter((task) => task.status === 'in_progress'),
    waiting: tasks.filter((task) => task.status === 'waiting'),
    done: tasks.filter((task) => task.status === 'done'),
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) {
      return
    }

    const activeTaskId = String(active.id)
    const overId = String(over.id)

    let nextStatus: TaskStatus | null = null
    let overTaskId: string | null = null

    if (overId.startsWith('column-')) {
      nextStatus = overId.replace('column-', '') as TaskStatus
    } else {
      const overTask = tasks.find((task) => task.id === overId)
      nextStatus = overTask?.status ?? null
      overTaskId = overTask?.id ?? null
    }

    if (!nextStatus) {
      return
    }

    onMoveTask(activeTaskId, nextStatus, overTaskId)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
        {columns.map((column) => (
          <BoardColumn
            key={column.status}
            status={column.status}
            label={column.label}
            tasks={grouped[column.status]}
            onSelectTask={onSelectTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </DndContext>
  )
}
