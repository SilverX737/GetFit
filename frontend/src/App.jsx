import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Routines from './pages/Routines';
import Exercises from './pages/Exercises';
import Login from './auth/Login';
import ProtectedTest from './auth/ProtectedTest';
import ProtectedRoute from './auth/ProtectedRoute';
import { getToken } from './api/apiClient';

function App() {
  const isAuthed = Boolean(getToken());
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
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
