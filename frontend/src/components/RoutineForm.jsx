import React, { useState } from "react";

const RoutineForm = ({ onAddRoutine }) => {
  const [routineName, setRoutineName] = useState("");
  const [numDays, setNumDays] = useState(1);
  const [days, setDays] = useState([{ day: "Day 1", exercises: [] }]);

  // Handle number of days change
  const handleDaysChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumDays(count);
    
    // Update days array dynamically
    setDays(Array.from({ length: count }, (_, i) => ({
      day: `Day ${i + 1}`,
      exercises: [],
    })));
  };

  // Handle adding exercises
  const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].exercises[exerciseIndex][field] = value;
    setDays(updatedDays);
  };

  // Add new exercise to a day
  const addExercise = (dayIndex) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].exercises.push({ name: "", sets: "", reps: "" });
    setDays(updatedDays);
  };

  // Submit Routine
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!routineName.trim()) return;
    onAddRoutine({ id: Date.now(), name: routineName, days });
    setRoutineName("");
    setNumDays(1);
    setDays([{ day: "Day 1", exercises: [] }]);
  };

  return (
    <form onSubmit={handleSubmit} className="routine-form">
      <h2>Create a New Routine</h2>
      
      <input 
        type="text"
        placeholder="Routine Name"
        value={routineName}
        onChange={(e) => setRoutineName(e.target.value)}
        required
      />

      <label>Number of Days:</label>
      <select value={numDays} onChange={handleDaysChange}>
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <option key={num} value={num}>{num} Days</option>
        ))}
      </select>

      {days.map((day, dayIndex) => (
        <div key={dayIndex} className="day-section">
          <h3>{day.day}</h3>
          {day.exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="exercise-inputs">
              <input 
                type="text" 
                placeholder="Exercise Name" 
                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "name", e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Sets" 
                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "sets", e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Reps" 
                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "reps", e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={() => addExercise(dayIndex)}>+ Add Exercise</button>
        </div>
      ))}

      <button type="submit">Save Routine</button>
    </form>
  );
};

export default RoutineForm;
