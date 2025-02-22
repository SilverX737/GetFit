import React from "react";

const RoutineList = ({ routines, onEdit, onDelete }) => {
    return (
      <div>
        <h2>Saved Routines</h2>
        <ul>
          {routines.map((routine, index) => (
            <li key={index}>
              <h3>{routine.name}</h3>
              <ul>
                {routine.exercises.map((ex, idx) => (
                  <li key={idx}>{ex.name} - {ex.sets} sets x {ex.reps} reps</li>
                ))}
              </ul>
              <button onClick={() => onEdit(routine)}>Edit</button>
              <button onClick={() => onDelete(routine.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  export default RoutineList;