import React, { useState } from "react";
import RoutineForm from "../components/RoutineForm";
import RoutineList from "../components/RoutineList";
import "../styles/RoutinesPage.css";  
const initialRoutines = [
  {
    id: 1,
    name: "PPL Routine",
    days: [
      {
        day: "Push Day",
        exercises: [
          { name: "Bench Press", sets: 3, reps: 8 },
          { name: "Shoulder Press", sets: 3, reps: 10 },
        ],
      },
      {
        day: "Pull Day",
        exercises: [
          { name: "Deadlift", sets: 3, reps: 5 },
          { name: "Pull-ups", sets: 3, reps: 12 },
        ],
      },
      {
        day: "Leg Day",
        exercises: [
          { name: "Squat", sets: 3, reps: 8 },
          { name: "Leg Press", sets: 3, reps: 12 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Upper Lower Split",
    days: [
      {
        day: "Upper Body",
        exercises: [
          { name: "Bench Press", sets: 3, reps: 8 },
          { name: "Pull-ups", sets: 3, reps: 12 },
        ],
      },
      {
        day: "Lower Body",
        exercises: [
          { name: "Squat", sets: 3, reps: 8 },
          { name: "Deadlift", sets: 3, reps: 5 },
        ],
      },
    ],
  },
];

const Routines = () => {
  const [routines, setRoutines] = useState(initialRoutines);

  const addRoutine = (routine) => {
    setRoutines([...routines, routine]);
  };
  

  return (
    <div className="routines-page">
      <h1>Workout Routines</h1>
      <RoutineList routines={routines} />
      <RoutineForm onAddRoutine={addRoutine} />
    </div>
  );
};

export default Routines;
