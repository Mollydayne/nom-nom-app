import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import LogoutBadge from '../components/LogoutBadge';
import Toast from '../components/Toast';
import { apiFetch } from '../api';

export default function ClientDashboard() {
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);
  const [chefs, setChefs] = useState([]);
  const [selectedChefId, setSelectedChefId] = useState('');
  const [hasClientProfile, setHasClientProfile] = useState(true);
  const [showConfirmToast, setShowConfirmToast] = useState(false);
  const [finalToast, setFinalToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch('/api/users/chefs')
      .then(data => setChefs(data))
      .catch(err => console.error('Erreur chargement traiteurs :', err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    apiFetch('/api/clients/client-dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => setClientData(data))
      .catch((err) => {
        console.error("Erreur client dashboard :", err);
        setError("Impossible de charger tes données.");
      });
  }, []);

  const handleChefSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      const updatedClient = await apiFetch('/api/clients/select-chef', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chefId: selectedChefId }),
      });

      setClientData(updatedClient);
      setHasClientProfile(true);
    } catch (err) {
      console.error("Erreur enregistrement traiteur :", err);
    }
  };

  // Met à jour une préférence existante ou en crée une nouvelle si besoin
  const handlePreferenceUpdate = async (preferenceId, likedValue, dishName) => {
    const token = localStorage.getItem("token");

    try {
      let updated;

      if (preferenceId) {
        updated = await apiFetch(`/api/preferences/${preferenceId}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ liked: likedValue }),
        });
      } else {
        updated = await apiFetch(`/api/preferences`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ dish_name: dishName, liked: likedValue }),
        });
      }

      setClientData((prev) => ({
        ...prev,
        preferences: prev.preferences.map((pref) =>
          pref.dish_name === dishName
            ? { ...pref, liked: updated.liked, preference_id: updated.id ?? preferenceId }
            : pref
        ),
      }));
    } catch (err) {
      console.error("Erreur mise à jour préférence :", err);
    }
  };

  const confirmDelete = () => setShowConfirmToast(true);
  const cancelDelete = () => {
    setShowConfirmToast(false);
    setFinalToast('cancelled');
    setTimeout(() => setFinalToast(null), 2000);
  };

  const proceedDelete = async () => {
    setShowConfirmToast(false);
    const token = localStorage.getItem('token');

    try {
      await apiFetch('/api/users/me', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFinalToast('deleted');
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setFinalToast(null);
        navigate('/signup');
      }, 2000);
    } catch (err) {
      console.error('Erreur suppression compte client :', err.message);
      alert('Suppression impossible');
    }
  };

  if (error) return <div className="min-h-screen bg-[#ffb563] flex items-center justify-center text-red-700 text-xl font-zenloop">{error}</div>;
  if (!clientData) return <div className="min-h-screen bg-[#ffb563] flex items-center justify-center font-zenloop text-xl text-[#5a3a00]">Chargement des données...</div>;

  const { firstName, total_delivered, pending_returns, unpaid_amount, preferences = [] } = clientData;

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center py-12 font-zenloop">
      <BentoDecoration />
      <LogoutBadge />
      <img src="/cutlery.png" alt="Icône couverts" className="w-12 h-12 mb-4" />
      <h1 className="text-4xl sm:text-5xl text-[#891c1c] mb-6 text-center">
        {firstName ? `${firstName}, ton espace gourmand` : "Ton espace gourmand"}
      </h1>
      <p className="text-[#5a3a00] text-lg mb-8 text-center max-w-lg">
        Un coup d’œil sur tes gamelles, ton solde, et tes plats préférés.
      </p>

      <div className="bg-[#fff0cc] rounded-2xl shadow-xl px-8 py-10 w-[90%] max-w-md text-[#5a3a00] space-y-6 text-xl">
        <div className="flex flex-col items-center">
          <img src="/foodbox.png" alt="Gamelles" className="w-10 h-10 mb-2" />
          <span className="font-semibold">Gamelles livrées : {total_delivered}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Gamelles à rendre</span>
          <span>{pending_returns}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Montant dû</span>
          <span>{unpaid_amount} €</span>
        </div>
      </div>

      <button onClick={() => navigate('/client-settings')} className="fixed bottom-4 left-4 z-50 flex items-center space-x-2 bg-[#ffd29d] hover:bg-[#ffcc85] text-[#5a3a00] font-medium py-2 px-4 rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 active:scale-95">
        <img src="/parameters.png" alt="Paramètres" className="w-6 h-6" />
        <span>Paramètres</span>
      </button>

      <button onClick={() => alert('À venir : historique des commandes.')} className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 bg-[#ffd29d] hover:bg-[#ffcc85] text-[#5a3a00] font-medium py-2 px-4 rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 active:scale-95">
        <img src="/history.png" alt="Historique" className="w-6 h-6" />
        <span>Historique</span>
      </button>

      {!hasClientProfile && (
        <div className="fixed bottom-32 left-4 z-50 bg-white shadow-lg rounded-lg p-4 w-72">
          <label className="block font-semibold mb-2 text-sm">Choisis ton traiteur :</label>
          <select value={selectedChefId} onChange={e => setSelectedChefId(e.target.value)} className="w-full border border-gray-300 rounded p-2 mb-3">
            <option value="">-- Sélectionne --</option>
            {chefs.map((chef) => (
              <option key={chef.id} value={chef.id}>{chef.firstname} {chef.lastname} ({chef.email})</option>
            ))}
          </select>
          <button onClick={handleChefSubmit} className="bg-[#a41623] hover:bg-[#891c1c] text-white py-1 px-4 rounded-full w-full transition-transform hover:scale-105">
            Valider
          </button>
        </div>
      )}

      <div className="mt-12 bg-[#fff0cc] rounded-xl shadow-lg px-6 py-8 w-[90%] max-w-xl text-[#5a3a00]">
        <h2 className="text-2xl mb-4 font-bold text-center">Tes plats</h2>
        <ul className="space-y-4">
          {preferences.length === 0 && (
            <li className="text-center text-sm text-gray-500">Tu n’as pas encore reçu de plats.</li>
          )}
          {preferences.map((pref) => (
            <li key={pref.dish_name} className="flex justify-between items-center border-b pb-2">
              <span>{pref.dish_name}</span>
              <div className="flex space-x-4">
                <button onClick={() => handlePreferenceUpdate(pref.preference_id, true, pref.dish_name)}>
                  <img src={pref.liked === true ? "/star_filled.png" : "/star_empty.png"} alt="Plat apprécié" className="w-6 h-6 hover:scale-110 transition" />
                </button>
                <button onClick={() => handlePreferenceUpdate(pref.preference_id, false, pref.dish_name)}>
                  <img src={pref.liked === false ? "/sad_filled.png" : "/sad_empty.png"} alt="Plat non apprécié" className="w-6 h-6 hover:scale-110 transition" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showConfirmToast && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-700 text-white px-6 py-4 rounded-xl shadow-xl z-50 text-center w-[90%] max-w-md">
          <p className="mb-2 text-lg font-medium">Tu es sur le point de supprimer ton compte.</p>
          <div className="flex flex-row justify-center items-center gap-4 mt-4">
            <button onClick={proceedDelete} className="bg-white text-red-700 font-semibold px-4 py-2 rounded-full hover:bg-red-100 transition">Oui</button>
            <button onClick={cancelDelete} className="bg-white text-red-700 font-semibold px-4 py-2 rounded-full hover:bg-red-100 transition">Non</button>
          </div>
        </div>
      )}

      {finalToast === 'deleted' && (
        <Toast message="Ton compte a été supprimé." type="error" duration={2000} onClose={() => setFinalToast(null)} position="center" />
      )}

      {finalToast === 'cancelled' && (
        <Toast message="Ouf, on a évité le pire !" type="error" duration={2000} onClose={() => setFinalToast(null)} position="center" />
      )}
    </div>
  );
}
