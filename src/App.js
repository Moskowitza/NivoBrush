import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Chart} from "./Chart"

function App() {
  return (
    <div className="App">
      <Chart data={[1,2,3,5,2]}/>
    </div>
  );
}

export default App;
