import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import Toast from '../components/Toast';

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

  // Charge les données existantes du client
  useEffect(() => {
    fetch(`http://localhost:3001/api/clients/${id}`)
      .then((res) => res.json())
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

  // Met à jour les champs du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envoie les modifications au backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`http://localhost:3001/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la mise à jour');

      setShowToast(true); // Affiche le toast de confirmation
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
          placeholder="Email (optional)"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-[#ffe4b3] text-center text-black outline-none focus:bg-[#ffeecd] hover:bg-[#ffeecd] transition"
        />
        <input
          name="allergies"
          type="text"
          placeholder="Allergies (comma separated)"
          value={form.allergies}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-[#ffe4b3] text-center text-black outline-none focus:bg-[#ffeecd] hover:bg-[#ffeecd] transition"
        />
        <input
          name="likes"
          type="text"
          placeholder="Likes (comma separated)"
          value={form.likes}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-[#ffe4b3] text-center text-black outline-none focus:bg-[#ffeecd] hover:bg-[#ffeecd] transition"
        />

        <button
          type="submit"
          className="bg-[#f85e00] text-white py-2 rounded-full hover:bg-[#d24a00] transition"
        >
          Save changes
        </button>

        {error && <p className="text-red-700 mt-2">{error}</p>}
      </form>

      {/* Bouton de retour vers Central Kitchen */}
      <button
        onClick={() => navigate('/central-kitchen')}
        type="button"
        className="mt-4 px-6 py-2 bg-[#f85e00] text-white rounded-full hover:bg-[#d24a00] transition"
      >
        Back to kitchen
      </button>

      {/* Toast de confirmation */}
      {showToast && (
        <Toast
          message="Modification(s) enregistrée(s) ! "
          type="success"
          duration={2500}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

export default EditClient;
