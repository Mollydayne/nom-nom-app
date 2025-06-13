// Script Node.js pour créer la table 'preferences' si elle n'existe pas

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Charger la base de données
const dbPath = path.join(__dirname, 'db/database.sqlite');
console.log('Connexion à la base :', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur ouverture base :', err.message);
  } else {
    console.log('Base ouverte avec succès');
  }
});

// Créer la table si elle n'existe pas
const createTable = `
  CREATE TABLE IF NOT EXISTS preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    dish_name TEXT NOT NULL,
    liked BOOLEAN
  );
`;

db.run(createTable, (err) => {
  if (err) {
    console.error('Erreur création table preferences :', err.message);
  } else {
    console.log('Table preferences créée ou déjà existante.');

    // Lister toutes les tables pour confirmation
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
      if (err) {
        console.error('Erreur listing tables :', err.message);
      } else {
        console.log('Tables dans la base :');
        rows.forEach(row => console.log(' -', row.name));
      }
      db.close();
    });
  }
});
