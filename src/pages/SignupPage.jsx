// SignupPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import TopRightCircle from '../components/TopRightCircle';

function SignupPage() {
  const navigate = useNavigate();

  // ✅ Clés modifiées ici : firstname, lastname
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    motDePasse: '',
    role: 'client',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      navigate('/login');
    } else {
      setError(data.error || "Erreur à l’inscription");
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
        <input
          type="text"
          name="firstname"
          placeholder="Prénom"
          value={form.firstname}
          onChange={handleChange}
          required
          className="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] w-full outline-none"
        />

        <input
          type="text"
          name="lastname"
          placeholder="Nom"
          value={form.lastname}
          onChange={handleChange}
          required
          className="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] w-full outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] w-full outline-none"
        />

        <input
          type="password"
          name="motDePasse"
          placeholder="Mot de passe"
          value={form.motDePasse}
          onChange={handleChange}
          required
          className="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] w-full outline-none"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="mb-6 px-6 py-2 rounded-full bg-[#ffe4b3] text-center text-[#5a3a00] w-full outline-none cursor-pointer"
        >
          <option value="client">Je suis client</option>
          <option value="traiteur">Je suis traiteur</option>
        </select>

        <button
          type="submit"
          className="w-40 sm:w-48 md:w-56 px-6 py-2 bg-[#f85e00] text-white font-medium rounded-full hover:bg-[#d24a00] transition text-center"
        >
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
