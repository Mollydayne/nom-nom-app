import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import TopRightCircle from '../components/TopRightCircle';
import { apiFetch } from '../api'; // Ajout de l'import pour la fonction centralisée

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Utilisation de apiFetch à la place de fetch directement
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const data = await apiFetch(`/users/reset-password/${token}`, {
        method: 'POST',
        body: { newPassword },
      });

      setMessage("Mot de passe modifié avec succès. Redirection en cours...");
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center font-zenloop px-4 text-[#5a3a00] relative">
      {/* Décorations visuelles */}
      <BentoDecoration />
      <TopRightCircle />

      {/* Titre */}
      <h1 className="text-4xl sm:text-5xl text-[#891c1c] mb-6 text-center">
        Réinitialiser votre mot de passe
      </h1>

      {/* Formulaire de réinitialisation */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-4 px-6 py-2 rounded-full bg-[#ffe4b3] text-black text-center outline-none w-full focus:bg-[#ffeecd]"
        />
        <input
          type="password"
          placeholder="Confirmez le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 px-6 py-2 rounded-full bg-[#ffe4b3] text-black text-center outline-none w-full focus:bg-[#ffeecd]"
        />

        <button
          type="submit"
          className="w-40 px-6 py-2 bg-[#f85e00] text-white font-medium rounded-full hover:bg-[#d24a00] transition"
        >
          Confirmer
        </button>
      </form>

      {/* Message de succès ou d’erreur */}
      {message && <p className="mt-4 text-green-700 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-700 text-center">{error}</p>}
    </div>
  );
}

export default ResetPassword;
