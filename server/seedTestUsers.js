// server/seedTestUsers.js
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  try {
    const passwordHash = await bcrypt.hash('test1234', 10);

    const users = [
      { username: 'alice', email: 'alice@example.com', password: passwordHash, role: 'chef' },
      { username: 'bob', email: 'bob@example.com', password: passwordHash, role: 'client' }
    ];

    for (const user of users) {
      await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
        [user.username, user.email, user.password, user.role]
      );
    }

    console.log('Données de test insérées');
  } catch (err) {
    console.error('Erreur lors de l’insertion des données :', err);
  } finally {
    await pool.end();
  }
}

seed();
