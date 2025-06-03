import { Link } from 'react-router-dom';
import { useState } from 'react';
import BentoDecoration from '../components/BentoDecoration';
import TopRightCircle from '../components/TopRightCircle';
import useScrollSpy from '../hooks/useScrollSpy';
import LightBulbSwitch from '../components/LightBulbSwitch';


function HomePage() {
  // Hook pour suivre la section visible à l'écran
  const activeSection = useScrollSpy([
    'fonctionnalites',
    'comment',
    'temoignage',
    'cta'
  ]);

  return (
    <div className="min-h-screen bg-[#ffb563] font-zenloop text-[#5a3a00] px-6 text-center relative overflow-x-hidden scroll-smooth">
      {/* Décorations visuelles */}
      <BentoDecoration />
      <TopRightCircle />



      {/* Section d'introduction principale */}
      <section className="flex flex-col items-center justify-center min-h-[90vh] pt-20">
        <h1 className="text-6xl sm:text-7xl md:text-8xl text-[#891c1c] mb-6 leading-tight">
          Bienvenue chez NomNom
        </h1>

        {/* Section de fonctionnalités */}
      
        <section id="fonctionnalites" className="mt-12 mb-10 space-y-12">
  <h2 className="text-4xl text-[#891c1c] mb-4">Fonctionnalités clés</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

    <div className="relative group bg-gradient-to-br from-[#ffd29d] to-[#ffb563] p-6 rounded-2xl shadow-[0_4px_10px_rgba(248,94,0,0.15)] border-2 border-transparent transform transition duration-300 hover:scale-105 hover:-translate-y-1 hover:border-[#f85e00]">
      <img
        src="/scan-qr.png"
        alt="Scan QR code"
        className="w-16 h-16 mx-auto mb-4 transition-transform duration-300 group-hover:-translate-y-2"
      />
      <h3 className="text-2xl font-bold mb-2">Suivi par QR code</h3>
      <p>Scannez vos livraisons et retours de gamelles en un clin d’œil.</p>
    </div>

    <div className="relative group bg-gradient-to-br from-[#ffd29d] to-[#ffb563] p-6 rounded-2xl shadow-[0_4px_10px_rgba(248,94,0,0.15)] border-2 border-transparent transform transition duration-300 hover:scale-105 hover:-translate-y-1 hover:border-[#f85e00]">
      <img
        src="/paiement.png"
        alt="Paiement"
        className="w-16 h-16 mx-auto mb-4 transition-transform duration-300 group-hover:-translate-y-2"
      />
      <h3 className="text-2xl font-bold mb-2">Paiements suivis</h3>
      <p>Gardez une trace précise de ce que vos clients vous doivent.</p>
    </div>

    <div className="relative group bg-gradient-to-br from-[#ffd29d] to-[#ffb563] p-6 rounded-2xl shadow-[0_4px_10px_rgba(248,94,0,0.15)] border-2 border-transparent transform transition duration-300 hover:scale-105 hover:-translate-y-1 hover:border-[#f85e00]">
      <img
        src="/preferences.png"
        alt="Préférences"
        className="w-16 h-16 mx-auto mb-4 transition-transform duration-300 group-hover:-translate-y-2"
      />
      <h3 className="text-2xl font-bold mb-2">Préférences clients</h3>
      <p>Notez ce qu’ils aiment (ou pas) pour ajuster vos menus au fil du temps.</p>
    </div>

  </div>
</section>

        {/* Texte d’introduction */}
        <p className="text-xl sm:text-2xl md:text-3xl max-w-2xl mb-10">
          L’application idéale pour les cuisiniers à domicile qui veulent garder le contrôle sur leurs contenants, leurs paiements et leurs recettes préférées.
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="px-8 py-3 bg-[#f85e00] text-white rounded-full text-lg hover:bg-[#d24a00] transition hover:scale-105"
          >
            Créer un compte
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-[#f85e00] text-white rounded-full text-lg hover:bg-[#d24a00] transition hover:scale-105"
          >
            Se connecter
          </Link>
        </div>

        {/* Image décorative */}
        <img
          src="/bento.png"
          alt="Bento de démonstration"
          className="mt-10 w-40 sm:w-52 md:w-64 opacity-90 pointer-events-none select-none animate-fade-in"
        />
      </section>

      {/* Section "Comment ça marche" */}
      <section id="comment" className="mt-32 max-w-4xl mx-auto">
        <h2 className="text-4xl text-[#891c1c] mb-8">Comment ça marche ?</h2>
        <ol className="space-y-6 text-left text-lg">
          <li><strong>1. Je scanne</strong> la gamelle livrée à l’aide de l’appli.</li>
          <li><strong>2. Je livre</strong> en toute tranquillité.</li>
          <li><strong>3. Je scanne </strong> la gamelle retournée.</li>
        </ol>
      </section>

      {/* Section témoignage */}
      <section id="temoignage" className="mt-32 text-center max-w-2xl mx-auto italic text-[#5a3a00]">
        <p>“NomNom c'est super !”</p>
        <p className="mt-2">— Une patate, testeuse enthousiaste</p>
      </section>

      {/* Appel à l’action */}
      <section id="cta" className="mt-32 mb-20">
        <h2 className="text-4xl text-[#891c1c] mb-6">Prêt à vous organiser comme un chef ?</h2>
        <Link
          to="/signup"
          className="px-10 py-4 bg-[#f85e00] text-white rounded-full text-xl hover:bg-[#d24a00] transition hover:scale-105"
        >
          C’est parti !
        </Link>
      </section>

      {/* Pied de page avec navigation dynamique */}
      <footer className="bg-[#ffd29d] text-[#5a3a00] py-12 border-t border-[#f1b97d] mt-20 shadow-inner">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-6 text-center">
          <nav className="flex flex-wrap justify-center gap-6 text-base">
            <a
              href="#fonctionnalites"
              className={`transition ${
                activeSection === 'fonctionnalites' ? 'text-[#891c1c] font-semibold underline' : 'hover:text-[#891c1c]'
              }`}
            >
              Fonctionnalités
            </a>
            <a
              href="#comment"
              className={`transition ${
                activeSection === 'comment' ? 'text-[#891c1c] font-semibold underline' : 'hover:text-[#891c1c]'
              }`}
            >
              Comment ça marche
            </a>
            <a
              href="#temoignage"
              className={`transition ${
                activeSection === 'temoignage' ? 'text-[#891c1c] font-semibold underline' : 'hover:text-[#891c1c]'
              }`}
            >
              Témoignage
            </a>
            <a
              href="#cta"
              className={`transition ${
                activeSection === 'cta' ? 'text-[#891c1c] font-semibold underline' : 'hover:text-[#891c1c]'
              }`}
            >
              Inscription
            </a>
            <Link to="/a-propos" className="hover:text-[#891c1c] transition">À propos</Link>
            <Link to="/mentions-legales" className="hover:text-[#891c1c] transition">Mentions légales</Link>
          </nav>

          <p className="text-sm">&copy; {new Date().getFullYear()} NomNom — Cuisiné et codé avec amour à Bordeaux.</p>
        </div>
      </footer>

      {/* Bouton flottant "Retour en haut" */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-[#f85e00] text-white p-3 rounded-full shadow-lg hover:bg-[#d24a00] transition z-50"
        aria-label="Retour en haut"
      >
        ↑
      </button>
    </div>
  );
}

export default HomePage;
