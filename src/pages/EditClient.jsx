import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import Toast from '../components/Toast';
import { apiFetch } from '../api'; // Import du helper centralisé pour les requêtes

function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    allergies: '',
    likes: '',
  });

  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Chargement des données du client via apiFetch (remplace fetch direct)
  useEffect(() => {
    apiFetch(`/api/clients/${id}`)
      .then((data) => {
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          allergies: data.allergies || '',
          likes: data.likes || '',
        });
      })
      .catch((err) => {
        console.error('Erreur chargement client :', err);
        navigate('/central-kitchen');
      });
  }, [id, navigate]);

  // Gestion du changement dans les champs du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire via apiFetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await apiFetch(`/api/clients/${id}`, {
        method: 'PUT',
        body: form,
      });

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(`/clients/${id}`);
      }, 2500);
    } catch (err) {
      console.error('Erreur update :', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center font-zenloop px-4 text-[#5a3a00] relative">
      <BentoDecoration />

      <h1 className="text-4xl text-[#891c1c] mb-6">Edit Client</h1>

      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm space-y-3">
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-full bg-[#ffe4b3] text-center text-black outline-none focus:bg-[#ffeecd] hover:bg-[#ffeecd] transition"
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-full bg-[#ffe4b3] text-center text-black outline-none focus:bg-[#ffeecd] hover:bg-[#ffeecd] transition"
        />
        <input
          name="email"
          type="email"
          placeholder="Email (optionnel)"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-[#ffe4b3] text-center text-black outline-none focus:bg-[#ffeecd] hover:bg-[#ffeecd] transition"
        />
        <input
          name="allergies"
          type="text"
          placeholder="Allergies (séparées par des virgules)"
          value={form.allergies}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-[#ffe4b3] text-center text-black outline-none focus:bg-[#ffeecd] hover:bg-[#ffeecd] transition"
        />
        <input
          name="likes"
          type="text"
          placeholder="Likes (séparés par des virgules)"
          value={form.likes}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-[#ffe4b3] text-center text-black outline-none focus:bg-[#ffeecd] hover:bg-[#ffeecd] transition"
        />

        <button
          type="submit"
          className="bg-[#f85e00] text-white py-2 rounded-full hover:bg-[#d24a00] transition"
        >
          Enregistrer les modifications
        </button>

        {error && <p className="text-red-700 mt-2">{error}</p>}
      </form>

      {/* Bouton de retour vers la page principale */}
      <button
        onClick={() => navigate('/central-kitchen')}
        type="button"
        className="mt-4 px-6 py-2 bg-[#f85e00] text-white rounded-full hover:bg-[#d24a00] transition"
      >
        Retour à Central Kitchen
      </button>

      {/* Toast de confirmation si modification réussie */}
      {showToast && (
        <Toast
          message="Modification(s) enregistrée(s)"
          type="success"
          duration={2500}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

export default EditClient;
