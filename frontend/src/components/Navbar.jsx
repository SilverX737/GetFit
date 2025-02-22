import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <div className='nav-title'>
           <img src="./download.png" alt="Get-Fit Logo" />
            <h1>Get-Fit</h1>
    </div>
    <ul className='navbar-list'>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/Routines">Routines</Link></li>
      <li><Link to="/exercises">Exercises</Link></li>
    </ul>
  </nav>
);

export default Navbar;
