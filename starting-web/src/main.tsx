// Ez a fájl a Starting webalkalmazás belépési pontja, és betölti a globális stílusokat valamint a fő alkalmazást.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './stilusok/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
