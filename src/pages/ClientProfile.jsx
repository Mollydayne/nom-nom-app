import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ClientProfile() {
  const { id } = useParams(); // récupère l'id du client via l'URL
  const [client, setClient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/clients/${id}`)
      .then((res) => res.json())
      .then((data) => setClient(data))
      .catch((err) => {
        console.error('Erreur client :', err);
        navigate('/central-kitchen'); // redirection si erreur
      });
  }, [id, navigate]);

  if (!client) return <p className="text-center mt-10">Loading client profile...</p>;

  return (
    <div className="min-h-screen bg-[#ffd29d] flex flex-col items-center justify-center font-zenloop px-4 text-[#5a3a00]">
      <h1 className="text-4xl text-[#891c1c] mb-6">Profile: {client.name}</h1>

      <div className="bg-[#ffe4b3] rounded-xl p-6 w-full max-w-md shadow-lg space-y-4 text-lg">
        <p><strong>Gamelles en attente :</strong> {client.box_owed}</p>
        <p><strong>Montant dû :</strong> {client.amount_due.toFixed(2)} €</p>
        <p><strong>Allergies :</strong> {client.allergies || 'Aucune'}</p>
        <p><strong>Aime :</strong> {client.likes || 'Non renseigné'}</p>
      </div>

      <button
        onClick={() => navigate('/central-kitchen')}
        className="mt-6 px-6 py-2 bg-[#f85e00] text-white rounded-full hover:bg-[#d24a00] transition"
      >
        Back to kitchen
      </button>
    </div>
  );
}

export default ClientProfile;
