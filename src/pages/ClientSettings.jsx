import { useEffect, useState } from 'react';
import { apiFetch } from '../api'; // Import de notre fonction centralisée

export default function ClientSettings() {
  const token = localStorage.getItem('token');
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Remplacement de fetch direct par apiFetch
    apiFetch('/api/clients/me', { token })
      .then(setClient)
      .catch(() => setMessage('Erreur de chargement des informations.'));
  }, [token]);

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Remplacement de fetch PUT par apiFetch
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

  if (!client) {
    return (
      <div className="min-h-screen bg-[#ffb563] flex items-center justify-center text-[#5a3a00] font-zenloop">
        Chargement des informations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center text-[#5a3a00] font-zenloop px-4">
      <h1 className="text-4xl text-[#891c1c] mb-6">Paramètres du compte</h1>

      <div className="bg-[#fff0cc] rounded-2xl shadow-lg p-8 w-full max-w-md space-y-4 text-lg">
        <label className="flex flex-col">
          Prénom :
          <input name="firstName" value={client.firstName} onChange={handleChange} className="rounded px-3 py-1 mt-1 bg-white" />
        </label>
        <label className="flex flex-col">
          Nom :
          <input name="lastName" value={client.lastName} onChange={handleChange} className="rounded px-3 py-1 mt-1 bg-white" />
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

        {message && <p className="text-center mt-2 text-sm">{message}</p>}
      </div>
    </div>
  );
}
