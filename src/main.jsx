import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx'; // page de création de compte
import Login from './pages/login.jsx';
import CentralKitchen from './pages/CentralKitchen.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/central-kitchen" element={<CentralKitchen />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
