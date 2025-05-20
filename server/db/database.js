const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données SQLite située dans le même dossier
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

// Création automatique des tables à l'ouverture de l'application
db.serialize(() => {
  // Table des utilisateurs (clients et traiteurs)
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

  // Table des clients (informations personnalisées)
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT,
      allergies TEXT,
      likes TEXT,
      chef_id INTEGER,                             -- lien avec le traiteur
      FOREIGN KEY (chef_id) REFERENCES users(id)   -- clé étrangère
    )
  `);

  // Table des livraisons de gamelles
  db.run(`
    CREATE TABLE IF NOT EXISTS deliveries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      sender_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      date TEXT NOT NULL,
      returned INTEGER DEFAULT 0,
      paid INTEGER DEFAULT 0,
      price REAL,
      qr_token TEXT,
      box_id INTEGER,
      FOREIGN KEY (client_id) REFERENCES users(id),
      FOREIGN KEY (sender_id) REFERENCES users(id)
    )
  `);

  // Table des préférences (aime / n’aime pas, plat par plat)
  db.run(`
    CREATE TABLE IF NOT EXISTS preference_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,         -- identifiant de l’utilisateur concerné
      item TEXT NOT NULL,               -- nom du plat ou ingrédient
      type TEXT CHECK(type IN ('liked', 'disliked')) NOT NULL, -- type de préférence
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;
