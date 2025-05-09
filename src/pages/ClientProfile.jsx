import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration'; // Import du composant bento

function ClientProfile() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/clients/${id}`)
      .then((res) => res.json())
      .then((data) => setClient(data))
      .catch((err) => {
        console.error('Erreur client :', err);
        navigate('/central-kitchen');
      });
  }, [id, navigate]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${client.firstName} ${client.lastName}?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/api/clients/${client.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error deleting client');
      }

      alert('Client deleted');
      navigate('/central-kitchen');
    } catch (err) {
      console.error('Erreur suppression client :', err.message);
      alert('Could not delete client');
    }
  };

  if (!client) return <p className="text-center mt-10">Loading client profile...</p>;

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center font-zenloop px-4 text-[#5a3a00] relative">

      {/* Image décorative en haut à gauche */}
      <BentoDecoration />

      <h1 className="text-4xl text-[#891c1c] mb-6">
        Profile: {client.firstName} {client.lastName}
      </h1>

      <div className="bg-[#ffe4b3] rounded-xl p-6 w-full max-w-md shadow-lg space-y-4 text-lg">
        <p><strong>Gamelles en attente :</strong> {client.box_owed ?? 0}</p>
        <p><strong>Montant dû :</strong> {(client.amount_due ?? 0).toFixed(2)} €</p>
        <p><strong>Allergies :</strong> {client.allergies || 'Aucune'}</p>
        <p><strong>Aime :</strong> {client.likes || 'Non renseigné'}</p>
      </div>

      <button
        onClick={() => navigate('/central-kitchen')}
        className="mt-6 px-6 py-2 bg-[#f85e00] text-white rounded-full hover:bg-[#d24a00] transition"
      >
        Back to kitchen
      </button>

      <button
        onClick={() => navigate(`/edit-client/${client.id}`)}
        className="mt-4 px-6 py-2 bg-[#5a3a00] text-white rounded-full hover:bg-[#3d2a00] transition"
      >
        Edit client
      </button>

      <button
        onClick={handleDelete}
        className="mt-4 px-6 py-2 bg-[#891c1c] text-white rounded-full hover:bg-[#5e1212] transition"
      >
        Delete client
      </button>
    </div>
  );
}

export default ClientProfile;
