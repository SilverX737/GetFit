import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient';

export default function ProgramPicker({ path, selectedProgram, onSelectProgram }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPrograms() {
      setLoading(true);
      setError('');
      try {
        const data = await api('/api/programs');
        const filtered = data.filter((p) => p.path === path);
        setPrograms(filtered);
      } catch (err) {
        setError(err.message || 'Failed to load programs');
      } finally {
        setLoading(false);
      }
    }
    loadPrograms();
  }, [path]);

  if (loading) return <p>Loading programs...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (programs.length === 0) return <p>No programs available for {path}.</p>;

  return (
    <div className="program-picker">
      {programs.map((program) => (
        <div
          key={program.id}
          className={`program-card ${selectedProgram?.id === program.id ? 'selected' : ''}`}
          onClick={() => onSelectProgram(program)}
          style={{
            border: selectedProgram?.id === program.id ? '2px solid #00796B' : '1px solid #ccc',
            padding: '15px',
            margin: '10px 0',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          <h3>{program.name}</h3>
          <p>{program.description}</p>
        </div>
      ))}
    </div>
  );
}
