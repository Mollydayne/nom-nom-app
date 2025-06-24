import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BentoDecoration from '../components/BentoDecoration';
import Toast from '../components/Toast';
import ReturnToKitchen from '../components/ReturnToKitchen';
import { apiFetch } from '../api';

function QRCodePage() {
  const [qrToken, setQrToken] = useState('');
  const [toast, setToast] = useState(null);

  // Champs de création de QR code
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dishName, setDishName] = useState('');

  const navigate = useNavigate();

  // Récupère la liste des clients à afficher dans le menu déroulant
  useEffect(() => {
    apiFetch('/api/clients')
      .then(data => setClients(data))
      .catch(err => console.error('Erreur chargement clients :', err));
  }, []);

  // Gère la création d’un QR code
  const handleCreateQRCode = () => {
    const today = new Date().toISOString().split("T")[0];

    apiFetch('/api/deliveries', {
      method: 'POST',
      body: {
        client_id: selectedClientId,
        quantity,
        date: today,
        dish_name: dishName
      }
    })
      .then(data => {
        setToast({ type: 'success', message: 'QR code généré avec succès !' });
        setQrToken(data.qr_token);
        setDishName('');
      })
      .catch(() => {
        setToast({ type: 'error', message: 'Erreur lors de la génération du QR code.' });
      });
  };

  // Redirige vers la page d’impression d’un QR code généré
  const handlePrint = () => {
    if (!qrToken) return;
    navigate(`/qr-print/${qrToken}`);
  };

  return (
    <div className="min-h-screen bg-[#ffb563] px-4 pt-12 text-[#891c1c] flex flex-col items-center font-zenloop">
      <BentoDecoration />
      <ReturnToKitchen position="top-left" />

      <h1 className="text-5xl mb-6">Gestion des QR code</h1>

      {/* Lien vers l’historique global des QR codes */}
      <button
        onClick={() => navigate('/qr-history')}
        className="mb-6 bg-[#ffd29d] hover:bg-[#ffcc85] text-[#5a3a00] font-semibold py-2 px-4 rounded-full shadow transition-transform hover:scale-105"
      >
        Voir l’historique des QR codes
      </button>

      {/* Formulaire de création d’un nouveau QR code */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6 w-full max-w-md text-[#5a3a00]">
        <h2 className="text-xl font-semibold mb-3">Créer un nouveau QR code</h2>

        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="w-full mb-2 px-4 py-2 rounded-full bg-[#fff7e6] outline-none"
        >
          <option value="">-- Sélectionner un client --</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.firstname} {client.lastname}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded-full bg-[#fff7e6] outline-none text-center placeholder:text-[#918450]"
          placeholder="Quantité"
        />

        <input
          type="text"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded-full bg-[#fff7e6] outline-none text-center placeholder:text-[#918450]"
          placeholder="Nom du plat"
        />

        <button
          onClick={handleCreateQRCode}
          disabled={!selectedClientId || quantity < 1 || !dishName}
          className="w-full bg-[#f85e00] text-white py-2 rounded-full hover:bg-[#d24a00] transition"
        >
          Créer un QR code
        </button>
      </div>

      {/* Bouton vers la nouvelle page de scan */}
      <button
        onClick={() => navigate('/qr-scan')}
        className="bg-[#ffd29d] text-[#5a3a00] px-6 py-2 rounded-full hover:bg-[#ffcc85] transition shadow"
      >
        Scanner un QR code
      </button>

      {/* Bouton d'impression si un QR vient d’être généré */}
      {qrToken && (
        <button
          onClick={handlePrint}
          className="mt-4 bg-[#ffd29d] text-[#5a3a00] px-6 py-2 rounded-full hover:bg-[#ffcc85] transition shadow"
        >
          Imprimer ce QR code
        </button>
      )}

      {/* Message de confirmation ou d’erreur */}
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

export default QRCodePage;
