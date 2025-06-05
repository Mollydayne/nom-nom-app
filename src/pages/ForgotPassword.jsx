import { useState } from 'react';
import BentoDecoration from '../components/BentoDecoration';
import TopRightCircle from '../components/TopRightCircle';

// Import centralisé de l'utilitaire d'appel API
import { apiFetch } from '../api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Envoie l'adresse email au backend pour lancer la procédure de récupération
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // On remplace l'appel fetch local par apiFetch
      const res = await apiFetch('/users/forgot-password', {
        method: 'POST',
        body: { email },
      });

      setMessage(res.message || 'Une erreur est survenue');
    } catch (error) {
      setMessage("Impossible d'envoyer la demande. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center font-zenloop px-4 text-[#5a3a00] relative">
      {/* Décorations visuelles */}
      <BentoDecoration />
      <TopRightCircle />

      {/* Titre principal */}
      <h1 className="text-4xl sm:text-5xl text-[#891c1c] mb-6 text-center">
        Récupération de mot de passe
      </h1>

      {/* Formulaire d'envoi de l'email */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
        <input
          type="email"
          placeholder="Votre adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 px-6 py-2 rounded-full bg-[#ffe4b3] text-black text-center outline-none w-full focus:bg-[#ffeecd] hover:bg-[#ffeecd] transition"
        />
        <button
          type="submit"
          className="w-40 px-6 py-2 bg-[#f85e00] text-white font-medium rounded-full hover:bg-[#d24a00] transition"
        >
          Envoyer
        </button>
      </form>

      {/* Message de confirmation ou d'erreur */}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default ForgotPassword;
