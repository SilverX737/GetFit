import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken } from '../api/apiClient';
import { me, logout } from '../api/auth';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      if (getToken()) {
        try {
          const userData = await me();
          setUser(userData);
        } catch (err) {
          console.error('Failed to fetch user:', err);
        }
      }
    }
    loadUser();
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
    navigate('/login');
  }

  return (
    <nav>
      <div className='nav-title'>
        <img src="./download.png" alt="Get-Fit Logo" />
        <h1>Get-Fit</h1>
      </div>
      <ul className='navbar-list'>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Routines">Routines</Link></li>
        <li><Link to="/exercises">Exercises</Link></li>
        {user ? (
          <>
            <li style={{ color: '#003366' }}>{user.email}</li>
            <li><button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
