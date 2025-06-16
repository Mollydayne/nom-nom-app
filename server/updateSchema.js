// server/updateSchema.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base existante (locale ou Railway)
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

await createTableIfNotExists('deliveries', `
  CREATE TABLE deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    qr_token TEXT,
    client_id INTEGER,
    date TEXT,
    returned BOOLEAN DEFAULT 0,
    paid BOOLEAN DEFAULT 0,
    price INTEGER,
    dish_name TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  )
`);


// Fonction utilitaire pour ajouter une colonne si elle n'existe pas
const addColumnIfNotExists = (table, column, type) => {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${table});`, (err, columns) => {
      if (err) return reject(err);

      const exists = columns.some(col => col.name === column);
      if (exists) {
        console.log(`La colonne "${column}" existe déjà dans "${table}"`);
        return resolve();
      }

      db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`, (err) => {
        if (err) return reject(err);
        console.log(`Colonne "${column}" ajoutée à "${table}"`);
        resolve();
      });
    });
  });
};

// Fonction utilitaire pour créer une table si elle n'existe pas
const createTableIfNotExists = (tableName, createSQL) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName], (err, row) => {
      if (err) return reject(err);

      if (row) {
        console.log(`✔️  La table "${tableName}" existe déjà`);
        return resolve();
      }

      db.run(createSQL, (err) => {
        if (err) return reject(err);
        console.log(`Table "${tableName}" créée`);
        resolve();
      });
    });
  });
};

// Exécution du script
const runMigrations = async () => {
  try {
    await addColumnIfNotExists('users', 'firstname', 'TEXT');
    await addColumnIfNotExists('users', 'lastname', 'TEXT');
    await addColumnIfNotExists('deliveries', 'dish_name', 'TEXT');

    await createTableIfNotExists('preferences', `
      CREATE TABLE preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        dish_name TEXT NOT NULL,
        liked BOOLEAN NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);

    console.log('Mise à jour du schéma terminée avec succès');
  } catch (err) {
    console.error(' Erreur lors de la mise à jour du schéma :', err.message);
  } finally {
    db.close();
  }
};

runMigrations();
