import { useState } from 'react'

import { useTaskStore } from '../../store/taskStore'
import { useUiStore } from '../../store/uiStore'

export function QuickCapturePanel() {
  const isOpen = useUiStore((state) => state.isQuickCaptureOpen)
  const setOpen = useUiStore((state) => state.setQuickCaptureOpen)
  const addTask = useTaskStore((state) => state.addTask)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      return
    }

    addTask({
      title: trimmedTitle,
      description: '',
      status: 'todo',
      priority,
      dueDate: null,
      dueTime: null,
      estimatedDurationMinutes: 30,
      category: 'Inbox',
      projectId: null,
      tags: [],
      reminder: null,
      pinned: false,
    })

    setTitle('')
    setPriority('medium')
    setOpen(false)
  }

  if (!isOpen) {
    return null
  }

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Quick Capture</p>
          <p className="mt-1 text-xs text-slate-500">Press Enter to send a rough task into Inbox for later processing.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-[1fr_160px_auto]">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          autoFocus
          placeholder="Capture a task quickly"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value as typeof priority)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
          <option value="urgent">Urgent priority</option>
        </select>
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Add to Inbox
        </button>
      </form>
    </section>
  )
}