Pomodoro
Habit tracker
calender view
SOP assit
Automation??

How to make this more business worthy


Micro-Habit Builder: an app that helps users build tiny habits (30s–5min). Uses streaks, gentle nudges, context triggers (location, time, weather), and micro-rewards. Offers customizable habit templates and habit chains (e.g., "after brushing -> 1min stretch").

Skill Snack Marketplace: short, focused lessons (2–8 minutes) for practical skills: speed reading, Excel trick, basic car maintenance, quick recipes. Users buy or trade "snack packs." Includes progress badges and a “practice timer” to keep sessions tiny and consistent.

Quiet Commute: ambient-sound + productivity app that turns commute time into micro-work sessions without stress. Offers curated playlists, single-task prompts (read one article, reply to 2 emails), and commute-safe activities like vocabulary flashcards or mindfulness.

Shared Pantry: community app for neighbors to share surplus food and household items. Simple posting, pickup scheduling, swap credits, safety checks, and an automatic grocery-match feature that suggests who might want an item.

Focus Friend: pair users together for timed co-working sprints with built-in accountability. Option for anonymous partners, optional voice check-ins at start/end, and a leaderboard for consistency. Integrates with calendars and has Pomodoro, ultradian, and custom modes.

Second-Brain Clips: capture short notes (text, voice, photo) and auto-summarize into searchable “clips.” Smart tags, link suggestions, and daily review prompts turn loose ideas into useful reminders and project seeds.

Plant Clinic AR: point your camera at a plant to diagnose issues (water, light, pests) and get step-by-step fixes. Schedules watering reminders, pest-check walks, and suggests compatible companion plants for your space.

Recipe Remix: scan your fridge items and get recipe suggestions that maximize use-by dates and minimize waste. Supports dietary filters, portion scaling, shopping-list auto-updates, and a “leftover challenge” mode for creative meals.

Crowdsourced Commute Maps: crowdsourced updates for bicycle and walking routes—reports hazards, surface quality, lighting, and crowding. Users get safer, faster routes and earn reputation for reliable reports. Integrates with mapping apps.

Therapy Prep Notebook: private app to capture emotions, triggers, and session notes between therapy visits. Prompts for reflection, mood graphs, and exportable summaries to share with therapists. Includes emergency resources and grounding exercises.

Skill-Swap Local: local community barter for teaching sessions—teach guitar for language lessons, trade one-hour sessions, with built-in scheduling, reviews, and simple credits for multi-party swaps.

Digital Declutter Coach: helps users trim apps, files, and email. Suggests low-effort cleanups (archive 20 emails, delete 5 apps not used in 6 months), tracks progress, and shows storage/time savings.

Pocket Volunteer: micro-volunteering tasks you can do in 5–30 minutes from home or on the go—labeling images, short translations, mentoring quick questions. Connects NGOs with volunteers and tracks impact minutes.

Night Mode Journal: two-minute end-of-day journal with mood emoji, three wins, one challenge, and a short voice note. Generates weekly summaries and gentle growth prompts.

Freelance Micro-Gigs: short, fixed-scope gigs for freelancers (logo tweak, 500-word edit). Standardized pricing tiers, quick escrow, templates for briefs, fast-turnaround onboarding for repeat clients.


# Task Planner Hub

A modular productivity hub built with Vite + React + TypeScript.

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

## Phase 1 architecture

- Modular app shell with shared navigation
- Hub routes for dashboard, tasks, today, calendar, projects, notes, reminders, and focus
- Shared TypeScript models for task, project, note, reminder, planner, focus, and dashboard domains
- Existing task planner preserved as the first functional module under the hub shell

## Folder direction

```text
src/
  app/
  components/
    calendar/
    dashboard/
    layout/
    tasks/
    ui/
  data/
  hooks/
  lib/
  pages/
  services/
  store/
  styles/
  types/
```

## Implemented modules

- Home page with function navigation
- Task Planner Hub shell with:
  - dashboard route
  - task manager route
  - today focus route
  - calendar route scaffold
  - notes route scaffold
  - reminder route scaffold
  - focus route scaffold
- Task manager module with:
  - dashboard summary
  - list view
  - board view (drag-and-drop)
  - task detail panel/drawer
  - add/edit/delete/toggle task CRUD
  - localStorage persistence
- Google Calendar integration architecture with mock fallback

## Install

```bash
npm install
npm run dev
```

Optional dependencies already prepared in `package.json` for future analytics work:

- `recharts` for dashboard charts

## Google Calendar integration

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
