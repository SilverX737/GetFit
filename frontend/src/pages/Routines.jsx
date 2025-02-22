import React, { useState } from "react";
import RoutineForm from "../components/RoutineForm"; // Import the form component
import RoutineList from "../components/RoutineList"; // Import the list component

const Routines = () => {
  const [routines, setRoutines] = useState([]);
  const [exercises] = useState([
    { name: "Barbell Bench Press" },
    { name: "Push-ups" },
    { name: "Deadlift" },
  ]);

  const addRoutine = (newRoutine) => {
    setRoutines([...routines, { ...newRoutine, id: Date.now() }]);
  };

  const deleteRoutine = (id) => {
    setRoutines(routines.filter((routine) => routine.id !== id));
  };

  return (
    <div>
      <h1>Workout Routines</h1>
      <RoutineForm exercises={exercises} onSave={addRoutine} />
      <RoutineList routines={routines} onDelete={deleteRoutine} />
    </div>
  );
};

export default Routines;
