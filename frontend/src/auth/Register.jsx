import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState('Build Muscle');
  const [experience, setExperience] = useState('Beginner (0-1 year)');
  const [path, setPath] = useState('Weightlifting');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    // Client validation
    if (!email || !password || !goal || !experience || !path) {
      setError('All fields are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);
    try {
      await register({ email, password, goal, experience, path });
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      if (err.status === 409) {
        setError('Email already exists');
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <h1>Create Account</h1>
      <form onSubmit={onSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Password (min 6 characters)
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        <label>
          Goal
          <select value={goal} onChange={(e) => setGoal(e.target.value)} required>
            <option value="Build Muscle">Build Muscle</option>
            <option value="Lose Fat">Lose Fat</option>
            <option value="General Health">General Health</option>
          </select>
        </label>

        <label>
          Experience
          <select value={experience} onChange={(e) => setExperience(e.target.value)} required>
            <option value="Beginner (0-1 year)">Beginner (0-1 year)</option>
            <option value="Intermediate (1-3 years)">Intermediate (1-3 years)</option>
          </select>
        </label>

        <label>
          Path
          <select value={path} onChange={(e) => setPath(e.target.value)} required>
            <option value="Weightlifting">Weightlifting</option>
            <option value="Calisthenics">Calisthenics</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}
