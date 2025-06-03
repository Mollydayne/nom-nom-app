import { useEffect, useState } from 'react';
import BentoDecoration from '../components/BentoDecoration';
import LogoutBadge from '../components/LogoutBadge';
import { useNavigate } from 'react-router-dom';


export default function ClientDashboard() {
  // Stockage local des données du client
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  

  // Requête vers l’API pour charger les informations du client
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/api/clients/client-dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data) => setClientData(data))
      .catch((err) => {
        console.error("Erreur client dashboard :", err);
        setError("Impossible de charger tes données.");
      });
  }, []);

  // Fonction pour enregistrer un avis sur un plat
  const handlePreferenceUpdate = async (preferenceId, likedValue) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3001/api/preferences/${preferenceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ liked: likedValue }),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      const updatedPref = await res.json();

      // Mise à jour de l'état local avec la nouvelle préférence
      setClientData((prev) => ({
        ...prev,
        preferences: prev.preferences.map((pref) =>
          pref.id === preferenceId ? { ...pref, liked: updatedPref.liked } : pref
        ),
      }));
    } catch (err) {
      console.error("Erreur mise à jour préférence :", err);
    }
  };

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-[#ffb563] flex items-center justify-center text-red-700 text-xl font-zenloop">
        {error}
      </div>
    );
  }

  // Affichage en cours de chargement
  if (!clientData) {
    return (
      <div className="min-h-screen bg-[#ffb563] flex items-center justify-center font-zenloop text-xl text-[#5a3a00]">
        Chargement des données...
      </div>
    );
  }

  
  // Données déstructurées du client
const { firstName, total_delivered, pending_returns, unpaid_amount, preferences = [] } = clientData;

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center py-12 font-zenloop">
      {/* Élément décoratif en haut à gauche */}
      <BentoDecoration />

      {/* Badge de déconnexion */}
      <LogoutBadge />

      {/* Icône couverts au-dessus du titre */}
      <img src="/cutlery.png" alt="Icône couverts" className="w-12 h-12 mb-4" />

      {/* Titre de la page */}
      <h1 className="text-4xl sm:text-5xl text-[#891c1c] mb-6 text-center">
       {firstName ? `${firstName}, ton espace gourmand` : "Ton espace gourmand"}
      </h1>


      {/* Phrase de bienvenue */}
      <p className="text-[#5a3a00] text-lg mb-8 text-center max-w-lg">
        Un coup d’œil sur tes gamelles, ton solde, et tes plats préférés.
      </p>

      {/* Encadré des statistiques */}
      <div className="bg-[#fff0cc]  rounded-2xl shadow-xl px-8 py-10 w-[90%] max-w-md text-[#5a3a00] space-y-6 text-xl">
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

      {/* Bouton vers l’historique */}
    <button
  onClick={() => alert('À venir : historique des commandes.')}
  className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 bg-[#ffd29d] hover:bg-[#ffcc85] text-[#5a3a00] font-medium py-2 px-4 rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 active:scale-95"
>
  <img src="/history.png" alt="Icône historique" className="w-6 h-6" />
  <span>Historique</span>
</button>



      {/* Bouton vers les parametres */}

   <button
  onClick={() => navigate('/client-settings')}
  className="fixed bottom-4 left-4 z-50 flex items-center space-x-2 bg-[#ffd29d] hover:bg-[#ffcc85] text-[#5a3a00] font-medium py-2 px-4 rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 active:scale-95"
>
  <img src="/parameters.png" alt="Icône paramètres" className="w-6 h-6" />
  <span>Paramètres</span>
</button>



      {/* Liste des plats avec options d’avis */}
      <div className="mt-12 bg-[#fff0cc]  rounded-xl shadow-lg px-6 py-8 w-[90%] max-w-xl text-[#5a3a00]">
        <h2 className="text-2xl mb-4 font-bold text-center">Tes plats</h2>
        <ul className="space-y-4">
          {preferences.length === 0 && (
            <li className="text-center text-sm text-gray-500">
              Tu n’as pas encore noté de plats.
            </li>
          )}
          {preferences.map((pref) => (
            <li key={pref.id} className="flex justify-between items-center border-b pb-2">
              <span>{pref.dish_name}</span>
              <div className="flex space-x-4">
                <button onClick={() => handlePreferenceUpdate(pref.id, true)}>
                  <img
                    src={
                      pref.liked === true
                        ? "/star_filled.png"
                        : "/star_empty.png"
                    }
                    alt="Plat apprécié"
                    className="w-6 h-6 hover:scale-110 transition"
                  />
                </button>
                <button onClick={() => handlePreferenceUpdate(pref.id, false)}>
                  <img
                    src={
                      pref.liked === false
                        ? "/sad_filled.png"
                        : "/sad_empty.png"
                    }
                    alt="Plat non apprécié"
                    className="w-6 h-6 hover:scale-110 transition"
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
