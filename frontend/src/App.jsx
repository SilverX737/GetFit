import { useState } from 'react';
import Homepage from './screens/Homepage';
import Generator from './screens/Generator';
import Workout from './screens/Workout';
import { generateWorkout } from './functions';
import { Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  const [workout, setWorkout] = useState(null);
  const [poison, setPoison] = useState('individual');
  const [muscles, setMuscles] = useState([]);
  const [goal, setGoal] = useState('strength_power');
  const navigate = useNavigate();

  function updateWorkout() {
    if (muscles.length < 1) {
      return;
    }
    let newWorkout = generateWorkout({ poison, muscles, goal });
    setWorkout(newWorkout);
    navigate('/workout');
    console.log('Hello');
  }

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-r from-slate-800 to-slate-950 text-white text-sm sm:text-base'>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Generator" element={
          <Generator
            poison={poison}
            setPoison={setPoison}
            muscles={muscles}
            setMuscles={setMuscles}
            goal={goal}
            setGoal={setGoal}
            updateWorkout={updateWorkout}
          />
        } />
        {workout && (
          <Route path="/workout" element={<Workout workout={workout} />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
