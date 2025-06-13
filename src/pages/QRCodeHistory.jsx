import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import BentoDecoration from '../components/BentoDecoration';
import ReturnToKitchen from '../components/ReturnToKitchen';

export default function QRCodeHistory() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  // Récupération de l'historique des QR codes générés
  useEffect(() => {
    const token = localStorage.getItem('token');

    apiFetch('/api/deliveries/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(data => {
        console.log('Historique QR reçu :', data);
        setHistory(data);
      })
      .catch(err => {
        console.error('Erreur historique QR codes :', err);
      });
  }, []);

  // Redirection vers la page d’impression du QR code
  const handlePrint = (qr_token) => {
    navigate(`/qr-print/${qr_token}`);
  };

  return (
    <div className="min-h-screen bg-[#ffb563] font-zenloop text-[#5a3a00] px-4 py-8">
      <BentoDecoration />
      <ReturnToKitchen position="top-left" />
      <h1 className="text-3xl mb-6 text-center text-[#891c1c]">Historique des QR codes générés</h1>

      <ul className="space-y-3 max-w-xl mx-auto">
        {history.length === 0 && (
          <p className="text-center text-sm text-gray-700">Aucune livraison enregistrée pour le moment.</p>
        )}

        {history.map((item, index) => (
          <li key={index} className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
            <div>
              <p className="font-bold">{item.dish_name}</p>
              <p className="text-sm text-[#918450]">{item.date}</p>
              <p className="text-sm">{item.client}</p>
            </div>

            <button
              onClick={() => handlePrint(item.qr_token)}
              className="bg-[#f85e00] text-white px-3 py-1 rounded-full hover:bg-[#d24a00] text-sm transition"
            >
              Imprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
