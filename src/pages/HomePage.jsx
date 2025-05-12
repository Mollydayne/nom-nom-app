import { Link } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import TopRightCircle from '../components/TopRightCircle';

function HomePage() {
  return (
    <div className="min-h-screen bg-[#ffb563] font-zenloop text-[#5a3a00] flex flex-col items-center justify-center px-6 text-center relative">
      {/* Décorations visuelles */}
      <BentoDecoration />
      <TopRightCircle />

      {/* Titre principal */}
      <h1 className="text-6xl sm:text-7xl md:text-8xl text-[#891c1c] mb-6 leading-tight">
        Bienvenue chez NomNom
      </h1>

      {/* Texte d’introduction */}
      <p className="text-xl sm:text-2xl md:text-3xl max-w-2xl mb-10">
        NomNom, c’est l’application pensée pour les traiteurs et cuisiniers à domicile
        qui livrent leurs repas dans des contenants réutilisables.
        Suivez vos livraisons, vos retours de gamelles et vos paiements en toute simplicité.
      </p>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/signup"
          className="px-8 py-3 bg-[#f85e00] text-white rounded-full text-lg hover:bg-[#d24a00] transition"
        >
          Créer un compte
        </Link>
        <Link
          to="/login"
          className="px-8 py-3 border-2 border-[#f85e00] text-[#5a3a00] rounded-full text-lg hover:bg-[#ffeecd] transition"
        >
          Se connecter
        </Link>
      </div>

      {/* Image décorative optionnelle */}
      <img
        src="/bento.png"
        alt="Bento de démonstration"
        className="mt-10 w-40 sm:w-52 md:w-64 opacity-90 pointer-events-none select-none"
      />
    </div>
  );
}

export default HomePage;
