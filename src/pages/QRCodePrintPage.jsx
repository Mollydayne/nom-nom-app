// QRCodePrintPage.jsx
import { useParams } from 'react-router-dom';

// On utilise l'URL de l'API définie dans les variables d'environnement
const API_BASE = import.meta.env.VITE_API_URL;

function QRCodePrintPage() {
  const { token } = useParams();
  // On remplace localhost:3001 par l’URL dynamique de l’API
  const imageUrl = `${API_BASE}/qrcodes/${token}.png`;

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-white"
      style={{ padding: '2rem' }}
    >
      <div className="text-center">
        <img
          src={imageUrl}
          alt="QR Code"
          className="max-w-xs w-full h-auto mx-auto"
          onLoad={() => window.print()}
        />
        <p className="mt-4 text-sm text-[#5a3a00]">QR Code : {token}</p>
      </div>
    </div>
  );
}

export default QRCodePrintPage;
