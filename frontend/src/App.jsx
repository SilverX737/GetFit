import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Routines from './pages/Routines';
import Exercises from './pages/Exercises';
import Login from './auth/Login';
import Register from './auth/Register';
import Onboarding from './onboarding/Onboarding';
import ProtectedTest from './auth/ProtectedTest';
import ProtectedRoute from './auth/ProtectedRoute';
import { getToken } from './api/apiClient';

function App() {
  const [isAuthed, setIsAuthed] = useState(Boolean(getToken()));

  // Listen for auth changes via custom event
  useEffect(() => {
    function handleAuthChange() {
      setIsAuthed(Boolean(getToken()));
    }
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  return (
    <Router>
      <Navbar onAuthChange={() => setIsAuthed(Boolean(getToken()))} />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={
            <ProtectedRoute isAuthed={isAuthed}>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/protected-test" element={
            <ProtectedRoute isAuthed={isAuthed}>
              <ProtectedTest />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Home />} />
          <Route path="/Routines" element={<Routines />} />
          <Route path="/exercises" element={<Exercises />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
