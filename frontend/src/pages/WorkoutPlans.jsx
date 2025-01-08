import React, { useState } from 'react';
import WorkoutForm from '../components/WorkoutForm';

const WorkoutPlans = ({ onSubmit }) => {
    const [workoutName, setWorkoutName] = useState('');
    const [exercises, setExercises] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ workoutName, exercises: exercises.split(',').map(e => e.trim()) });
      setWorkoutName('');
      setExercises('');
    };
  
    return (
      <form className="workout-form" onSubmit={handleSubmit}>
        <label className="form-label">
          Workout Name:
          <input
            type="text"
            value={workoutName}
            className="form-input"
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </label>
        <label className="form-label">
          Exercises (comma-separated):
          <input
            type="text"
            value={exercises}
            className="form-input"
            onChange={(e) => setExercises(e.target.value)}
          />
        </label>
        <button type="submit" className="form-button">Add Workout</button>
      </form>
    );
  };
  

export default WorkoutPlans;