import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import Toast from '../components/Toast';
import LogoutBadge from '../components/LogoutBadge';
import TopRightCircle from '../components/TopRightCircle';

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showRedirectToast, setShowRedirectToast] = useState(false);
  const navigate = useNavigate();

  // Affiche un toast si l'utilisateur a été redirigé depuis une route protégée
  useEffect(() => {
    const reason = localStorage.getItem('redirectReason');
    if (reason === 'unauthorized') {
      setShowRedirectToast(true);
      localStorage.removeItem('redirectReason');
      setTimeout(() => setShowRedirectToast(false), 3000);
    }
  }, []);

  // Met à jour les champs du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envoie du formulaire au backend pour authentification
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      const role = data.user.role;

      // Sauvegarde dans le localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('role', role);

      // Redirige selon le rôle
      if (role === 'client') {
        navigate('/client-dashboard');
      } else if (role === 'traiteur') {
        navigate('/central-kitchen');
      } else {
        navigate('/unauthorized');
      }
    } else {
      setError(data.error || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center font-zenloop px-4 relative text-[#5a3a00]">
      {/* Image décorative en haut à gauche */}
      <BentoDecoration />
      <TopRightCircle />
      {/* Titre de la page */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl text-[#891c1c] mb-8 leading-none">
        Welcome back !
      </h1>

      {/* Formulaire de connexion */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="mb-4 px-6 py-2 rounded-full bg-[#ffe4b3] text-black text-center outline-none w-full focus:bg-[#ffeecd] hover:bg-[#ffeecd] transition"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="mb-6 px-6 py-2 rounded-full bg-[#ffe4b3] text-black text-center outline-none w-full focus:bg-[#ffeecd] hover:bg-[#ffeecd] transition"
        />

        <button
          type="submit"
          className="w-40 sm:w-48 md:w-56 px-6 py-2 bg-[#f85e00] text-white font-medium rounded-full hover:bg-[#d24a00] transition text-center"
        >
          Log in
        </button>

        <Link
          to="/forgot-password"
          className="mt-6 text-sm text-[#5a3a00] hover:text-[#891c1c] transition"
        >
          Mot de passe oublié ?
        </Link>

        {/* Message d'erreur si connexion échouée */}
        {error && <p className="mt-4 text-red-700">{error}</p>}
      </form>

      {/* Lien vers la page d'inscription */}
      <p className="mt-6 text-[#5a3a00] text-lg">
        Pas encore de compte dans notre fantastique app ?
        <Link to="/" className="hover:text-[#891c1c] transition ml-1">
          Sign up !
        </Link>
      </p>

      {/* Toast d'alerte si redirection depuis une route protégée */}
      {showRedirectToast && (
        <Toast
          message="Il faut être authentifié pour pouvoir accéder à cette page !"
          duration={3000}
          onClose={() => setShowRedirectToast(false)}
        />
      )}
    </div>
  );
}

export default Login;
