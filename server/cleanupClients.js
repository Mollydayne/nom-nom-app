// Script Node.js pour nettoyer la base :
// - Supprime tous les clients (users) sauf le traiteur
// - Supprime toutes les livraisons associées à ces clients

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données
const dbPath = path.join(__dirname, 'db/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('Erreur ouverture DB :', err.message);
  console.log('Connexion à la base ouverte avec succès');
});

// ID du traiteur à conserver (modifier si besoin)
const TRAITEUR_ID = 1;

// 1. Supprimer les livraisons des clients autres que le traiteur
const deleteDeliveries = `
  DELETE FROM deliveries
  WHERE client_id IN (
    SELECT id FROM users WHERE id != ?
  );
`;

// 2. Supprimer les utilisateurs qui ne sont pas le traiteur
const deleteUsers = `
  DELETE FROM users WHERE id != ?;
`;

// 3. Supprimer aussi les préférences liées
const deletePreferences = `
  DELETE FROM preferences WHERE client_id != ?;
`;

// Exécution séquentielle
db.serialize(() => {
  db.run(deleteDeliveries, [TRAITEUR_ID], function(err) {
    if (err) return console.error('Erreur suppression livraisons :', err.message);
    console.log(`Livraisons supprimées : ${this.changes}`);
  });

  db.run(deletePreferences, [TRAITEUR_ID], function(err) {
    if (err) return console.error('Erreur suppression préférences :', err.message);
    console.log(`Préférences supprimées : ${this.changes}`);
  });

  db.run(deleteUsers, [TRAITEUR_ID], function(err) {
    if (err) return console.error('Erreur suppression users :', err.message);
    console.log(`Utilisateurs supprimés : ${this.changes}`);
  });

  db.close();
});
