import React from 'react';
import ExerciseCard from '../components/ExerciseCard';

const exercises = [
  { name: 'Barbell Bench Press', description: 'A compound exercise...', type: 'compound', muscles: ['chest', 'triceps'] },
  { name: 'Pushup', description: 'A bodyweight exercise...', type: 'accessory', muscles: ['chest', 'triceps', 'shoulders'] },
  { name: 'Squat', description: 'A lower body compound exercise...', type: 'compound', muscles: ['quads', 'glutes', 'hamstrings'] },
];

const Exercises = () => (
    <div className="exercises">
      <h1>Exercises</h1>
      <div className="exercise-list">
        {exercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} />
        ))}
      </div>
    </div>
  );
  

export default Exercises;