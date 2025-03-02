import React from 'react';
import ReactDOM from 'react-dom';  // Make sure ReactDOM is imported
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; 

ReactDOM.render(
  <BrowserRouter>
      <App />
    </BrowserRouter>,
  document.getElementById('root')
);
