import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CentralKitchen() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  // Charger les clients depuis l'API
  useEffect(() => {
    fetch('http://localhost:3001/api/clients')
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error('Erreur chargement clients :', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    // Le parent est positionné en relative pour que l'image en absolute fonctionne
    <div className="min-h-screen bg-[#ffb563] relative font-zenloop px-4 flex flex-col items-center justify-center text-[#891c1c]">

      {/* Image bento en haut à gauche */}
     <img
  src="/bento.png"
  alt="Bento decoration"
  className="absolute pointer-events-none select-none opacity-30 animate-fade-in
             top-[-30px] left-[-30px] 
             sm:top-[-40px] sm:left-[-40px] 
             md:top-[-60px] md:left-[-60px] 
             lg:top-0 lg:left-0
             max-w-[70vw] sm:max-w-[75vw] md:max-w-[80vw] lg:max-w-[865px] 
             w-auto h-auto max-h-[70vh]"
/>

      {/* Bouton Log out en haut à droite */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-[#f85e00] hover:bg-[#d24a00] text-white font-medium py-1.5 px-4 rounded-full shadow-md transition"
      >
        Log out
      </button>

      {/* Titre principal */}
      <h1 className="text-6xl mb-4 tracking-tight">Central<br />Kitchen</h1>

      {/* Sous-titre avec nom de l'utilisateur */}
      <h2 className="text-xl italic mb-6 text-[#5a3a00]">
        Hello, <span className="font-bold text-[#891c1c]">{user?.username}</span> — ready to cook?
      </h2>

      {/* Interface utilisateur */}
      <div className="grid grid-cols-2 gap-6">
        {/* Sélection de client */}
        <div className="flex flex-col items-center">
          <select
            id="client-select"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="mb-2 px-4 py-1 rounded-full bg-[#ffe4b3] text-[#5a3a00] outline-none text-center"
          >
            <option value="">-- Choose a client --</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
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

        {/* Paramètres */}
        <div className="flex flex-col items-center">
          <div className="bg-[#ffe4b3] py-1 px-4 rounded-full mb-1">Parameters</div>
          <button className="bg-[#f85e00] text-white px-6 py-1.5 rounded-full hover:bg-[#d24a00] transition">
            Go !
          </button>
        </div>

        {/* Inventaire des gamelles */}
        <div className="flex flex-col items-center">
          <div className="bg-[#ffe4b3] py-1 px-4 rounded-full mb-1">Box Inventory</div>
          <button className="bg-[#f85e00] text-white px-6 py-1.5 rounded-full hover:bg-[#d24a00] transition">
            See
          </button>
        </div>

        {/* Ajouter un client */}
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
