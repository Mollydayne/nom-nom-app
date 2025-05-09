import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast'; // ✅ Import du composant réutilisable

function AddClient() {
  // État du formulaire
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    allergies: '',
    likes: '',
  });

  // État pour erreurs et affichage du toast
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  // Mise à jour des champs du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Détection de doublons dans une chaîne séparée par des virgules
  const hasDuplicates = (str) => {
    const items = str
      .toLowerCase()
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);
    return new Set(items).size !== items.length;
  };

  // Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation côté client
    if (!form.firstName.trim() || !form.lastName.trim()) {
      return setError('First name and last name are required.');
    }

    if (hasDuplicates(form.allergies)) {
      return setError('Duplicate allergies are not allowed.');
    }

    if (hasDuplicates(form.likes)) {
      return setError('Duplicate likes are not allowed.');
    }

    try {
      const res = await fetch('http://localhost:3001/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la création');

      // Affiche le toast de succès
      setShowToast(true);

      // Redirige après 2.5 secondes
      setTimeout(() => {
        setShowToast(false);
        navigate('/central-kitchen');
      }, 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* 🍱 Image décorative bento */}
      <img
        src="/bento.png"
        alt="Bento decoration"
        className="fixed pointer-events-none select-none opacity-30 animate-fade-in
                   top-[-80px] left-[-80px]
                   sm:top-[-100px] sm:left-[-100px]
                   md:top-[-150px] md:left-[-150px]
                   lg:top-[-100px] lg:left-[-100px]
                   max-w-[1800px] w-auto h-auto z-0"
      />

      {/* 🧾 Formulaire principal */}
      <div className="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center font-zenloop px-4 text-[#5a3a00]">
        <h1 className="text-4xl text-[#891c1c] mb-6">Add a Client</h1>
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
            Add client
          </button>

          {/* Affiche une erreur si présente */}
          {error && <p className="text-red-700 mt-2">{error}</p>}
        </form>
      </div>

      {/* Toast de succès */}
      {showToast && (
        <Toast
          message="Client ajouté ! "
          type="success"
          duration={2500}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}

export default AddClient;
