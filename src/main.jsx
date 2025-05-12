// Import des modules - point d'entrée principal du frnt

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import des composants des pages

import App from './App.jsx'; // page de création de compte
import Login from './pages/login.jsx';
import CentralKitchen from './pages/CentralKitchen.jsx';
import ClientProfile from './pages/ClientProfile.jsx';
import AddClient from './pages/AddClient.jsx';
import EditClient from './pages/EditClient.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage'; // ← cette ligne doit exister



// Import du fichier css
import './index.css';

// Les routes possibles
// 07/05/25 : note to self, ajouter des routes protégées si non log

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/central-kitchen" element={<CentralKitchen />} />
        <Route path="/clients/:id" element={<ClientProfile />} />
        <Route path="/add-client" element={<AddClient />} />
        <Route path="/edit-client/:id" element={<EditClient />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/signup" element={<SignupPage />} />


      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
