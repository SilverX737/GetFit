# Backend Implementation Plan for AI Workout Coach

This document outlines the steps to build the backend for the AI Workout Coach, based on the V1 Feature Spec.

---

### Step 1: Finalize User Onboarding & API Cleanup

1.  **Create Registration Route:** Create the `C:\Projects\GetFit\backend\src\Routes\Auth.js` file to handle new user sign-ups.
2.  **Update Main API File:** Modify `src\index.js` to use this new `Auth.js` route.
3.  **Remove Old Code:** Delete the now-obsolete `src\Routes\Exercises.js` file to keep the codebase clean.

---

### Step 2: Implement Workout Logging API

1.  **Create Workout Routes:** Create a new file at `C:\Projects\GetFit\backend\src\Routes\Workouts.js`.
2.  **Implement Workout Creation:** Add a `POST /api/workouts` endpoint. This will create a new `Workout` entry linked to the user's profile, acting as a container for the exercises they are about to log.
3.  **Implement Exercise Logging:** Add a `POST /api/workouts/:id/log` endpoint. This is a key endpoint that will receive all the data for a finished workout (exercises, sets, reps, weight, RPE) and save it to the `ExerciseLog` and `SetLog` tables.

---

### Step 3: Implement the "AI Coach" Logic

1.  **Integrate with Workout Logging:** The "AI Coach" logic will run inside the `POST /api/workouts/:id/log` endpoint after the workout data is saved.
2.  **Calisthenics Progression Logic:**
    *   Check the user's `Profile` for their current progression step (e.g., `pushup_step`).
    *   Analyze the saved `ExerciseLog` data.
    *   If the user has met the criteria for advancement (e.g., 3 sets of 10 reps with an RPE of 8 or less), increment the `pushup_step` in their `Profile`.
    *   Prepare a feedback message to send back to the frontend (e.g., "You've unlocked Full Push-ups!").
3.  **Weightlifting Progression Logic:**
    *   Analyze the saved `ExerciseLog` data for major lifts.
    *   If the user's RPE was low enough, prepare a suggestion message (e.g., "Great work! Try for 155 lbs next time.").

---

### Step 4: Implement Progression View API

1.  **Create Progression Route:** Create a new file at `C:\Projects\GetFit\backend\src\Routes\Progression.js`.
2.  **Implement Progression Data Endpoint:** Add a `GET /api/progression` endpoint. This will return the user's current progression levels (`pushup_step`, etc.) from their `Profile`, along with the full, predefined progression ladders for push-ups, pull-ups, and squats. This gives the frontend all the data it needs to build the visual progression view.
