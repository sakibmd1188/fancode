import React from 'react';
import Navbar from './Components/Navbar';
import "./App.css"
import Movies from './Movies';
import MovieList from './Movies';
import Genre from './Components/Genre';
const App = () => {
  return (
    <div className='App'>
      <Navbar />
      <Genre />
    </div>
  );
};

export default App;
