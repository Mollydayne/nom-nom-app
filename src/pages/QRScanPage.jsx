import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import ReturnToKitchen from '../components/ReturnToKitchen';
import { apiFetch } from '../api';
import Toast from '../components/Toast';

function QRScanPage() {
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 }, false);

    scanner.render(
      (decodedText) => {
        scanner.clear().then(() => {
          const token = decodedText.split('/').pop();
          apiFetch(`/qr/${token}`)
            .then(data => setScanResult({ ...data, token }))
            .catch(() => setScanResult({ error: 'QR non reconnu ou erreur serveur.' }));
        });
      },
      (err) => console.warn('Erreur scanner :', err)
    );

    return () => scanner.clear().catch(() => {});
  }, []);

  const handleReturn = () => {
    apiFetch(`/qr/${scanResult.token}/return`, { method: 'PATCH' })
      .then(() => {
        setMessage('La boîte a été marquée comme retournée.');
        setScanResult({ ...scanResult, returned: true });
      })
      .catch(() => setMessage("Erreur lors de la mise à jour du statut de retour."));
  };

  return (
    <div className="min-h-screen bg-[#ffb563] px-4 py-8 text-[#5a3a00] flex flex-col items-center font-zenloop">
      <BentoDecoration />
      <ReturnToKitchen position="top-left" />

      <h1 className="text-4xl mb-6 text-center">Scanner un QR code</h1>

      <div id="reader" className="w-full max-w-md" />

      {scanResult && (
        <div className="mt-6 bg-white rounded-xl shadow p-4 text-center max-w-md w-full">
          {scanResult.error ? (
            <p className="text-red-600">{scanResult.error}</p>
          ) : (
            <>
              <p className="text-green-700 mb-2">QR reconnu</p>
              <p className="text-lg font-medium mb-1">{scanResult.dish}</p>
              <p className="text-sm mb-1">Client : {scanResult.client}</p>
              <p className="text-sm mb-3">Date : {scanResult.date}</p>

              {scanResult.returned ? (
                <p className="text-[#918450] text-sm italic">Boîte déjà marquée comme retournée</p>
              ) : (
                <button
                  onClick={handleReturn}
                  className="mt-2 bg-[#f85e00] text-white px-6 py-2 rounded-full hover:bg-[#d24a00] transition"
                >
                  Marquer comme retournée
                </button>
              )}
            </>
          )}
        </div>
      )}

      {message && (
        <Toast
          type="success"
          message={message}
          duration={2000}
          onClose={() => setMessage(null)}
        />
      )}

      
    </div>
  );
}

export default QRScanPage;
