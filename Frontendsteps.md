# Frontend Implementation Plan (V1) — Deep Dive

Decision: build on the current codebase
- Keep the existing React + Vite app and extend it. It’s a clean baseline with Router and basic pages.
- Immediate cleanups while extending:
  - Standardize route paths to lowercase ("/routines" not "/Routines").
  - Use "/download.png" from `public/` in Navbar or import the asset to avoid prod path issues.
  - Remove unused demo code as new features land.

Objectives (mapped to Projectspec.md)
- Onboarding: account creation + profile setup + initial program selection.
- Dashboard: CTA for “Today’s Workout” (if on program) or “Start New Workout” (freestyle), last-workout summary.
- Program Library: browse, view details, and select program.
- Workout Logger: pre-populated when on a program; capture sets, reps, weight (WL only), RPE, notes; rest timer; submit and show coach feedback.
- History: list and detail views of past workouts.
- Progression View (calisthenics): ladders + current step highlighting.

Development principles
- Contract-first: lock API shapes below and mock with MSW to build UI independently.
- Separate server state from local UI state; centralize API calls in `src/api/`.
- Guard protected routes with a simple token check and graceful 401 handling.

Routing map
- / (Dashboard)
- /login, /register (Auth)
- /onboarding (Profile + Program selection)
- /programs, /programs/:id (Library)
- /workout/new (Create session, redirect to logger)
- /workouts/:id (Logger)
- /history, /history/:id (History)
- /progression (Calisthenics View)

Directory structure (target)
- src/api/
  - apiClient.js, auth.js, programs.js, workouts.js, progression.js
- src/auth/
  - Login.jsx, Register.jsx, ProtectedRoute.jsx
- src/onboarding/
  - Onboarding.jsx, ProgramPicker.jsx
- src/programs/
  - ProgramList.jsx, ProgramDetail.jsx
- src/dashboard/
  - Dashboard.jsx, LastWorkoutCard.jsx
- src/workouts/
  - Logger.jsx, ExerciseEditor.jsx, SetRow.jsx, RPEDropdown.jsx, RestTimer.jsx, CoachModal.jsx
- src/history/
  - HistoryList.jsx, HistoryDetail.jsx
- src/progression/
  - ProgressionView.jsx, Ladder.jsx
- src/state/
  - auth.js (token bootstrap), userStore.js (optional)

API contracts (frontend expectations)
- POST /api/auth/register { email, password, goal, experience, path } -> 201 { id, email, created_at, profile }
- POST /api/auth/login { email, password } -> 200 { token, user: { id, email } }
- GET /api/me -> 200 { id, email, profile: { path, current_program_id, current_program_day, pushup_step, ... } }
- GET /api/programs -> 200 [ { id, name, path, description } ]
- GET /api/programs/:id -> 200 { id, name, path, description, days: [ { id, day_name, day_order, exercises: [ { exercise_name, target_sets, target_reps } ] } ] }
- POST /api/profile/program { program_id } -> 200 { current_program_id, current_program_day }
- GET /api/programs/current/day -> 200 { id, day_name, day_order, exercises: [ ... ] }
- POST /api/workouts -> 201 { id, timestamp, planned?: [ { exercise_name, target_sets, target_reps } ] }
- POST /api/workouts/:id/log { exercises: [ { name, rpe?, notes?, sets: [ { reps, weight? } ] } ] } -> 200 { workoutId, updatedProfile, coach: [ { type, message } ] }
- GET /api/workouts?limit=&cursor= -> 200 { items: [ { id, timestamp, summary } ], nextCursor?: string }
- GET /api/workouts/:id -> 200 { id, timestamp, exercises: [ { name, rpe?, notes?, sets: [ { reps, weight? } ] } ] }
- GET /api/progression -> 200 { profile: { pushup_step, pullup_step, squat_step }, ladders: { pushups: string[], pullups: string[], squats: string[] } }

Milestones (What / Why / Detailed Acceptance / Edge cases)

1) Infra & API client + MSW
- What
  - Add `VITE_API_URL` support; create `apiClient.js` handling base URL, JSON, errors, and Bearer token.
  - `auth.js` with login/register/boot/logout; simple in-memory token + localStorage persistence.
  - MSW handlers for all endpoints above (happy path + common errors: 400/401).
- Why
  - Enables parallel UI dev with stable contracts; quick error-state testing.
- Acceptance
  - App renders with MSW; calling `/api/me` with no token yields 401 and triggers redirect on protected pages.
- Edge cases
  - Network error surfaces toast; 401 clears token and redirects to /login.

2) Auth pages (/register, /login)
- What
  - Register form: email, password, goal, experience, path; handles backend 409 (duplicate email).
  - Login form: on success store token, fetch /api/me, redirect to /.
- Why
  - Authenticated user is the foundation for all flows.
- Acceptance
  - Client validation (email format, password min length); server errors show inline.
  - Token persists across reload (bootstrap from localStorage).
- Edge cases
  - Duplicate email (409); invalid creds (401); password edge (min length).

3) Onboarding (/onboarding)
- What
  - Two-step wizard: Profile (goal, experience, path) -> Program selection (optional "Freestyle").
  - If program chosen: POST /api/profile/program, else proceed freestyle.
- Why
  - Establishes profile context for Dashboard CTA and pre-population.
- Acceptance
  - After finishing: / shows correct CTA; /progression link visible only for calisthenics path.
- Edge cases
  - Switching path filters program list; selecting a new program resets current day (UI notice).

4) Program Library (/programs, /programs/:id)
- What
  - List with filters: path (Weightlifting/Calisthenics) and text search.
  - Details show ordered days and exercises; “Select Program” button.
- Why
  - Users can browse and switch programs later.
- Acceptance
  - Selecting a program updates profile and Dashboard CTA immediately.
- Edge cases
  - Empty list; slow network (skeletons); already-selected program (disabled select button).

5) Dashboard (/)
- What
  - Fetch /api/me and /api/programs/current/day (if program active), and GET /api/summary/last-workout (optional).
  - CTA:
    - If program: “Start Today’s Workout: [Day Name]” -> /workout/new
    - If freestyle: “Start New Workout” -> /workout/new
    - If an open workout exists (backend optional): show “Continue workout”.
- Why
  - Central hub per spec.
- Acceptance
  - CTA correct for each state; links to Programs/Progression/History present.
- Edge cases
  - No program (freestyle); day wrapping; slow network (skeletons).

6) Create Workout (/workout/new)
- What
  - POST /api/workouts; if planned present, pass through to logger for pre-population; redirect to /workouts/:id.
- Why
  - Normalizes session creation across modes.
- Acceptance
  - Logger receives planned items when on program.
- Edge cases
  - POST failure -> show error and stay on Dashboard; double-click prevention.

7) Logger (/workouts/:id)
- What
  - Display planned or empty exercise list; add/remove exercises and sets.
  - Fields: name (typeahead optional later), reps (int), weight (float, only Weightlifting path), RPE (1–10 dropdown), notes.
  - Rest timer: simple per-exercise timer with presets (30/60/90/120s) and a stopwatch mode.
  - Submit logs -> POST /api/workouts/:id/log; show CoachModal with messages; then offer “Back to Dashboard” + “View History”.
- Why
  - Core logging experience and immediate feedback.
- Acceptance
  - Client validation; successful submit navigates or stays with success state and clears/edit locks.
- Edge cases
  - RPE optional vs required? (Default optional; validate if provided must be 1–10.)
  - Calisthenics path hides weight; still handle if provided.

8) History (/history, /history/:id)
- What
  - List (paginated reverse-chronological) with basic filters (by path or search by exercise name, optional for V1).
  - Detail shows nested logs.
- Why
  - Review improvements and prior sessions.
- Acceptance
  - Handles empty state; stable pagination; detail shows all fields.
- Edge cases
  - Deleted workouts (404 handling); pagination end.

9) Progression (/progression)
- What
  - Render ladders from GET /api/progression; highlight current step per profile; show a small hint for the next step.
- Why
  - Visualizes progress and communicates advancement.
- Acceptance
  - Updates after a workout if profile changed.
- Edge cases
  - Non-calisthenics path hides entry point from Dashboard.

10) Errors, loading, a11y, responsiveness
- What
  - Consistent loading skeletons; error toasts; descriptive aria-labels; keyboard focus states; mobile-friendly layout.
- Why
  - Usable and accessible product.
- Acceptance
  - Lighthouse basic a11y checks pass; forms are keyboard navigable.

11) Switch from mocks to backend
- What
  - Change base URL, disable MSW in prod/dev toggle, verify E2E flows.
- Acceptance
  - Happy path: register → login → select program → start → log → coach → history → progression.

API client snippet (example)
```js
// src/api/apiClient.js
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
let token = null;
export function setToken(t) { token = t; }
export function clearToken() { token = null; }
export async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    const message = data?.error?.message || res.statusText;
    throw new Error(message);
  }
  return data;
}
```

MSW handler sketch (login + programs)
```js
// src/msw/handlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('http://localhost:3000/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();
    if (email === 'demo@x.com' && password === 'demo') {
      return HttpResponse.json({ token: 'fake.jwt', user: { id: 1, email } });
    }
    return new HttpResponse(JSON.stringify({ error: { message: 'Invalid credentials' } }), { status: 401 });
  }),
  http.get('http://localhost:3000/api/programs', () =>
    HttpResponse.json([{ id: 1, name: 'Beginner LP', path: 'Weightlifting' }])
  ),
];
```

Definition of Done (frontend V1)
- All pages implemented per routes above with loading/error states.
- Auth token persisted; protected routes enforced; 401 handling verified.
- Logger submits data and shows coach feedback; calisthenics and weightlifting toggles work.
- Program selection updates dashboard CTA and current day.
- History list + detail render real data; Progression view reflects profile.

Open questions to clarify
1) Tokens: JWT in Authorization header for V1? Persist in localStorage is acceptable?
2) Onboarding: combine profile + program selection in one wizard, correct?
3) Logger: Is RPE required on every exercise, or optional? Is weight hidden for calisthenics?
4) Rest timer: per-exercise or global? Presets (30/60/90/120s) acceptable for V1?
5) Program change: should it reset `current_program_day` to 0 every time?
6) Dashboard after logging: redirect to Dashboard immediately, or show workout summary first?
7) Any brand/style constraints to apply globally now (colors, typography) or keep minimal?
