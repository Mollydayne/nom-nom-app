import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import Toast from '../components/Toast';
import LogoutBadge from '../components/LogoutBadge';
import BentoDecoration from '../components/BentoDecoration';

export default function ClientSettings() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState('');
  const [showConfirmToast, setShowConfirmToast] = useState(false);
  const [finalToast, setFinalToast] = useState(null);

  useEffect(() => {
    apiFetch('/api/clients/me', { token })
      .then(setClient)
      .catch(() => setMessage('Erreur de chargement des informations.'));
  }, [token]);

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const data = await apiFetch(`/api/clients/${client.id}`, {
        token,
        method: 'PUT',
        body: client,
      });
      setMessage('Modifications enregistrées');
    } catch (err) {
      setMessage(err.message || 'Erreur');
    }
  };

  const handleDelete = async () => {
    try {
      await apiFetch('/api/users/me', {
        method: 'DELETE',
        token,
      });
      setFinalToast('deleted');
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setFinalToast(null);
        window.location.href = '/signup';
      }, 2000);
    } catch (err) {
      setFinalToast('error');
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen bg-[#ffb563] flex items-center justify-center text-[#5a3a00] font-zenloop">
        Chargement des informations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center text-[#5a3a00] font-zenloop px-4 relative">
      <BentoDecoration />
      <LogoutBadge />

      <h1 className="text-4xl text-[#891c1c] mb-6">Paramètres du compte</h1>

      <div className="bg-[#fff0cc] rounded-2xl shadow-lg p-8 w-full max-w-md space-y-4 text-lg">
        <label className="flex flex-col">
          Prénom :
          <input name="firstName" value={client.firstname} onChange={handleChange} className="rounded px-3 py-1 mt-1 bg-white" />
        </label>
        <label className="flex flex-col">
          Nom :
          <input name="lastName" value={client.lastname} onChange={handleChange} className="rounded px-3 py-1 mt-1 bg-white" />
        </label>
        <label className="flex flex-col">
          Email :
          <input name="email" value={client.email} onChange={handleChange} className="rounded px-3 py-1 mt-1 bg-white" />
        </label>
        <label className="flex flex-col">
          Allergies :
          <input name="allergies" value={client.allergies || ''} onChange={handleChange} className="rounded px-3 py-1 mt-1 bg-white" />
        </label>
        <label className="flex flex-col">
          Préférences :
          <input name="likes" value={client.likes || ''} onChange={handleChange} className="rounded px-3 py-1 mt-1 bg-white" />
        </label>

        <button
          onClick={handleSave}
          className="w-full bg-[#a41623] hover:bg-[#891c1c] text-white py-2 rounded-full transition"
        >
          Enregistrer
        </button>

        <button
          onClick={() => setShowConfirmToast(true)}
          className="w-full bg-[#ffd29d] hover:bg-[#ffcc85] text-[#5a3a00] mt-6 py-2 rounded-full transition"
        >
          Supprimer mon compte
        </button>
      </div>

      {/* Bouton pour retourner au dashboard client */}
      <button
        onClick={() => navigate('/client-dashboard')}
        className="fixed bottom-4 left-4 z-50 bg-[#ffd29d] hover:bg-[#ffcc85] text-[#5a3a00] py-2 px-6 rounded-full shadow transition"
      >
        Mon profil
      </button>

      {/* Toast de confirmation suppression */}
      {showConfirmToast && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-700 text-white px-6 py-4 rounded-xl shadow-xl z-50 text-center w-[90%] max-w-md">
          <p className="mb-2 text-lg font-medium">Tu es sur le point de supprimer ton compte.</p>
          <div className="flex flex-row justify-center items-center gap-4 mt-4">
            <button
              onClick={handleDelete}
              className="bg-white text-red-700 font-semibold px-4 py-2 rounded-full hover:bg-red-100 transition"
            >
              Oui
            </button>
            <button
              onClick={() => setShowConfirmToast(false)}
              className="bg-white text-red-700 font-semibold px-4 py-2 rounded-full hover:bg-red-100 transition"
            >
              Non
            </button>
          </div>
        </div>
      )}

      {/* Toast de résultat final */}
      {finalToast === 'deleted' && (
        <Toast
          message="Ton compte a été supprimé."
          type="error"
          duration={2000}
          onClose={() => setFinalToast(null)}
          position="center"
        />
      )}

      {finalToast === 'error' && (
        <Toast
          message="Erreur lors de la suppression."
          type="error"
          duration={2000}
          onClose={() => setFinalToast(null)}
          position="center"
        />
      )}
    </div>
  );
}
