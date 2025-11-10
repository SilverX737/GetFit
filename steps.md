# Backend Implementation Plan for AI Workout Coach (Deep Dive: What + Why + Resources)

This plan expands the V1 backend to cover authentication, programs, workout logging with AI coach, progression, and history. Each step now includes detailed What (deliverables), Why (rationale and tradeoffs), API contracts, validation/security notes, and a brief test checklist. Odin Project (TOP) topics are noted where relevant.

---

### Step 0: Setup & Environment
- What
  - Create `backend/.env` with `DATABASE_URL`, optional `PORT`.
  - Initialize Prisma client and schema: `npx prisma generate && npx prisma migrate dev`.
  - Verify DB connectivity (optional): `node backend/test.js`.
  - Add `JWT_SECRET` and `CORS_ORIGIN` to `.env`; fail fast on boot if missing.
  - Use Prisma as the only DB client; remove any legacy `pg` pools (e.g., `backend/src/db.js`) and update `test.js` to use Prisma (`prisma.$queryRaw('SELECT 1')`).
- Why
  - Aligns schema and codegen before building features; prevents “migrate later” churn.
  - Early DB verification reduces time debugging app-level issues that are actually env problems.
- Resources
  - Prisma: Getting Started; Prisma: Migrate; TOP: NodeJS course overview; TOP: Environment Variables.
- Tests (smoke)
  - Prisma client instantiates without error.
  - `prisma.$queryRaw` SELECT 1 succeeds.

---

### Step 1: Authentication — Register and Login (JWT)
- What
  - Keep `POST /api/auth/register` that creates `User` + nested `Profile`; never return `password_hash`.
  - Add `POST /api/auth/login` that verifies email/password and issues a JWT (e.g., HS256) with `sub=user.id`.
  - Add password policy (min length), email format check, duplicate email handling.
- Why
  - V1 requires authenticated users to associate workouts and progression with an account.
  - JWT enables stateless auth suitable for SPA + API without server-side sessions.
- API (contracts)
  - POST /api/auth/register
    - Body: { email, password, goal, experience, path }
    - 201 -> { id, email, created_at, profile: { ... } }
  - POST /api/auth/login
    - Body: { email, password }
    - 200 -> { token, user: { id, email } }
- Validation & Security
  - Hash passwords with bcrypt (10–12 rounds). Constant-time compare.
  - On login, generic error for invalid creds (avoid user enumeration).
  - JWT expiry (e.g., 1h). Consider refresh token later (V2).
  - Require `process.env.JWT_SECRET` (HS256); refuse to start if missing.
  - Normalize emails to lowercase before unique checks and login.
- Resources
  - TOP: Authentication Basics; TOP: JSON Web Tokens; Express Security Best Practices; bcrypt docs; jsonwebtoken docs.
- Tests
  - Register returns 201 without password_hash.
  - Login with correct creds returns token; wrong creds returns 401.

---

### Step 2: Auth Middleware and Current User
- What
  - Auth middleware validates `Authorization: Bearer <JWT>`, attaches `req.user` (id/email).
  - `GET /api/me` returns current user and profile basics.
  - Protect all stateful routes under `/api/*` except `/api/auth/*` and read-only program browse.
- Why
  - Prevents unauthorized access to user-bound resources; provides a single source of truth for the session.
- API
  - GET /api/me -> 200 { id, email, profile: { ... } }
- Validation & Security
  - Reject missing/invalid tokens with 401; do not leak parsing details.
  - Optional: role/claims for future expansion.
- Resources
  - TOP: Middleware patterns; jsonwebtoken docs; OWASP session management (JWT section).
- Tests
  - Protected route without token -> 401.
  - With token -> 200 and correct user payload.

---

### Step 3: Program Library — Seed Data and Browse
- What
  - Seed `Program`, `ProgramDay`, `ProgramExercise` with at least one weightlifting and one calisthenics program.
  - Endpoints: `GET /api/programs` (list summary), `GET /api/programs/:id` (details with days + exercises).
  - Add Prisma seeding scaffold: create `prisma/seed.js` and set `"prisma": { "seed": "node prisma/seed.js" }` in `package.json`.
- Why
  - Enables onboarding to pick a program and powers pre-populated workouts.
- API
  - GET /api/programs -> 200 [ { id, name, path, description } ]
  - GET /api/programs/:id -> 200 { id, name, path, description, days: [ { day_name, day_order, exercises: [...] } ] }
- Validation & Security
  - Public read-only; ensure no sensitive fields in payloads.
- Resources
  - Prisma: Seeding; TOP: Relational DBs (one-to-many); Prisma Relations.
- Tests
  - Seeds load successfully; endpoints return expected shapes and ordering by `day_order`.

---

### Step 4: Select/Change Current Program and Resolve Today’s Day
- What
  - `POST /api/profile/program` sets `current_program_id` and resets `current_program_day` to 0.
  - `GET /api/programs/current/day` returns the `ProgramDay` for `current_program_day` (modulo total days).
- Why
  - Drives Dashboard CTA and anchors the pre-population logic.
- API
  - POST /api/profile/program { program_id } -> 200 { current_program_id, current_program_day }
  - GET /api/programs/current/day -> 200 { day_name, day_order, exercises: [...] }
- Validation & Security
  - Auth required; ensure program_id exists and matches allowed `path` if you enforce constraints.
- Resources
  - TOP: REST API design; Prisma filtering/pagination.
- Tests
  - Switching program resets day index.
  - Current day wraps correctly after last day.

---

### Step 5: Create Workout (Pre-Populated when on Program)
- What
  - `POST /api/workouts` creates a new Workout for the user’s profile.
  - If on a program, return planned exercises/targets from current day to assist the client in pre-population.
- Why
  - Establishes a container for logging; supports both program and freestyle.
- API
  - POST /api/workouts -> 201 { id, timestamp, planned: [ { exercise_name, target_sets, target_reps } ] }
- Validation & Security
  - Auth required; only one “open” workout at a time (optional constraint).
- Resources
  - TOP: Controllers & routing; Prisma: nested reads.
- Tests
  - Creates workout tied to profile; returns planned list when applicable.

---

### Step 6: Log Workout and Complete (+ AI Coach)
- What
  - `POST /api/workouts/:id/log` accepts full workout payload and persists `ExerciseLog` + `SetLog`, marks workout as completed.
  - Increment `current_program_day` (wrap) if on program, and run AI Coach rules to compute messages and progression updates.
- Why
  - Core value: capture data and deliver actionable feedback immediately.
- API
  - POST /api/workouts/:id/log -> 200 { workoutId, updatedProfile, coach: [ { type, message } ] }
- Validation & Security
  - Validate exercise names, sets array, numeric ranges (reps >= 0, weight >= 0, RPE 1–10).
  - Wrap in a database transaction to ensure all-or-nothing consistency.
- Resources
  - Prisma: Transactions; TOP: SQL Transactions; Rule-based logic primers.
- Tests
  - Fails cleanly on invalid payload; successful log persists nested data and advances day when criteria met.

---

### Step 7: AI Coach Service (Rule-Based)
- What
  - Implement as a pure module (no Express) taking profile + recent workout logs and returning updates + messages.
  - Calisthenics: advance steps when goals met with RPE ≤ threshold. Weightlifting: suggest next load when RPE ≤ 8.
- Why
  - Separation enables unit testing and iteration without touching controllers.
- Resources
  - TOP: Project organization; Refactoring to services; Testing fundamentals.
- Tests
  - Unit tests for boundary conditions (exactly at thresholds, off-by-one reps, missing RPE).

---

### Step 8: Progression API
- What
  - `GET /api/progression` returns profile progression fields and static ladders for push-ups, pull-ups, squats.
- Why
  - Powers the Progression View without additional client logic.
- API
  - GET /api/progression -> 200 { profile: { pushup_step, pullup_step, squat_step }, ladders: { pushups: [...], pullups: [...], squats: [...] } }
- Resources
  - TOP: REST APIs; Data shaping.
- Tests
  - Returns consistent ladder definitions; reflects latest profile values.

---

### Step 9: History and Dashboard Data
- What
  - `GET /api/workouts` list (paginated, recent first); `GET /api/workouts/:id` detail; `GET /api/summary/last-workout` for dashboard card.
- Why
  - Review and feedback loops are central to user engagement.
- API
  - GET /api/workouts?limit=20&cursor=... -> 200 { items: [...], nextCursor }
  - GET /api/workouts/:id -> 200 { id, timestamp, exercises: [ { name, rpe, notes, sets: [ { reps, weight } ] } ] }
  - GET /api/summary/last-workout -> 200 { id, timestamp, highlights: [...] }
- Resources
  - TOP: Pagination & filtering; Prisma: cursor pagination.
- Tests
  - Pagination stable ordering; detail returns nested structure as expected.

---

### Step 10: Validation, Errors, and Security Hardening
- What
  - Input validation (express-validator/zod), centralized error handler, Helmet, CORS configuration, rate limiting, JWT expiry/clock skew handling.
  - Strict CORS origin whitelist, JSON/body size limits (e.g., 100kb), sensible request timeouts, and per-route rate limits for auth.
- Why
  - Improves reliability and security; consistent error shapes helps the frontend.
- Notes
  - Standardize error response: { error: { code, message, details? } }.
  - Expose API docs at `/api/docs` (Swagger UI/Redoc) generated from an OpenAPI spec kept in-repo.
- Resources
  - TOP: NodeJS best practices & security; Express: security; OWASP Top 10.
- Tests
  - Bad inputs yield 400 with clear messages; 401/403 for auth errors; headers include security defaults.

---

### Step 11: Performance and Indexes
- What
  - Add indexes: `Workout.profileId`, `ExerciseLog.workoutId`, `ProgramDay.program_id`.
  - Consider composite indexes if filtering by (profileId, timestamp DESC).
  - Use `Decimal` for weight fields in Prisma to avoid float rounding issues; prefer UTC for all timestamps.
- Why
  - Prevents N+1 patterns from turning into slow queries as data grows.
- Resources
  - TOP: Indexes; Prisma: @@index, @@unique, @@id.
- Tests
  - Verify query plans (EXPLAIN) are using indexes on heavy endpoints.

---

### Step 12: Seeds, Healthcheck, Logging, and Minimal Tests
- What
  - Seed initial programs; `GET /health` returns service + DB status; request logging (morgan/pino); minimal integration tests for auth and workout logging.
  - Logging: prefer `pino`/`pino-http` with a request-id for correlation; optional error reporting via Sentry.
  - Testing: set up Jest with a separate test database and npm scripts.
  - CI: GitHub Actions workflow that runs install, `prisma generate`, `prisma migrate deploy` (with a shadow DB), and tests on PRs.
  - Deployment: Dockerfile/Compose with app + Postgres; run `prisma migrate deploy` on startup; include container healthchecks.
- Why
  - Seeds accelerate local dev; healthchecks and logs aid deploy & debugging; tests guard core flows.
- Resources
  - TOP: Testing with Jest; Prisma: Seeding; Express: morgan/pino.
- Tests
  - `GET /health` -> 200 with DB ok; e2e happy-path: register → login → select program → create → log → coach message.

---

Deliverables Checklist (Backend V1)
- Auth: register, login (JWT), middleware, /me
- Programs: browse, select/change, current day
- Workouts: create, log/complete with transaction
- AI Coach: rule-based feedback and progression updates
- Progression: current profile steps + ladders
- History/Dashboard: list, details, last workout
- Hardening: validation, errors, security basics
- Seeds/Indexes/Health/Logging/Minimal tests
- Docs/CI/Deploy: OpenAPI docs at /api/docs, CI pipeline, containerized deploy with migrate deploy


---------

### Extra resource for me to review 
# Warp ignore everything below this line


📚 Authoritative Documentation Hubs
The Odin Project (TOP): For all curriculum-related topics (auth, APIs, testing, etc.), the main curriculum page is your best bet. You are likely working within the Full Stack JavaScript path.

Homepage: https://www.theodinproject.com

Prisma: For all database-specific operations, the official documentation is essential.

Documentation Homepage: https://www.prisma.io/docs

🗂️ Resource Confirmation by Step
Here is a breakdown of the key documentation topics that align with your plan:

Steps 1, 2, 10 (Authentication, Middleware, Security):

TOP Resource: The "Authentication" module within the NodeJS course. This covers JWT, password hashing, and route protection.

External Resource: The official documentation for jsonwebtoken (on NPM or GitHub) and bcrypt.js are also key. For security, the Express official guide on "Security Best Practices" is excellent.

Steps 3, 12 (Seeding Data):

Prisma Resource: The official Prisma docs have a dedicated section on "Seeding," which is the definitive guide.

Steps 4, 5, 8, 9 (REST APIs, Controllers, Pagination):

TOP Resource: The "API" and "REST" lessons in the NodeJS path are the primary source here. They cover how to structure controllers, design resourceful routes, and handle requests.

Prisma Resource: The "Client" API reference for filtering, ordering, and pagination (skip, take) will be your daily driver.

Step 6 (Transactions):

Prisma Resource: The Prisma documentation has a specific page for "Transactions." This is crucial for your "Log Workout" step to ensure that creating the ExerciseLog and SetLog records, updating the workout, and incrementing the program day all succeed or fail together.

Step 7 (AI Coach / Project Structure):

TOP Resource: The "Organizing your Node project" lesson provides the foundation for this. Refactoring logic into a separate /services directory (like AILogicService.js) is a standard pattern that TOP's projects encourage.

Step 10 (Validation & Errors):

TOP Resource: The curriculum covers validation as part of handling forms and APIs.

External Resource: The official docs for zod or express-validator will be your best resource for implementation details.

Step 11 (Performance & Indexes):

TOP Resource: The "Databases" course (part of the Full Stack path) covers the fundamentals of SQL and database performance, including the why and what of indexes.

Prisma Resource: The Prisma schema reference documentation shows you the how—specifically, the @@index and @@unique attributes for your schema file.
