import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import BentoDecoration from '../components/BentoDecoration';
import ReturnToKitchen from '../components/ReturnToKitchen';
import Toast from '../components/Toast';

export default function QRCodeHistory() {
  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    apiFetch('/api/deliveries/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(data => {
        console.log('Premier élément reçu :', data[0]);
        setHistory(data);
      })
      .catch(err => console.error('Erreur historique QR codes :', err));
  }, []);

  const handlePrint = (qr_token) => {
    navigate(`/qr-print/${qr_token}`);
  };

const handleResolve = async (delivery_id, returned, paid) => {
  try {
    const res = await apiFetch(`/api/deliveries/${delivery_id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ returned, paid }),
      headers: { 'Content-Type': 'application/json' }
    });

    setToast(res.message || 'Statut de livraison mis à jour');
    setHistory(prev =>
      prev.map(item =>
        item.delivery_id === delivery_id
          ? { ...item, returned, paid }
          : item
      )
    );
    setShowPopup(false);
  } catch (err) {
    console.error('Erreur résolution livraison :', err);
    setToast('Erreur lors de la mise à jour');
  }
};


  return (
    <div className="min-h-screen bg-[#ffb563] font-zenloop text-[#5a3a00] px-4 py-8">
      <BentoDecoration />
      <ReturnToKitchen position="top-left" />

      <h1 className="text-3xl mb-6 text-center text-[#891c1c]">Historique des QR codes générés</h1>

      {history.length === 0 ? (
        <p className="text-center text-sm text-gray-700">Aucune livraison enregistrée pour le moment.</p>
      ) : (
        <ul className="space-y-3 max-w-xl mx-auto">
          {history.map((item) => (
            <li key={item.qr_token} className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
              <div>
                <p className="font-bold">{item.dish_name}</p>
                <p className="text-sm text-[#918450]">{item.date}</p>
                <p className="text-sm">{item.client}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePrint(item.qr_token)}
                  className="bg-[#f85e00] text-white px-3 py-1 rounded-full hover:bg-[#d24a00] text-sm transition"
                >
                  Imprimer
                </button>

                <button
                  onClick={() => {
                    setSelectedId(item.delivery_id);
                    setShowPopup(true);
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition
                    ${item.returned
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-[#ffd29d] text-[#5a3a00] hover:bg-[#ffcc85]'}`}
                >
                  {item.returned ? 'OK' : 'Livraison revenue'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showPopup && (
        <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-red-700 text-white px-6 py-5 rounded-xl shadow-xl text-center w-[90%] max-w-md">
          <p className="mb-3 text-lg font-medium">Que faire avec cette livraison ?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleResolve(selectedId, true, true)}
              className="bg-white text-red-700 px-4 py-2 rounded-full hover:bg-red-100 transition"
            >
              Reçue + Payée
            </button>
            <button
              onClick={() => handleResolve(selectedId, true, false)}
              className="bg-white text-red-700 px-4 py-2 rounded-full hover:bg-red-100 transition"
            >
              Seulement reçue
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast}
          type="success"
          duration={2000}
          onClose={() => setToast(null)}
          position="center"
        />
      )}
    </div>
  );
}
