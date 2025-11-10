import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { me } from '../api/auth';
import { api } from '../api/apiClient';
import ProgramPicker from './ProgramPicker';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Step 1: Profile data
  const [goal, setGoal] = useState('Build Muscle');
  const [experience, setExperience] = useState('Beginner (0-1 year)');
  const [path, setPath] = useState('Weightlifting');
  
  // Step 2: Program selection
  const [selectedProgram, setSelectedProgram] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await me();
        if (user.profile) {
          setGoal(user.profile.goal || 'Build Muscle');
          setExperience(user.profile.experience || 'Beginner (0-1 year)');
          setPath(user.profile.path || 'Weightlifting');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleStep1Next(e) {
    e.preventDefault();
    // Optionally update profile via API if you have a PUT /api/profile endpoint
    // For now, just move to step 2
    setStep(2);
  }

  async function handleFinish() {
    setLoading(true);
    setError('');
    try {
      if (selectedProgram) {
        await api('/api/profile/program', {
          method: 'POST',
          body: { program_id: selectedProgram.id },
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  }

  if (loading && step === 1) {
    return <div>Loading your profile...</div>;
  }

  return (
    <div className="onboarding-page">
      <h1>Welcome! Let's get you set up</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {step === 1 && (
        <form onSubmit={handleStep1Next}>
          <h2>Step 1: Your Profile</h2>
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

          <button type="submit">Next: Choose a Program</button>
        </form>
      )}

      {step === 2 && (
        <div>
          <h2>Step 2: Choose Your Program</h2>
          <p>Select a program that matches your path: <strong>{path}</strong></p>
          <ProgramPicker
            path={path}
            selectedProgram={selectedProgram}
            onSelectProgram={setSelectedProgram}
          />
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setStep(1)}>Back</button>
            <button onClick={handleFinish} disabled={loading}>
              {selectedProgram ? 'Finish & Start Training' : 'Skip for now (Freestyle)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
