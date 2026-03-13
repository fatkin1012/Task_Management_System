# Task Planner

A modular productivity web app built with Vite + React + TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Implemented modules

- Home page with function navigation
- Task Planner module with:
  - dashboard summary
  - list view
  - board view (drag-and-drop)
  - task detail panel/drawer
  - add/edit/delete/toggle task CRUD
  - localStorage persistence
- Google Calendar integration architecture (Phase 4)

## Google Calendar integration (Phase 4)

The app uses a service abstraction in `src/services/googleCalendarService.ts`.

Pattern:

- Browser-based JavaScript integration style (Google Identity Services + gapi client TODO)
- Service methods for:
  - sign in/auth
  - read today's events
  - create event from task
  - free/busy lookup
  - schedule suggestion from free/busy
- Mock fallback implementation is provided so UI works without credentials.

### Environment setup

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

Variables:

- `VITE_GOOGLE_USE_MOCK=true` keeps mock mode enabled
- Set `VITE_GOOGLE_USE_MOCK=false` and provide real values for:
  - `VITE_GOOGLE_CLIENT_ID`
  - `VITE_GOOGLE_API_KEY`
  - `VITE_GOOGLE_DISCOVERY_DOC`
  - `VITE_GOOGLE_SCOPES`

### What is mocked vs real

- Mocked by default:
  - auth/sign-in result
  - today events
  - free/busy data
  - event creation result
- Real browser OAuth/API calls:
  - scaffolded via TODOs in service abstraction
  - requires Google Cloud credentials and OAuth configuration

### Important limitation

Google Calendar watch/push sync is not implemented in frontend-only mode.

TODO: watch channels/webhook push sync requires a backend endpoint to receive and validate webhook notifications.
