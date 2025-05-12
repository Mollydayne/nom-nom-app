// src/pages/ClientDashboard.jsx

import { useEffect, useState } from 'react';
import BentoDecoration from '../components/BentoDecoration';
import LogoutBadge from '../components/LogoutBadge';

export default function ClientDashboard() {
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/api/clients/client-dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data) => setClientData(data))
      .catch((err) => {
        console.error("Erreur client dashboard :", err);
        setError("Impossible de charger tes données. 🍽️");
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#ffb563] flex items-center justify-center text-red-700 text-xl font-zenloop">
        {error}
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-[#ffb563] flex items-center justify-center font-zenloop text-xl text-[#5a3a00]">
        Préparation de ton bento en cours... 🍱
      </div>
    );
  }

  const { total_delivered, pending_returns, unpaid_amount } = clientData;

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center py-12 font-zenloop">
      <BentoDecoration />
      <LogoutBadge />
      <h1 className="text-4xl sm:text-5xl text-[#891c1c] mb-10">Ton espace gourmand 🍴</h1>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-[#5a3a00] space-y-6 text-xl">
        <p> <strong>Gamelles livrées :</strong> {total_delivered}</p>
        <p> <strong>Gamelles à rendre :</strong> {pending_returns}</p>
        <p> <strong>Montant dû :</strong> {unpaid_amount} €</p>
      </div>
    </div>
  );
}
