import { useParams } from 'react-router-dom';

function QRCodePrintPage() {
  const { token } = useParams();
  const imageUrl = `http://localhost:3001/qrcodes/${token}.png`;

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
