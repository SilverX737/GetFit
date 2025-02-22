import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Routines from './pages/Routines';
import Exercises from './pages/Exercises';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Routines" element={<Routines />} />
          <Route path="/exercises" element={<Exercises />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
