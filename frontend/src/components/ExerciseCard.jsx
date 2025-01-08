import React from 'react';

const ExerciseCard = ({ exercise }) => (
  <div className="exercise-card">
    <h3>{exercise.name}</h3>
    <p>{exercise.description}</p>
    <p><strong>Type:</strong> {exercise.type}</p>
    <p><strong>Muscles:</strong> {exercise.muscles.join(', ')}</p>
  </div>
);


export default ExerciseCard;