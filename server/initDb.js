// server/initDb.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // correction ici
  ssl: { rejectUnauthorized: false }
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'client',
        reset_token TEXT,
        reset_expires BIGINT,
        firstname TEXT,
        lastname TEXT
      );

      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT,
        allergies TEXT,
        likes TEXT,
        chef_id INTEGER,
        user_id INTEGER,
        FOREIGN KEY (chef_id) REFERENCES users(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS deliveries (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        date DATE NOT NULL,
        returned BOOLEAN DEFAULT FALSE,
        paid BOOLEAN DEFAULT FALSE,
        price NUMERIC,
        qr_token TEXT,
        box_id INTEGER,
        dish_name TEXT,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (sender_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS preferences (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL,
        dish_name TEXT NOT NULL,
        liked BOOLEAN,
        FOREIGN KEY (client_id) REFERENCES clients(id)
      );

      CREATE TABLE IF NOT EXISTS preference_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        item TEXT NOT NULL,
        type TEXT CHECK(type IN ('liked', 'disliked')) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    console.log("Toutes les tables ont été créées avec succès !");
  } catch (err) {
    console.error("Erreur lors de la création des tables :", err.message);
  } finally {
    await pool.end();
  }
};

initDb();
