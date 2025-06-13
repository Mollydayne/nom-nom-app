// SignupPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api'; // Import du fetch centralisé
import BentoDecoration from '../components/BentoDecoration';
import TopRightCircle from '../components/TopRightCircle';

function SignupPage() {
  const navigate = useNavigate();
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    motDePasse: '',
    role: 'client',
    chefId: '',
  });

  // Au chargement, on va chercher la liste des traiteurs
  useEffect(() => {
    apiFetch('/api/users/chefs')
      .then(data => setChefs(data))
      .catch(err => console.error('Erreur chargement traiteurs :', err));
  }, []);

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Lors de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/api/users/register', {
        method: 'POST',
        body: form,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center font-zenloop px-4 relative text-[#5a3a00]">
      <BentoDecoration />
      <TopRightCircle />

      <h1 className="text-5xl sm:text-6xl md:text-7xl text-[#891c1c] mb-8 leading-none">
        Création de compte
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
        <input type="text" name="firstname" placeholder="Prénom" value={form.firstname} onChange={handleChange} required className="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] w-full outline-none" />
        <input type="text" name="lastname" placeholder="Nom" value={form.lastname} onChange={handleChange} required className="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] w-full outline-none" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] w-full outline-none" />
        <input type="password" name="motDePasse" placeholder="Mot de passe" value={form.motDePasse} onChange={handleChange} required className="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] w-full outline-none" />

        <select name="role" value={form.role} onChange={handleChange} className="mb-4 px-6 py-2 rounded-full bg-[#ffe4b3] text-center text-[#5a3a00] w-full outline-none cursor-pointer">
          <option value="client">Je suis client</option>
          <option value="traiteur">Je suis traiteur</option>
        </select>

        {/* Sélection du traiteur uniquement pour les clients */}
        {form.role === 'client' && (
          <select name="chefId" value={form.chefId} onChange={handleChange} className="mb-6 px-6 py-2 rounded-full bg-[#fff0cc] text-center text-[#5a3a00] w-full outline-none cursor-pointer">
            <option value="">-- Choisis ton traiteur --</option>
            {chefs.map((chef) => (
              <option key={chef.id} value={chef.id}>
                {chef.firstname} {chef.lastname} ({chef.email})
              </option>
            ))}
          </select>
        )}

        <button type="submit" className="w-40 sm:w-48 md:w-56 px-6 py-2 bg-[#f85e00] text-white font-medium rounded-full hover:bg-[#d24a00] transition text-center">
          S'inscrire
        </button>

        {error && <p className="mt-4 text-red-700">{error}</p>}
      </form>

      <p className="mt-6 text-[#5a3a00] text-lg">
        Déjà inscrit ?
        <Link to="/login" className="hover:text-[#891c1c] transition ml-1">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

export default SignupPage;
