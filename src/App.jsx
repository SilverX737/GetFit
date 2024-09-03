import { useState } from 'react'
import Main from './components/Main'
import Generator from './components/Generator'
import Workout from './components/Workout'


function App() {

  return (
    <>
      <main className='min-h-screen flex flex-col bg-gradient-to-r from-slate-800 to-slate-950 text-white text-sm sm:text-base'>
        <Main     />
        <Generator />
        <Workout   />

      </main>
      
    </>
  )
}

export default App;
