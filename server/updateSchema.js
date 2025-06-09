const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'db/database.sqlite'));

// Forcer la création des tables (copié depuis database.js)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'client',
      reset_token TEXT,
      reset_expires INTEGER
    )
  `);
});

// Fonction pour ajouter une colonne si elle n'existe pas
const addColumnIfNotExists = (table, column, type) => {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${table});`, (err, columns) => {
      if (err) return reject(err);

      const columnExists = columns.some(col => col.name === column);
      if (columnExists) {
        console.log(`Colonne ${column} existe déjà dans ${table}`);
        return resolve();
      }

      db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`, (err) => {
        if (err) return reject(err);
        console.log(`Colonne ${column} ajoutée à ${table}`);
        resolve();
      });
    });
  });
};

// Exécution
const updateSchema = async () => {
  try {
    await addColumnIfNotExists('users', 'firstname', 'TEXT');
    await addColumnIfNotExists('users', 'lastname', 'TEXT');
    await addColumnIfNotExists('deliveries', 'dish_name', 'TEXT');

    console.log('Mise à jour du schéma terminée !');
    db.close();
  } catch (err) {
    console.error('Erreur lors de la mise à jour du schéma :', err.message);
    db.close();
  }
};

updateSchema();
