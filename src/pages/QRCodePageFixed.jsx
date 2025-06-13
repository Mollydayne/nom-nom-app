import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import BentoDecoration from '../components/BentoDecoration';
import Toast from '../components/Toast';
import ReturnToKitchen from '../components/ReturnToKitchen';
import { apiFetch } from '../api';

function QRCodePage() {
  const [scanResult, setScanResult] = useState(null);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [qrToken, setQrToken] = useState('');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dishName, setDishName] = useState('');

  const navigate = useNavigate();

  // Charger les clients disponibles
  useEffect(() => {
    apiFetch('/api/clients')
      .then(data => setClients(data))
      .catch(err => console.error('Erreur chargement clients :', err));
  }, []);

  // Initialiser le scanner QR au chargement de la page
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 }, false);

    scanner.render(
      (decodedText) => {
        scanner.clear().then(() => {
          const token = decodedText.split('/').pop();
          setQrToken(token);

          // Récupérer les données de la livraison associée
          apiFetch(`/qr/${token}`)
            .then((data) => {
              setScanResult(data);
              fetchDeliveryHistory(token);
            })
            .catch(() => setError('Erreur lors du scan ou du fetch backend.'));
        });
      },
      (err) => console.warn('Erreur scanner :', err)
    );

    return () => scanner.clear().catch(() => {});
  }, []);

  // Récupérer l'historique de la boîte liée à ce QR code
  const fetchDeliveryHistory = (token) => {
    apiFetch(`/boxes/${token}/deliveries`)
      .then((data) => setDeliveryHistory(data))
      .catch((err) => {
        console.error('Erreur historique :', err);
        setDeliveryHistory([]);
      });
  };

  // Réutiliser un QR code existant pour une nouvelle livraison
  const handleReuseBox = () => {
    if (!scanResult?.client_id || !qrToken) {
      return setToast({ type: 'error', message: "Impossible de réutiliser ce QR" });
    }

    const today = new Date().toISOString().split("T")[0];

    apiFetch('/api/deliveries', {
      method: 'POST',
      body: {
        client_id: scanResult.client_id,
        quantity: 1,
        date: today,
        reuse_qr_token: qrToken
      }
    })
      .then(() => {
        setToast({ type: 'success', message: 'Nouvelle livraison créée avec succès !' });
        setScanResult(null);
        setDeliveryHistory([]);
        setQrToken('');
      })
      .catch(() => {
        setToast({ type: 'error', message: 'Erreur lors de la création de la livraison.' });
      });
  };

  // Rediriger vers la page d'impression du QR code
  const handlePrint = () => {
    if (!qrToken) return;
    navigate(`/qr-print/${qrToken}`);
  };

  // Créer un nouveau QR code avec les infos saisies
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
        setScanResult({ message: data.message, delivery_id: data.deliveryId, client_id: selectedClientId });
        fetchDeliveryHistory(data.qr_token);
        setDishName('');
      })
      .catch(() => {
        setToast({ type: 'error', message: 'Erreur lors de la génération du QR code.' });
      });
  };

  return (
    <div className="min-h-screen bg-[#ffb563] px-4 pt-12 text-[#891c1c] flex flex-col items-center font-zenloop">
      <BentoDecoration />
      <ReturnToKitchen position="top-left" />

      <h1 className="text-5xl mb-6">Gestion des QR code</h1>

      {/* Bouton pour accéder à l'historique global */}
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
              {client.firstName} {client.lastName}
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

      {/* Scanner HTML5 */}
      <div id="reader" className="w-full max-w-md" />

      {/* Résultat du scan */}
      {scanResult && (
        <div className="mt-6 bg-white text-[#5a3a00] rounded-xl p-4 shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold mb-2">Résultat :</h2>
          <p>{scanResult.message}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={handleReuseBox} className="bg-[#f85e00] text-white px-4 py-1 rounded-full hover:bg-[#d24a00]">
              Réutiliser
            </button>
            <button onClick={handlePrint} className="bg-[#ffd29d] text-[#5a3a00] px-4 py-1 rounded-full hover:bg-[#ffb563]">
              Imprimer
            </button>
          </div>
        </div>
      )}

      {/* Historique de la boîte */}
      {deliveryHistory.length > 0 && (
        <div className="mt-6 max-w-md w-full bg-[#fff7e6] p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Historique de cette boîte :</h3>
          <ul className="text-sm text-[#5a3a00] space-y-1 max-h-60 overflow-y-auto">
            {deliveryHistory.map((d) => (
              <li key={d.id} className="border-b border-dashed pb-1">
                {d.date} — {d.firstName} {d.lastName} — {d.quantity} gamelle(s) — {d.returned ? 'rendue' : 'en attente'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message d’erreur en cas de problème */}
      {error && (
        <div className="mt-6 bg-red-100 text-red-700 rounded-xl p-4 shadow max-w-md w-full">
          <p>{error}</p>
        </div>
      )}

      {/* Toast de confirmation ou d'erreur */}
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

    </div>
  );
}




export default QRCodePage;
