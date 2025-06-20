// server/db.js
require('dotenv').config();
const { Pool } = require('pg');

// Ajout temporaire pour débug
console.log('🔍 DATABASE_URL =', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // nécessaire sur Railway
  }
});

module.exports = pool;
