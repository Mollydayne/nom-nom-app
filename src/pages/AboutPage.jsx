import { Link } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import TopRightCircle from '../components/TopRightCircle';

// Making a comment to force a push


function AboutPage() {
  return (
    <div className="min-h-screen bg-[#ffb563] text-[#5a3a00] font-zenloop px-6 py-16 relative">
      {/* Décoration visuelle */}
      <BentoDecoration />
      <TopRightCircle  />

      {/* Titre */}
      <h1 className="text-5xl md:text-6xl text-center text-[#891c1c] mb-12">À propos</h1>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto text-lg text-left space-y-8">
        <section className="flex flex-col md:flex-row items-center gap-10">
          {/* Photo */}
          <img
            src="/molly.jpg"
            alt="Portrait de Molly, créatrice de NomNom"
            className="w-48 h-48 rounded-full object-cover border-4 border-[#f85e00] shadow-md"
          />

          {/* Texte de présentation */}
          <div>
            <p>
              Passionnée de cuisine maison, de code et de gestion bien ficelée,
              j’ai créé NomNom pour aider les traiteurs à suivre leurs contenants, livraisons
              et paiements sans prise de tête.
            </p>
            <p className="mt-4">
              Ce projet est né dans le cadre de ma formation à Holberton School, mais il répond à un vrai
              besoin : savoir chez qui sont les gamelles, ce que les gens ont aimé ou pas, et
              combien ils  doivent. Alors j’ai mis la main à la pâte pour développer un outil aidant à proposer des repas écologiques, grâce aux contenants réutilisables.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">Et après ?</h2>
          <p>
            Mon ambition est de faire évoluer NomNom pour qu’il puisse aider plus de gens à mieux gérer
            leur activité culinaire locale. Des fonctionnalités comme la gestion des stocks, la création
            de menus personnalisés, ou encore l’envoi automatique d’emails sont en train de mijoter !
          </p>
        </section>

        {/* Bouton retour */}
        <div className="pt-10 text-center">
          <Link to="/" className="text-[#f85e00] hover:underline">Retour à l’accueil</Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
