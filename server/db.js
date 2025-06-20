// server/db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // à définir dans le .env
  ssl: {
    rejectUnauthorized: false // nécessaire sur Railway
  }
});

module.exports = pool;
