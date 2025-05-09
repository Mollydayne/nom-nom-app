import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import Toast from '../components/Toast';

function ClientProfile() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [showConfirmToast, setShowConfirmToast] = useState(false);
  const [finalToast, setFinalToast] = useState(null);
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

  const confirmDelete = () => {
    setShowConfirmToast(true);
  };

  const cancelDelete = () => {
    setShowConfirmToast(false);
    setFinalToast('cancelled');
    setTimeout(() => setFinalToast(null), 2000);
  };

  const proceedDelete = async () => {
    setShowConfirmToast(false);

    try {
      const res = await fetch(`http://localhost:3001/api/clients/${client.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error deleting client');
      }

      setFinalToast('deleted');
      setTimeout(() => {
        setFinalToast(null);
        navigate('/central-kitchen');
      }, 2000);
    } catch (err) {
      console.error('Erreur suppression client :', err.message);
      alert('Could not delete client');
    }
  };

  if (!client) return <p className="text-center mt-10">Loading client profile...</p>;

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center font-zenloop px-4 text-[#5a3a00] relative">
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

      {/* Boutons d'action alignés */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
          onClick={() => navigate('/central-kitchen')}
          className="px-6 py-2 bg-[#f85e00] text-white rounded-full hover:bg-[#d24a00] transition"
        >
          Kitchen Central
        </button>

        <button
          onClick={() => navigate(`/edit-client/${client.id}`)}
          className="px-6 py-2 bg-[#5a3a00] text-white rounded-full hover:bg-[#3d2a00] transition"
        >
          Modifier
        </button>

       <button
  onClick={confirmDelete}
  className="px-6 py-2 bg-[#891c1c] text-white rounded-full hover:bg-[#5e1212] transition shake-on-hover"
>
  Supprimer
</button>


      </div>

      {/* Toast de confirmation avec boutons Oui / Non */}
      {showConfirmToast && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-700 text-white px-6 py-4 rounded-xl shadow-xl z-50 text-center w-[90%] max-w-md">
          <p className="mb-2 text-lg font-medium">Attention ! Tu es sur le point de supprimer un client.</p>
          <div className="flex flex-row justify-center items-center gap-4 mt-4">
            <button
              onClick={proceedDelete}
              className="bg-white text-red-700 font-semibold px-4 py-2 rounded-full hover:bg-red-100 transition"
            >
              Oui
            </button>
            <button
              onClick={cancelDelete}
              className="bg-white text-red-700 font-semibold px-4 py-2 rounded-full hover:bg-red-100 transition"
            >
              Non
            </button>
          </div>
        </div>
      )}

      {/* Toast final selon l'action */}
      {finalToast === 'deleted' && (
        <Toast
          message={`Profil de ${client.firstName} ${client.lastName} supprimé !`}
          type="error"
          duration={2000}
          onClose={() => setFinalToast(null)}
          position="center"
        />
      )}

      {finalToast === 'cancelled' && (
        <Toast
          message="Ouf, on a évité le pire !"
          type="error"
          duration={2000}
          onClose={() => setFinalToast(null)}
          position="center"
        />
      )}
    </div>
  );
}

export default ClientProfile;
