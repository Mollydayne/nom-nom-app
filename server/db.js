// server/db.js
const { Pool } = require('pg');

// 🔍 Debug : affiche la variable DATABASE_URL en prod
console.log('🔍 DATABASE_URL =', process.env.DATABASE_URL);

// Stoppe le backend si DATABASE_URL est absente
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is undefined. Make sure it is set in Railway.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // nécessaire pour Railway
  }
});

module.exports = pool;
