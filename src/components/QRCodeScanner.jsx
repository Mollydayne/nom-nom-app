import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRCodeScanner() {
  const [message, setMessage] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Initialisation du scanner
    const scanner = new Html5QrcodeScanner('scanner', {
      fps: 10,
      qrbox: 250,
    });

    // Callback lorsqu’un QR code est détecté
    scanner.render(
      async (qrCodeMessage) => {
        scanner.clear();
        try {
          const res = await fetch(`http://localhost:3001/api/qr/${qrCodeMessage}`);
          const data = await res.json();
          setMessage(data.message);
        } catch (error) {
          setMessage("Erreur lors du scan ou de la requête.");
        }
      },
      (error) => {
        console.warn("Erreur de scan :", error);
      }
    );

    // Nettoyage à la destruction du composant
    return () => {
      scanner.clear().catch((err) => console.error("Erreur de nettoyage du scanner :", err));
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl mb-4 font-semibold">Scanner une gamelle</h2>
      <div id="scanner" className="mb-6" />
      {message && <p className="text-lg text-center">{message}</p>}
    </div>
  );
}

export default QRCodeScanner;
