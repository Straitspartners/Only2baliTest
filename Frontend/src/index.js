// import React from 'react';
// import ReactDOM from 'react-dom';  // Make sure ReactDOM is imported
// import './index.css';
// import App from './App';
// import { BrowserRouter } from 'react-router-dom'; 

// ReactDOM.render(
//   <BrowserRouter>
//       <App />
//     </BrowserRouter>,
//   document.getElementById('root')
// );
import React from 'react';
import ReactDOM from 'react-dom/client';  // Correct import for React 18
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
