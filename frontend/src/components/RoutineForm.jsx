import React, { useState } from "react";

const RoutineForm = ({ exercises, onSave }) => {
  const [routineName, setRoutineName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);

  const addExercise = (exercise) => {
    setSelectedExercises([...selectedExercises, { ...exercise, sets: 3, reps: 10 }]);
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index][field] = value;
    setSelectedExercises(updatedExercises);
  };

  const saveRoutine = () => {
    onSave({ name: routineName, exercises: selectedExercises });
  };

  return (
    <div>
      <h2>Create Routine</h2>
      <input
        type="text"
        placeholder="Routine Name"
        value={routineName}
        onChange={(e) => setRoutineName(e.target.value)}
      />
      <h3>Select Exercises</h3>
      <ul>
        {exercises.map((exercise, index) => (
          <li key={index}>
            {exercise.name}
            <button onClick={() => addExercise(exercise)}>Add</button>
          </li>
        ))}
      </ul>
      <h3>Selected Exercises</h3>
      {selectedExercises.map((exercise, index) => (
        <div key={index}>
          <p>{exercise.name}</p>
          <input
            type="number"
            value={exercise.sets}
            onChange={(e) => updateExercise(index, "sets", e.target.value)}
          />
          <input
            type="number"
            value={exercise.reps}
            onChange={(e) => updateExercise(index, "reps", e.target.value)}
          />
        </div>
      ))}
      <button onClick={saveRoutine}>Save Routine</button>
    </div>
  );
};

export default RoutineForm;
