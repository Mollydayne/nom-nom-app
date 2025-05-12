import { Link } from 'react-router-dom';
import BentoDecoration from '../components/BentoDecoration';
import TopRightCircle from '../components/TopRightCircle';

function MentionsLegales() {
  return (
    <div className="min-h-screen bg-[#ffd29d] text-[#5a3a00] font-zenloop px-6 py-16 relative">
      {/* Décoration Bento */}
      <BentoDecoration />
      <TopRightCircle />

      {/* Titre de la page */}
      <h1 className="text-5xl md:text-6xl text-center text-[#891c1c] mb-12">Mentions légales</h1>

      {/* Contenu principal */}
      <div className="max-w-3xl mx-auto space-y-8 text-left text-lg">
        <section>
          <h2 className="text-2xl font-bold mb-2">Éditeur du site</h2>
          <p>Le site NomNom est édité par Clarisse Perez, dans le cadre d’un projet de fin d’année à Holberton School Bordeaux.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">Hébergement</h2>
          <p>Le site est hébergé par ...</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">Responsabilité</h2>
          <p>
            Les informations présentées sur ce site sont fournies à titre indicatif et peuvent être modifiées à tout moment.
            L’éditeur du site ne peut être tenu responsable de l’utilisation faite du contenu par les utilisateurs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">Données personnelles</h2>
          <p>
            Les données collectées via l’application NomNom (comme les adresses e-mail, préférences alimentaires ou historiques de livraison) sont strictement utilisées pour le bon fonctionnement du service et ne sont pas transmises à des tiers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">Propriété intellectuelle</h2>
          <p>
            L’ensemble des éléments du site (textes, illustrations, code, logo) est la propriété exclusive de NomNom, sauf mention contraire, et ne peut être reproduit sans autorisation.
          </p>
        </section>

        {/* Lien de retour */}
        <div className="pt-10 text-center">
          <Link to="/" className="text-[#f85e00] hover:underline">Retour à l’accueil</Link>
        </div>
      </div>
    </div>
  );
}

export default MentionsLegales;
