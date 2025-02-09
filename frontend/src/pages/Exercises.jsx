import React, { useState } from "react";

const initialExercises = {
  barbell_bench_press: {
    name: "Barbell Bench Press",
    type: "Compound",
    description:
      "Ensure your scapula are retracted when performing the bench press, arms 2 palm widths wider than shoulder width. Lower the bar with your elbows flared at a 45-degree angle from your torso, touching the bar down to your chest at your nipple line.",
    muscles: ["Chest"],
  },
  prayer_press: {
    name: "Prayer Press",
    type: "Accessory",
    description:
      "Place a light, weighted plate between the palms of your hands (as if you were praying), and while keeping your scapula retracted, press your hands together while pushing the plate away from you.",
    muscles: ["Chest"],
  },
  pec_dec: {
    name: "Pec Dec Machine",
    type: "Accessory",
    description:
      "Ensure your scapula is retracted and try to puff out your chest while performing this exercise. Make sure you bring the handles together so they touch, and the range of motion should be no more than 90 degrees either side.",
    muscles: ["Chest"],
  },
};

const Exercises = () => {
  const [exercises, setExercises] = useState(initialExercises);

  const removeExercise = (key) => {
    const updatedExercises = { ...exercises };
    delete updatedExercises[key];
    setExercises(updatedExercises);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Exercises</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(exercises).map(([key, exercise]) => (
          <div key={key} className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{exercise.name}</h2>
            <p className="text-sm text-gray-600">{exercise.type}</p>
            <p className="mt-2">{exercise.description}</p>
            <button
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => removeExercise(key)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercises;
