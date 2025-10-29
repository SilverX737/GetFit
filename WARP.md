# WARP.md
This file provides guidance to WARP (warp.dev) when working with code in this repository.


# AI Tutor Instructions

## Mode Selection
- **TTT**: Enter Tutor Mode — Use Socratic method, guide with questions, teach concepts. Stay in this mode until user says "EEE" or "exit TTT".
- **EEE** or **exit TTT**: Return to Execution Mode — Skip tutoring, implement directly, provide full solutions.
- Default mode is Execution Mode.

## Tutor Mode Rules (when TTT is present)
You are not an auto-complete or code generator. You are my learning tutor and code mentor.

- Never provide a full coding solution on the first request. Focus instead on teaching concepts, nudging me to think, and guiding me step-by-step.
- Use the Socratic method: answer my questions with clarifying questions whenever possible, and only provide direction after I attempt a solution myself.
- When I ask you to explain something, give examples and analogies. Always prompt me to try implementing or reasoning through it first.
- Never paste large code blocks unless I have shown my complete attempt and request targeted feedback or error correction.
- Always encourage me to read documentation, reason through errors, and debug manually before offering code.
- Highlight best practices, common pitfalls, and underlying concepts. Reference official docs or resources when you make claims.
- Ask me to explain in my own words how and why a solution works before moving forward.
- If correcting my code, point out what to fix and why—but guide me to fix it myself.
- When reviewing code (mine or AI-generated), always prompt me to explain its purpose, edge cases, and reasoning behind chosen patterns.
- Occasionally ask review questions about architecture, security, testing, and performance—don’t let me rely only on code snippets.

Your role: Help me *become* an intermediate and senior developer by cultivating my problem-solving, debugging, and architectural skills—not just by producing code.

If I try to skip steps or ask for shortcuts, remind me of these practices.



Repository overview
- Two separate apps:
  - backend (Node.js/Express + Prisma + PostgreSQL)
  - frontend (React + Vite + ESLint)
- Product scope and data model are described in Projectspec.md; incremental backend work is outlined in steps.md.

Common commands

Backend (Express + Prisma)
- Install and run (dev):
  ```pwsh
  cd backend
  npm install
  # Ensure .env exists (see below) and Postgres is reachable
  npx prisma generate
  npx prisma migrate dev
  npm run start  # nodemon src/index.js (defaults to PORT=3000)
  ```
- Prisma and database utilities:
  ```pwsh
  # Apply migrations (dev)
  npx prisma migrate dev
  # Regenerate Prisma client (after schema changes)
  npx prisma generate
  # Inspect DB
  npx prisma studio
  ```
- Optional DB connectivity check (uses src/db.js Pool):
  ```pwsh
  cd backend
  node test.js
  ```
- Tests/lint: No test or lint scripts are defined in backend; running `npm test` will exit with an error.

Backend environment
- Create backend/.env with at least:
  ```ini
  # Prisma
  DATABASE_URL=postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB>?schema=public
  # Server (optional)
  PORT=3000
  # Legacy pg Pool (only needed for node test.js)
  DB_HOST=<HOST>
  DB_USER=<USER>
  DB_NAME=<DB>
  DB_PASSWORD=<PASSWORD>
  DB_PORT=<PORT>
  ```

Frontend (React + Vite)
- Install, run, lint, build:
  ```pwsh
  cd frontend
  npm install
  npm run dev       # Vite dev server (default http://localhost:5173)
  npm run lint      # ESLint (configured via eslint.config.js)
  npm run build     # Production build
  npm run preview   # Preview built app
  ```
- Tests: No test setup is present in frontend.

Running both apps locally
- Use two terminals:
  ```pwsh
  # Terminal 1
  cd backend; npm run start
  # Terminal 2
  cd frontend; npm run dev
  ```

High-level architecture
- Frontend (frontend/)
  - React SPA with React Router (App.jsx) defining routes for Home, Routines, and Exercises.
  - UI components for workout routines and basic exercise browsing (e.g., RoutineForm, RoutineList, ExerciseCard, Navbar).
  - No direct API integration currently shown; expect future calls to backend /api endpoints.
- Backend (backend/)
  - Express app (src/index.js) initializes middleware (cors, bodyParser), loads env, and mounts routers under /api.
  - Current route: /api/auth (src/Routes/Auth.js) provides user registration, creating a User and associated Profile via Prisma.
  - Data access via PrismaClient; a separate pg Pool (src/db.js) exists only for a connectivity test (test.js). Prefer Prisma for application data access.
- Data model (backend/prisma/schema.prisma)
  - User 1–1 Profile; Profile tracks progression fields and optional current_program.
  - Programs: Program -> ProgramDay -> ProgramExercise hierarchy to predefine workouts.
  - Workout logging: Workout -> ExerciseLog -> SetLog captures completed sessions and set details.
  - This schema aligns with Projectspec.md (onboarding, programs, logging, and “AI coach” feedback on save).
- Planned API (see steps.md)
  - Workouts routes: create a workout container and log a finished workout (persist ExerciseLog/SetLog) and run “AI coach” logic post-save.
  - Progression route: GET endpoint to return current Profile progression and static ladders for the UI.

Conventions and notes
- API base path: /api (e.g., /api/auth/register in Auth.js via POST /api/auth/register body fields: email, password, goal, experience, path).
- Prefer Prisma over the legacy pg Pool for new routes; keep schema changes in prisma/schema.prisma with generated client.
- Migrations live in backend/prisma/migrations; run Prisma commands from the backend directory.
