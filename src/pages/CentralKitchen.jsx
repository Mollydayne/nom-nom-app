import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CentralKitchen() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');

  // Redirection vers /login si pas de session
  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  // Fonction pour charger la liste des clients
  const fetchClients = () => {
    fetch('http://localhost:3001/api/clients')
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error('Erreur chargement clients :', err));
  };

  // Charger les clients au premier affichage
  useEffect(() => {
    fetchClients();

    //  Recharge les clients quand l'utilisateur revient sur l'onglet (ex : après ajout)
    window.addEventListener('focus', fetchClients);

    // Nettoyage pour éviter les doublons d'écouteur
    return () => {
      window.removeEventListener('focus', fetchClients);
    };
  }, []);

  //  Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#ffb563] relative font-zenloop px-4 flex flex-col items-center justify-center text-[#891c1c]">

      {/* Image bento en haut à gauche */}
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

      {/* Bouton Log out */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-[#f85e00] hover:bg-[#d24a00] text-white font-medium py-1.5 px-4 rounded-full shadow-md transition"
      >
        Log out
      </button>

      {/* Titre */}
      <h1 className="text-6xl mb-4 tracking-tight">Central<br />Kitchen</h1>

      {/*  Message de bienvenue */}
      <h2 className="text-xl italic mb-6 text-[#5a3a00]">
        Hello, <span className="font-bold text-[#891c1c]">{user?.username}</span> — ready to cook?
      </h2>

      {/*  Interface principale */}
      <div className="grid grid-cols-2 gap-6">
        {/*  Sélection de client */}
        <div className="flex flex-col items-center">
          <select
            id="client-select"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="mb-2 px-4 py-1 rounded-full bg-[#ffe4b3] text-[#5a3a00] outline-none text-center"
          >
            <option value="">-- Select a name  --</option>
            {clients.map((client) => (
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
            className={`px-6 py-1.5 rounded-full text-white transition ${
              selectedClientId
                ? 'bg-[#f85e00] hover:bg-[#d24a00]'
                : 'bg-[#f85e00] cursor-not-allowed'
            }`}
          >
            View profile
          </button>
        </div>

        {/*  Paramètres */}
        <div className="flex flex-col items-center">
          <div className="bg-[#ffe4b3] py-1 px-4 rounded-full mb-1">Parameters</div>
          <button className="bg-[#f85e00] text-white px-6 py-1.5 rounded-full hover:bg-[#d24a00] transition">
            Go !
          </button>
        </div>

        {/*  Inventaire */}
        <div className="flex flex-col items-center">
          <div className="bg-[#ffe4b3] py-1 px-4 rounded-full mb-1">Box Inventory</div>
          <button className="bg-[#f85e00] text-white px-6 py-1.5 rounded-full hover:bg-[#d24a00] transition">
            See
          </button>
        </div>

        {/*  Ajouter un client */}
        <div className="flex flex-col items-center">
          <div className="bg-[#ffe4b3] py-1 px-4 rounded-full mb-1">Add a client</div>
          <button
            onClick={() => navigate('/add-client')}
            className="bg-[#f85e00] text-white px-6 py-1.5 rounded-full hover:bg-[#d24a00] transition"
          >
            Yeah
          </button>
        </div>
      </div>
    </div>
  );
}

export default CentralKitchen;
