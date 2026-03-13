import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AppShell } from '../components/layout/AppShell'
import { HomePage } from './HomePage'
import { RouteErrorPage } from './RouteErrorPage'
import { SettingsPage } from './SettingsPage'
import { TaskViewPage } from './TaskViewPage'

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
    path: '/task-planner',
    element: <AppShell />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <TaskViewPage title="Inbox" preset="inbox" /> },
      { path: 'today', element: <TaskViewPage title="Today" preset="today" /> },
      { path: 'upcoming', element: <TaskViewPage title="Upcoming" preset="upcoming" /> },
      { path: 'overdue', element: <TaskViewPage title="Overdue" preset="overdue" /> },
      {
        path: 'completed',
        element: <TaskViewPage title="Completed" preset="completed" />,
      },
      { path: '*', element: <Navigate to="/task-planner" replace /> },
    ],
  },
  { path: '/today', element: <Navigate to="/task-planner/today" replace /> },
  { path: '/upcoming', element: <Navigate to="/task-planner/upcoming" replace /> },
  { path: '/overdue', element: <Navigate to="/task-planner/overdue" replace /> },
  { path: '/completed', element: <Navigate to="/task-planner/completed" replace /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
