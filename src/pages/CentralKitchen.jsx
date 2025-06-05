import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutBadge from '../components/LogoutBadge';
import QRCodeScanner from '../components/QRCodeScanner';
import { apiFetch } from '../api'; // Ajout : on importe la fonction centralisée pour les appels API

function CentralKitchen() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [cookingMessage, setCookingMessage] = useState('');
  const messageRef = useRef();

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  // Modification : on utilise apiFetch pour centraliser l'appel à l'API
  const fetchClients = async () => {
    try {
      const data = await apiFetch('/clients');
      setClients(data);
    } catch (err) {
      console.error('Erreur chargement clients :', err);
      setClients([]);
    }
  };

  useEffect(() => {
    fetchClients();
    window.addEventListener('focus', fetchClients);
    return () => {
      window.removeEventListener('focus', fetchClients);
    };
  }, []);

  useEffect(() => {
    const messages = [
      "ready to cook?",
      "let's get cookin'!",
      "hungry for action?",
      "time to spice things up!",
      "bring on the bento!",
      "let's stir some love!",
      "gamelle time!",
      "chop chop chef!",
      "ready to stir magic?"
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    const selected = messages[randomIndex];
    setCookingMessage(selected);
    if (messageRef.current) {
      messageRef.current.textContent = `Welcome message updated: ${selected}`;
    }
  }, [navigate]);

  return (
    <main className="min-h-screen bg-[#ffb563] relative font-zenloop px-4 flex flex-col items-center justify-center text-[#891c1c] animate-fade-in" role="main" tabIndex="-1">

      <div ref={messageRef} className="sr-only" role="status" aria-live="polite"></div>

      <img
        src="/bento.png"
        alt="Bento decoration"
        className="fixed pointer-events-none select-none opacity-30 animate-fade-in
               top-[-80px] left-[-80px]
               sm:top-[-100px] sm:left-[-100px]
               md:top-[-150px] md:left-[-150px]
               lg:top-[-100px] lg:left-[-100px]
               max-w-[1800px] w-auto h-auto z-0"
      />

      <LogoutBadge />

      <h1 className="text-5xl sm:text-6xl md:text-7xl mb-6 tracking-tight text-center" tabIndex="0">Central<br />Kitchen</h1>

      <h2 className="text-xl sm:text-2xl italic mb-10 text-[#5a3a00] text-center" tabIndex="0">
        Hello, <span className="font-bold text-[#891c1c]">
          {user?.firstname ? user.firstname : 'Chef'}
        </span> — {cookingMessage}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 text-base sm:text-lg px-4">
        <div className="flex flex-col items-center">
          <label htmlFor="client-select" className="sr-only">Select a client</label>
          <select
            id="client-select"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="mb-3 px-6 py-2 rounded-full bg-[#ffe4b3] text-[#5a3a00] outline-none text-center"
          >
            <option value="">-- Name --</option>
            {Array.isArray(clients) && clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (selectedClientId) navigate(`/clients/${selectedClientId}`);
            }}
            disabled={!selectedClientId}
            className={`px-8 py-2 rounded-full text-white transition ${
              selectedClientId
                ? 'bg-[#f85e00] hover:bg-[#d24a00]'
                : 'bg-[#f85e00] cursor-not-allowed'
            }`}
            aria-disabled={!selectedClientId}
          >
            View profile
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-[#ffe4b3] py-2 px-6 rounded-full mb-2" id="qr-label">QR Code</div>
          <button
            onClick={() => navigate('/qr-code')}
            className="bg-[#f85e00] text-white px-8 py-2 rounded-full hover:bg-[#d24a00] transition"
            aria-labelledby="qr-label"
          >
            Voir
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-[#ffe4b3] py-2 px-6 rounded-full mb-2" id="inventory-label">Box Inventory</div>
          <button
            className="bg-[#f85e00] text-white px-8 py-2 rounded-full hover:bg-[#d24a00] transition"
            aria-labelledby="inventory-label"
          >
            See
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-[#ffe4b3] py-2 px-6 rounded-full mb-2" id="add-client-label">Add a client</div>
          <button
            onClick={() => navigate('/add-client')}
            className="bg-[#f85e00] text-white px-8 py-2 rounded-full hover:bg-[#d24a00] transition"
            aria-labelledby="add-client-label"
          >
            Yeah
          </button>
        </div>
      </div>
    </main>
  );
}

export default CentralKitchen;
