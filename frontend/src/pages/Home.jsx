import React from 'react';
import Button from '../components/Button';

const Home = () => (
    <div className="home">
      <h1>Welcome to Get Fit!</h1>
      <p>Your journey to a healthier you starts here.</p>
      <div className= 'homepage-button'>
      <Button  buttonText="New workout" color="#00796B"/>
      <Button  buttonText="Use Existing workout" color="#03A9F4"/>
      <Button  buttonText="Use Existing workout" color="#8BC34A"/>
      </div>
    </div>
  );
  

export default Home;