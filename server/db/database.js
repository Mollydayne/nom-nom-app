const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données SQLite dans le dossier actuel
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
      reset_expires INTEGER,
      firstname TEXT,
      lastname TEXT
    )
  `);

  // Table des clients
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT,
      allergies TEXT,
      likes TEXT,
      chef_id INTEGER,
      FOREIGN KEY (chef_id) REFERENCES users(id)
    )
  `);

  // Table des livraisons
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
      dish_name TEXT,
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (sender_id) REFERENCES users(id)
    )
  `);

  // Table des préférences simples liées aux livraisons
  db.run(`
    CREATE TABLE IF NOT EXISTS preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      dish_name TEXT NOT NULL,
      liked INTEGER,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `);

  // Table des préférences générales utilisateur (non utilisées actuellement)
  db.run(`
    CREATE TABLE IF NOT EXISTS preference_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item TEXT NOT NULL,
      type TEXT CHECK(type IN ('liked', 'disliked')) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;
