export interface HubModuleDefinition {
  id: string
  title: string
  shortLabel: string
  description: string
  to: string
  tone: string
}

export const hubModules: HubModuleDefinition[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    shortLabel: 'Dashboard',
    description: 'Track progress, urgency, completion rate, and workload at a glance.',
    to: '/hub/dashboard',
    tone: 'from-sky-500 to-cyan-400',
  },
  {
    id: 'tasks',
    title: 'Task Manager',
    shortLabel: 'Tasks',
    description: 'Capture, prioritize, organize, and schedule tasks with multiple views.',
    to: '/hub/tasks',
    tone: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'today',
    title: 'Today Focus',
    shortLabel: 'Today',
    description: 'See today\'s priorities, overdue work, and suggested next actions.',
    to: '/hub/today',
    tone: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'calendar',
    title: 'Calendar Planner',
    shortLabel: 'Calendar',
    description: 'Combine scheduled events with task blocks and free-time suggestions.',
    to: '/hub/calendar',
    tone: 'from-amber-500 to-orange-400',
  },
  {
    id: 'projects',
    title: 'Projects',
    shortLabel: 'Projects',
    description: 'Group work by project or category and prepare for tracker-level analytics.',
    to: '/hub/projects',
    tone: 'from-fuchsia-500 to-rose-400',
  },
  {
    id: 'notes',
    title: 'Notes & Knowledge',
    shortLabel: 'Notes',
    description: 'Attach supporting context, SOPs, meeting notes, and reusable templates.',
    to: '/hub/notes',
    tone: 'from-violet-500 to-purple-400',
  },
  {
    id: 'reminders',
    title: 'Reminder Center',
    shortLabel: 'Reminders',
    description: 'Manage due reminders, snoozes, notification placeholders, and follow-ups.',
    to: '/hub/reminders',
    tone: 'from-pink-500 to-rose-400',
  },
  {
    id: 'focus',
    title: 'Focus Timer',
    shortLabel: 'Focus',
    description: 'Run Pomodoro or custom sessions and associate focus time with tasks.',
    to: '/hub/focus',
    tone: 'from-slate-700 to-slate-500',
  },
]

export const plannerNavItems = [
  { label: 'Inbox', to: '/hub/tasks' },
  { label: 'Upcoming', to: '/hub/tasks/upcoming' },
  { label: 'Overdue', to: '/hub/tasks/overdue' },
  { label: 'Completed', to: '/hub/tasks/completed' },
]