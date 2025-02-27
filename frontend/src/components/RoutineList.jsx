import React, { useState } from "react";

const RoutineList = ({ routines }) => {
  const [expandedRoutine, setExpandedRoutine] = useState(null);

  const toggleExpand = (id) => {
    setExpandedRoutine(expandedRoutine === id ? null : id);
  };

  return (
    <div className="routine-list">
      <h2>Available Routines</h2>
      {routines.length === 0 ? <p>No routines available</p> : null}
      
      {routines.map((routine) => (
        <div key={routine.id} className="routine-card">
          <h3 onClick={() => toggleExpand(routine.id)}>{routine.name} ({routine.days.length} Days)</h3>

          {expandedRoutine === routine.id && (
            <div className="routine-details">
              {routine.days.map((day, index) => (
                <div key={index} className="day-section">
                  <h4>{day.day}</h4>
                  <ul>
                    {day.exercises.map((ex, idx) => (
                      <li key={idx}>{ex.name} - {ex.sets} sets x {ex.reps} reps</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoutineList;
