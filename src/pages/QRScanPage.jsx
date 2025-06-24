import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import ReturnToKitchen from '../components/ReturnToKitchen';
import { apiFetch } from '../api';

function QRScanPage() {
  const [scanResult, setScanResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 }, false);

    scanner.render(
      (decodedText) => {
        scanner.clear().then(() => {
          const token = decodedText.split('/').pop();
          apiFetch(`/qr/${token}`)
            .then(data => setScanResult(data))
            .catch(() => setScanResult({ error: 'QR non reconnu ou erreur serveur.' }));
        });
      },
      (err) => console.warn('Erreur scanner :', err)
    );

    return () => scanner.clear().catch(() => {});
  }, []);

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
              <p className="text-green-700 mb-2">QR scanné avec succès !</p>
              <p className="text-sm">{scanResult.message}</p>
            </>
          )}
        </div>
      )}

      
    </div>
  );
}

export default QRScanPage;
