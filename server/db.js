// server/db.js

// En environnement local, on charge les variables d'environnement depuis le fichier .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// On importe le module pg pour se connecter à PostgreSQL
const { Pool } = require('pg');

// Affichage de la variable DATABASE_URL pour vérification (en dev uniquement)
console.log('🔍 DATABASE_URL =', process.env.DATABASE_URL);

// Si la variable est absente, on arrête le backend avec un message d’erreur clair
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL est absente. Vérifie qu’elle est bien définie dans Railway ou dans le fichier .env');
  process.exit(1);
}

// Création de la connexion PostgreSQL via un pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // nécessaire pour Railway
  }
});

// On exporte le pool pour l’utiliser dans toutes les routes
module.exports = pool;
