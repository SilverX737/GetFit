import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar">
    <div class="nav-title">
            <h1>Get-Fit</h1>
    </div>
    <ul className="navbar-list">
      <li className="navbar-item"><Link to="/">Home</Link></li>
      <li className="navbar-item"><Link to="/workout-plans">Workout Plans</Link></li>
      <li className="navbar-item"><Link to="/exercises">Exercises</Link></li>
    </ul>
  </nav>
);

export default Navbar;
