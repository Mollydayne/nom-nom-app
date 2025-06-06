// Import des modules - point d'entrée principal du front

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
import SignupPage from './pages/SignupPage'; 
import TestDelivery from './pages/TestDelivery';
import ClientDashboard from './pages/ClientDashboard.jsx';
import ClientRoute from './components/ClientRoute.jsx';
import Unauthorized from './pages/Unauthorized.jsx'; 
import TraiteurRoute from "./components/TraiteurRoute.jsx";
import MentionsLegales from './pages/MentionsLegales.jsx';
import AboutPage from './pages/AboutPage';
import QRCodePage from './pages/QRCodePageFixed.jsx';
import QRCodePrintPage from './pages/QRCodePrintPage';
import ClientSettings from './pages/ClientSettings';
import SelectChef from './pages/SelectChef';


import './index.css';

// Les routes possibles
// 07/05/25 : note to self, ajouter des routes protégées si non log : ok

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clients/:id" element={<ClientProfile />} />
        <Route path="/add-client" element={<AddClient />} />
        <Route path="/edit-client/:id" element={<EditClient />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/test-delivery" element={<TestDelivery />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/a-propos" element={<AboutPage />} />
        <Route path="/qr-code" element={<QRCodePage />} />
        <Route path="/qr-print/:token" element={<QRCodePrintPage />} />
        <Route path="/client-settings" element={<ClientSettings />} />
        <Route path="/select-chef" element={<SelectChef />} />




        {/* Route client protégée */}
        <Route
          path="/client-dashboard"
          element={
            <ClientRoute>
              <ClientDashboard />
            </ClientRoute>
          }
        />

        {/* Route traiteur protégée */}

        <Route
  path="/central-kitchen"
  element={
    <TraiteurRoute>
      <CentralKitchen />
    </TraiteurRoute>
  }
/>

        {/* Page non autorisée */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
