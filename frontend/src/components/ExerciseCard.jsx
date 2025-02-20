import React from "react";
import "./ExerciseCard.css"; 

const ExerciseCard = ({ name, type, description ,musclesTargeted}) => {
  return (
    <div className="exercise-card">
      <h3>{name}</h3>
      <p><strong>Type:</strong> {type}</p>
      <p>{description}</p>
      <p><strong>Muscles Targeted:</strong> {musclesTargeted.join(", ")}</p>
    </div>
  );
};

export default ExerciseCard;
