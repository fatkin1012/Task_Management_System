import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

export function RouteErrorPage() {
  const error = useRouteError()

  let title = 'Something went wrong'
  let message = 'Please try again or return to the home page.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page not found'
      message = 'The page you requested does not exist or was moved.'
    } else {
      title = `${error.status} ${error.statusText}`
      message = typeof error.data === 'string' ? error.data : message
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        Task Planner
      </p>
      <h1 className="mt-4 text-4xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-slate-600">{message}</p>
      <div className="mt-8 flex items-center gap-3">
        <Link
          to="/"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Go to Home
        </Link>
        <Link
          to="/task-planner"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
        >
          Open Task Planner
        </Link>
      </div>
    </main>
  )
}
