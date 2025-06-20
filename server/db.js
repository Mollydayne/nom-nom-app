// server/db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // 
  ssl: {
    rejectUnauthorized: false // nécessaire sur Railway
  }
});

module.exports = pool;
