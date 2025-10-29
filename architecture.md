# Architecture Overview

Project summary
- GetFit is a two-tier web application with a React single-page frontend and a Node.js/Express backend backed by PostgreSQL via Prisma ORM.
- Product scope and schema are defined in Projectspec.md; upcoming backend work is outlined in steps.md.

Top-level components

1) Frontend (frontend/)
- Stack: React 18, Vite, React Router, ESLint.
- Entry and routing: `src/main.jsx` mounts `App`; `src/App.jsx` defines routes for Home (`/`), Routines (`/Routines`), and Exercises (`/exercises`).
- UI composition:
  - Navigation: `components/Navbar.jsx` (links to main routes).
  - Routines: `components/RoutineForm.jsx` and `components/RoutineList.jsx` manage routine definitions entirely in local state; no persistence yet.
  - Exercises: `pages/Exercises.jsx` renders a small, static exercise catalog filtered client-side; `components/ExerciseCard.jsx` displays items.
  - Home: `pages/Home.jsx` provides CTAs (no backend wiring yet).
- API integration: None implemented yet; the SPA is set up to later call backend `/api/*` endpoints.

2) Backend (backend/)
- Stack: Node.js, Express, CORS, body-parser, dotenv, Prisma ORM for PostgreSQL.
- Entry: `src/index.js` loads env, configures middleware, initializes `PrismaClient`, and mounts routers under `/api`.
- Auth service: `src/Routes/Auth.js` exposes `POST /api/auth/register` to create a `User` and associated `Profile` (hashes password with bcrypt, handles unique email with Prisma code P2002).
- Data access:
  - Primary: Prisma (`@prisma/client`) for all app data.
  - Legacy utility: `src/db.js` provides a `pg` Pool used only by `backend/test.js` to verify DB connectivity; production endpoints should use Prisma.
- Configuration: `.env` expected to define `DATABASE_URL` (Prisma) and optional `PORT` (defaults to 3000).

3) Database (backend/prisma/schema.prisma)
- Datasource: PostgreSQL via `DATABASE_URL`.
- Entities and relationships (conceptual):
  - User 1—1 Profile (Profile holds goal, experience, path, progression fields, and optional `current_program`).
  - Program 1—many ProgramDay 1—many ProgramExercise (predefined training plans).
  - Workout 1—many ExerciseLog 1—many SetLog (captured training sessions, per-exercise sets/reps/weight/RPE).
- Migrations live under `backend/prisma/migrations/`.

Data flow and interactions (current state)
- User registration:
  - Client (future) → `POST /api/auth/register` with `{ email, password, goal, experience, path }`.
  - Server validates presence, hashes password, creates `User` and nested `Profile` via Prisma, returns the created record (including `profile`).
- There are no other wired frontend→backend flows yet; the frontend currently runs purely client-side.

Planned flows (from steps.md; not yet implemented)
- Workouts API: create a workout container, persist exercise/set logs, and trigger rule-based “AI Coach” feedback after save.
- Progression API: return current progression levels and predefined ladders for the frontend’s Progression view.

Key responsibilities by layer
- Frontend: route-based UI, client-side state for routines/exercises, future integration with `/api/*` for auth, programs, workouts, and progression.
- Backend: REST API under `/api`, data validation and transformation, business rules (e.g., progression and coaching logic), persistence via Prisma.
- Database: normalized relational model capturing users, programs, logs, and progressions to support analytics and rule-based guidance.

Notable dependencies
- Frontend: react, react-router-dom, vite; eslint for linting.
- Backend: express, @prisma/client + prisma CLI, bcrypt, pg (indirectly via Prisma), cors, dotenv; nodemon for dev.
