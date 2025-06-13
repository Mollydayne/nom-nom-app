import { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import BentoDecoration from '../components/BentoDecoration';
import ReturnToKitchen from '../components/ReturnToKitchen';

export default function QRCodeHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    apiFetch('/api/deliveries/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(data => setHistory(data))
      .catch(err => console.error('Erreur historique QR codes :', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#ffb563] font-zenloop text-[#5a3a00] px-4 py-8">
      <BentoDecoration />
      <ReturnToKitchen position="top-left" />
      <h1 className="text-3xl mb-6 text-center text-[#891c1c]">Historique des QR codes générés</h1>
      <ul className="space-y-3 max-w-xl mx-auto">
        {history.map((item, index) => (
          <li key={index} className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
            <div>
              <p className="font-bold">{item.dish_name}</p>
              <p className="text-sm text-[#918450]">{item.date}</p>
            </div>
            <p className="text-sm text-right">{item.client}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
