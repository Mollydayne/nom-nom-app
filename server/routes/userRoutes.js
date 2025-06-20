const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// ============================================
// POST - Enregistrement d'un nouvel utilisateur
// ============================================
router.post('/register', async (req, res) => {
  const { firstname, lastname, email, motDePasse, role, chefId } = req.body;

  console.log(" Données reçues lors de l'inscription :", req.body); // Pour le debug

  if (!firstname || !lastname || !email || !motDePasse || !role) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    // Vérifie si un utilisateur avec cet email existe déjà
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // Création du nom d'utilisateur complet
    const username = `${firstname} ${lastname}`;

    // Insertion dans la base
    const newUser = await pool.query(
      'INSERT INTO users (firstname, lastname, email, password, role, username) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [firstname, lastname, email, hashedPassword, role, username]
    );

    const userId = newUser.rows[0].id;

    // Si c'est un client, on crée aussi une fiche client associée
    if (role === 'client') {
      await pool.query(
        'INSERT INTO clients (firstname, lastname, email, user_id, chef_id) VALUES ($1, $2, $3, $4, $5)',
        [firstname, lastname, email, userId, chefId || null]
      );
    }

    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement :', error.message);
    res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement.' });
  }
});

// ============================================
// POST - Connexion d'un utilisateur
// ============================================
router.post('/login', async (req, res) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Aucun compte trouvé avec cet email.' });
    }

    const match = await bcrypt.compare(motDePasse, user.rows[0].password);
    if (!match) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        role: user.rows[0].role,
        username: user.rows[0].username
      },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.status(200).json({ token, role: user.rows[0].role });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error.message);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
});

// ============================================
// GET - Liste des traiteurs (chefs) pour le signup
// ============================================
router.get('/chefs', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, firstname, lastname FROM users WHERE role = 'traiteur' ORDER BY firstname`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des traiteurs :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
