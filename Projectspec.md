Here is the updated V1 Feature Spec, now including the "Programs" feature.

---

### **AI Workout Coach: V1 Feature Spec**

**Project Goal:** Create a simple, effective workout tracker that acts as a "smart" coach. It guides users on a progressive path—whether through pre-built programs or calisthenics progressions—and provides actionable, rule-based feedback to ensure they are always moving forward.

### **1. Core User Flow**

1.  **Onboarding:** New user signs up and sets up their profile (Goal, Experience, Path, **and selects an initial Program**).
2.  **Dashboard:** User logs in -> Can start their **"Today's Workout"** (if on a program) or a blank workout, view progressions, or see their workout history.
3.  **Logging:** User starts a workout -> The logger is **pre-populated** if they're on a program; otherwise, they add exercises manually. -> User logs sets, reps, weight, and RPE. Uses the rest timer between sets. Adds notes.
4.  **Saving & AI Feedback:** User finishes workout -> App saves the data (via API call) -> A "coach" modal pops up with feedback (e.g., "You've unlocked the next progression!" or "Try 155 lbs next time.").
5.  **Review:** User checks their Workout History to see past performance or checks the Progression View (Calisthenics) to see their new goal.

### **2. Key Screens & Features**

#### **Screen 1: Onboarding (Profile Setup)**
The user provides the "foundation" data. This also includes account creation.

1.  **Account:** Email, Password.
2.  **What's your goal?** (Build Muscle, Lose Fat, General Health)
3.  **What's your experience?** (Beginner (0-1 year), Intermediate (1-3 years))
4.  **What's your path?** (Weightlifting, Calisthenics)
5.  **[NEW] Select Your Program:**
    * A list of pre-built programs is shown, filtered by their `path`.
    * *Example Weightlifting Program:* "Beginner Linear Progression (3-Day)"
    * *Example Calisthenics Program:* "Bodyweight Fundamentals"
    * An option for **"No Program / Freestyle"** is also available.

#### **Screen 2: Dashboard (Home)**
The app's main hub.

* **Primary Action (Conditional):**
    * **If on a Program:** A large button that reads **"Start Today's Workout: [Day A: Squat Day]"**.
    * **If "Freestyle":** The button simply reads **"Start New Workout"**.
* **Secondary Actions:**
    * **[NEW] "View Programs"** (Lets user see all programs or change theirs).
    * (Calisthenics Path Only): "View My Progressions" button.
    * "View Workout History" button.
* **Info:** A simple "Last Workout" summary card.

#### **Screen 3: Progression View (Calisthenics Path Only)**
This is the core of the calisthenics route. It visually shows the user their path to mastery for the 3 core "ladders" (Push-up, Pull-up, Squat).
* **UI:** A collapsible list for each progression, showing mastered (checked off), current (highlighted), and future (locked) steps.

#### **Screen 4: Workout Logger**
The main "tracking" screen.

* **[NEW] Pre-population:** If the user started a *Program Workout*, this screen is pre-loaded with the exercises for that day (e.g., "Barbell Squat", "Bench Press") and their target sets/reps (e.g., "3 sets of 5 reps").
* If in "Freestyle" mode, the user adds exercises from a pre-defined list.
* For each exercise, they log:
    * **Sets:** Can add/remove sets.
    * **RPE (Critical):** A simple dropdown (1-10) for Rate of Perceived Exertion.
    * **Reps:** (e.g., 10, 8, 7)
    * **Weight:** (For Weightlifting path)
    * **Notes:** An optional text field per exercise.
    * **Rest Timer:** A simple, tappable timer (e.g., 30s, 60s, 90s, 120s).

#### **Screen 5: Workout History**
* **List View:** Shows a chronological list of all past workouts.
* **Detail View:** Tapping a workout shows a read-only summary of everything that was logged that day (all exercises, sets, reps, RPEs, and notes).

#### **[NEW] Screen 6: Program Library**
* A browse-able list of all available pre-built programs.
* Users can tap a program to see its details (description, full schedule of days and exercises).
* Users can "Select this Program" to make it active, which will update their `profile` and guide their Dashboard button.

### **3. "AI Coach" Logic (V1 - Rule-Based)**
This logic lives in your backend API and runs when a workout is saved.

* **Logic A: Calisthenics Progression** (No change)
    * **IF** User logged their current progression exercise (e.g., "Knee Push-ups") AND met the goal (e.g., 3 sets of 10 reps) AND RPE was <= 8,
    * **THEN:** Update their `profiles.pushup_step` and send a message: "You've mastered Knee Push-ups! You're ready to start working on Full Push-ups."

* **Logic B: Weightlifting Progression** (No change)
    * **IF** User logged a core lift (e.g., "Barbell Squat @ 150 lbs") AND RPE was <= 8,
    * **THEN:** Send a suggestion: "Great work! Try for 155 lbs next time."

### **4. Data Model (Postgres / Relational)**

**`users`**
* `id` (PK, Serial)
* `email` (Text, Unique, Not Null)
* `password_hash` (Text, Not Null)
* `created_at` (Timestamp)

**`profiles`**
* `id` (PK, Serial)
* `user_id` (FK, references `users.id`, Unique)
* `goal` (Text), `experience` (Text), `path` (Text)
* `pushup_step` (Integer, default: 0)
* `pullup_step` (Integer, default: 0)
* `squat_step` (Integer, default: 0)
* **`current_program_id` (FK, references `programs.id`, Nullable) - [NEW]**
* **`current_program_day` (Integer, default: 0) - [NEW]** (Tracks which day index, e.g., 0, 1, 2)

**`programs` [NEW TABLE]**
* `id` (PK, Serial)
* `name` (Text, Not Null) - e.g., "Beginner Linear Progression (3-Day)"
* `path` (Text, Not Null) - 'Weightlifting' or 'Calisthenics'
* `description` (Text)

**`program_days` [NEW TABLE]**
* `id` (PK, Serial)
* `program_id` (FK, references `programs.id`)
* `day_name` (Text, Not Null) - e.g., "Day A: Squat & Bench"
* `day_order` (Integer, Not Null) - 0, 1, 2... (for sequencing)

**`program_exercises` [NEW TABLE]**
* `id` (PK, Serial)
* `program_day_id` (FK, references `program_days.id`)
* `exercise_name` (Text, Not Null) - e.g., "Barbell Squat"
* `target_sets` (Integer)
* `target_reps` (Text) - e.g., "5" or "8-12"

**`workouts`**
* `id` (PK, Serial)
* `profile_id` (FK, references `profiles.id`)
* `timestamp` (Timestamp, Not Null)

**`exercise_logs`**
* `id` (PK, Serial)
* `workout_id` (FK, references `workouts.id`)
* `name` (Text, Not Null)
* `rpe` (Integer)
* `notes` (Text, Nullable)

**`set_logs`**
* `id` (PK, Serial)
* `exercise_log_id` (FK, references `exercise_logs.id`)
* `reps` (Integer, Not Null)
* `weight` (Decimal, default: 0)

---

### **5. Future (V2) Considerations**

* **Custom Routine Builder:** The V1 spec focuses on *pre-built* programs to provide immediate value and guidance. A V2 feature will be to build a "Routine Builder" where users can create, save, and edit their own custom workout programs from scratch.