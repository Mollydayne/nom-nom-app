const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la bonne base de données
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

// Création automatique des tables si elles n'existent pas
db.serialize(() => {
  // Table users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Table clients
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT,
      allergies TEXT,
      likes TEXT
    )
  `);
});

module.exports = db;
