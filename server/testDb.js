// server/testDb.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Connexion réussie à PostgreSQL :', result.rows[0]);
  } catch (error) {
    console.error('Erreur de connexion à PostgreSQL :', error);
  } finally {
    await pool.end();
  }
}

testConnection();
