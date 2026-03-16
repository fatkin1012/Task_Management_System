import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AppShell } from '../components/layout/AppShell'
import { CalendarPage } from './CalendarPage'
import { DashboardPage } from './DashboardPage'
import { FocusPage } from './FocusPage'
import { HomePage } from './HomePage'
import { NotesPage } from './NotesPage'
import { ProjectsPage } from './ProjectsPage'
import { RemindersPage } from './RemindersPage'
import { RouteErrorPage } from './RouteErrorPage'
import { SettingsPage } from './SettingsPage'
import { TaskViewPage } from './TaskViewPage'
import { TodayPage } from './TodayPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/hub',
    element: <AppShell />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'tasks', element: <TaskViewPage title="Inbox" preset="inbox" /> },
      { path: 'today', element: <TodayPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'notes', element: <NotesPage /> },
      { path: 'reminders', element: <RemindersPage /> },
      { path: 'focus', element: <FocusPage /> },
      { path: 'tasks/upcoming', element: <TaskViewPage title="Upcoming" preset="upcoming" /> },
      { path: 'tasks/overdue', element: <TaskViewPage title="Overdue" preset="overdue" /> },
      {
        path: 'tasks/completed',
        element: <TaskViewPage title="Completed" preset="completed" />,
      },
      { path: '*', element: <Navigate to="/hub/dashboard" replace /> },
    ],
  },
  { path: '/task-planner', element: <Navigate to="/hub/tasks" replace /> },
  { path: '/task-planner/today', element: <Navigate to="/hub/today" replace /> },
  { path: '/task-planner/upcoming', element: <Navigate to="/hub/tasks/upcoming" replace /> },
  { path: '/task-planner/overdue', element: <Navigate to="/hub/tasks/overdue" replace /> },
  { path: '/task-planner/completed', element: <Navigate to="/hub/tasks/completed" replace /> },
  { path: '/today', element: <Navigate to="/hub/today" replace /> },
  { path: '/upcoming', element: <Navigate to="/hub/tasks/upcoming" replace /> },
  { path: '/overdue', element: <Navigate to="/hub/tasks/overdue" replace /> },
  { path: '/completed', element: <Navigate to="/hub/tasks/completed" replace /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
