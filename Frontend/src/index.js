import React from 'react';
import ReactDOM from 'react-dom';  // Make sure ReactDOM is imported
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter for routing
import './index.css';
import App from './App';

// Wrap the App component with BrowserRouter
ReactDOM.render(

    <BrowserRouter>
      <App />
    </BrowserRouter>,
  document.getElementById('root')
);
