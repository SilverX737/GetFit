import React, { useState } from "react";
import ExerciseCard from "../components/ExerciseCard";

const exercises = [
  {
    name: "Barbell Bench Press",
    type: "Compound",
    musclesTargeted: ["chest", "shoulders", "triceps"],
    description: "A strength training exercise targeting the chest, shoulders, and triceps.",
  },
  {
    name: "Push-ups",
    type: "Bodyweight",
    musclesTargeted: ["body", "core"],
    description: "A basic bodyweight exercise to strengthen the upper body and core.",
  },
];

const Exercises = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(""); // Store selected muscle

  // Handle dropdown change
  const handleFilterChange = (event) => {
    setSelectedMuscle(event.target.value);
  };

  // Filter exercises based on selected muscle
  const filteredExercises = selectedMuscle
    ? exercises.filter((exercise) =>
        exercise.musclesTargeted.includes(selectedMuscle)
      )
    : exercises;

  return (
    <div>
      <h1>Filter Exercises by Muscle Group</h1>
      
      {/* Dropdown Filter */}
      <select onChange={handleFilterChange} value={selectedMuscle}>
        <option value="">All Muscles</option>
        <option value="chest">Chest</option>
        <option value="shoulders">Shoulders</option>
        <option value="triceps">Triceps</option>
        <option value="core">Core</option>
      </select>

      <h2>Exercises</h2>
      <div className="exercise-list">
        {filteredExercises.map((exercise, index) => (
          <ExerciseCard key={index} {...exercise} />
        ))}
      </div>
    </div>
  );
};

export default Exercises;
