import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import ReturnToKitchen from '../components/ReturnToKitchen';
import { apiFetch } from '../api';
import Toast from '../components/Toast';
import ReturnModal from '../components/ReturnModal';

function QRScanPage() {
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const audio = new Audio('/scan-success.wav'); // ✅ fichier renommé

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 }, false);

    scanner.render(
      (decodedText) => {
        scanner.clear().then(() => {
          const token = decodedText.split('/').pop();
          apiFetch(`/api/qrcodes/${token}`) // ✅ route corrigée
            .then(data => {
              const fullData = { ...data, token };
              audio.play().catch(() => {});
              setScanResult(fullData);
              if (!data.returned) {
                setShowModal(true);
              }
            })
            .catch(() => setScanResult({ error: 'QR non reconnu ou erreur serveur.' }));
        });
      },
      (err) => console.warn('Erreur scanner :', err)
    );

    return () => scanner.clear().catch(() => {});
  }, []);

  const handleReturnOnly = () => {
    apiFetch(`/api/qrcodes/${scanResult.token}/return`, { method: 'PATCH' }) // ✅ route corrigée
      .then(() => {
        setMessage('Boîte marquée comme retournée.');
        setScanResult({ ...scanResult, returned: true });
        setShowModal(false);
      })
      .catch(() => {
        setMessage("Erreur lors du retour.");
        setShowModal(false);
      });
  };

  const handleReturnAndPay = () => {
    apiFetch(`/api/qrcodes/${scanResult.token}/return`, { method: 'PATCH' }) // ✅ route corrigée
      .then(() => apiFetch(`/api/qrcodes/${scanResult.token}/pay`, { method: 'PATCH' })) // ✅ route corrigée
      .then(() => {
        setMessage('Boîte marquée comme retournée et payée.');
        setScanResult({ ...scanResult, returned: true, paid: true });
        setShowModal(false);
      })
      .catch(() => {
        setMessage("Erreur lors du retour et paiement.");
        setShowModal(false);
      });
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
                <p className="text-[#918450] text-sm italic">En attente d’action...</p>
              )}
            </>
          )}
        </div>
      )}

      {showModal && (
        <ReturnModal
          onReturnOnly={handleReturnOnly}
          onReturnAndPay={handleReturnAndPay}
          onClose={() => setShowModal(false)}
        />
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
