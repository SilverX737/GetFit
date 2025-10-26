AI Workout Coach: V1 Feature Spec

Project Goal: Create a simple, effective workout tracker that acts as a "smart" coach. It guides users on a progressive path, whether for weightlifting or calisthenics, and provides actionable, rule-based feedback to ensure they are always moving forward.

1. Core User Flow

Onboarding: New user signs up and sets up their profile (Goal, Experience, Path).

Dashboard: User logs in -> Can start a workout, view progressions, or see their workout history.

Logging: User starts a workout -> Adds exercises -> Logs sets, reps, weight, and RPE. Uses the rest timer between sets. Adds notes to any exercise.

Saving & AI Feedback: User finishes workout -> App saves the data (via API call) -> A "coach" modal pops up with feedback (e.g., "You've unlocked the next progression!").

Review: User checks their Workout History to see past performance or checks the Progression View to see their new goal.

2. Key Screens & Features

Screen 1: Onboarding (Profile Setup)

The user provides the "foundation" data. This also includes account creation.

1. Account: Email, Password.

2. What's your goal?

(Simple choices: Build Muscle, Lose Fat, General Health)

3. What's your experience?

(Simple choices: Beginner (0-1 year), Intermediate (1-3 years))

4. What's your path?

Weightlifting: Focus on barbell/dumbbell progression.

Calisthenics: Focus on bodyweight skill progression.

Screen 2: Dashboard (Home)

The app's main hub.

Primary Action: A big "Start New Workout" button.

Secondary Actions:

(Calisthenics Path Only): "View My Progressions" button.

"View Workout History" button.

Info: A simple "Last Workout" summary card.

Screen 3: Progression View (Calisthenics Path Only)

This is the core of the calisthenics route. It visually shows the user their path to mastery.

Popular Routes: We will define 3 core progression "ladders":

Push-up Progression:

Wall Push-ups

Incline Push-ups

Knee Push-ups

Full Push-ups

...etc.

Pull-up Progression:

Dead Hangs

Scapular Pulls

Negative Pull-ups

Full Pull-ups

...etc.

Squat Progression:

Assisted Squats (holding support)

Bodyweight Squats

Pistol Squats (Assisted)

...etc.

UI: A collapsible list for each progression, showing mastered (checked off), current (highlighted), and future (locked) steps.

Screen 4: Workout Logger

The main "tracking" screen.

User can add exercises from a pre-defined list.

For each exercise, they log:

Sets: Can add/remove sets.

RPE (Critical): A simple dropdown (1-10) for Rate of Perceived Exertion.

Reps: (e.g., 10, 8, 7)

Weight: (For Weightlifting path)

[NEW] Notes: An optional text field per exercise (e.g., "Felt a pinch in shoulder").

[NEW] Rest Timer: A simple, tappable timer (e.g., 30s, 60s, 90s, 120s) that the user can start after completing a set.

Screen 5: Workout History (NEW SCREEN)

A new screen, likely a tab on the dashboard.

List View: Shows a chronological list of all past workouts (e.g., "Workout - Oct 25", "Workout - Oct 23").

Detail View: Tapping a workout shows a read-only summary of everything that was logged that day (all exercises, sets, reps, RPEs, and notes).

3. "AI Coach" Logic (V1 - Rule-Based)

This logic lives in your backend API and runs when a workout is saved.

Logic A: Calisthenics Progression

The Rule (The "AI"):

IF User logged their current progression exercise (e.g., "Knee Push-ups")

AND User met the goal (e.g., 3 sets of 10 reps)

AND User's RPE was 8 or less

THEN:

Update Database: The API updates the user's profiles table to set pushup_step: 4.

Send Response: The API sends a success message: "You've mastered Knee Push-ups! You're ready to start working on Full Push-ups."

Logic B: Weightlifting Progression

The Rule (The "AI"):

IF User logged a core lift (e.g., "Barbell Squat @ 150 lbs")

AND User's RPE was 8 or less

THEN:

Send Response: The API sends a suggestion: "Great work! Try for 155 lbs next time."

4. Data Model (Postgres / Relational)

users

id (PK, Serial)

email (Text, Unique, Not Null)

password_hash (Text, Not Null)

created_at (Timestamp)

profiles

id (PK, Serial)

user_id (FK, references users.id, Unique)

goal (Text), experience (Text), path (Text)

pushup_step (Integer, default: 0)

pullup_step (Integer, default: 0)

squat_step (Integer, default: 0)

workouts

id (PK, Serial)

profile_id (FK, references profiles.id)

timestamp (Timestamp, Not Null)

exercise_logs

id (PK, Serial)

workout_id (FK, references workouts.id)

name (Text, Not Null)

rpe (Integer)

notes (Text, Nullable) - [NEW]

set_logs

id (PK, Serial)

exercise_log_id (FK, references exercise_logs.id)

reps (Integer, Not Null)

weight (Decimal, default: 0)