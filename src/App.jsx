import { useState } from 'react'
import Start from './components/Start'
import Generator from './components/Generator'
import Workout from './components/Workout'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Start     />
        <Generator />
        <Workout   />

      </div>
      
    </>
  )
}

export default App
