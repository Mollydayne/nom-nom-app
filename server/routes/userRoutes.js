const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // passage à PostgreSQL

// ===============================
// POST - Inscription
// ===============================
router.post('/register', async (req, res) => {
  const { prenom, nom, email, motDePasse, role, chefId } = req.body;

  if (!prenom || !nom || !email || !motDePasse || !role) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    // Vérifie si un utilisateur existe déjà
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "Un compte existe déjà avec cet email" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    //  Insertion dans users avec RETURNING id
    const insertUser = await pool.query(
      `INSERT INTO users (username, email, password, role, firstname, lastname)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [`${prenom} ${nom}`, normalizedEmail, hashedPassword, role, prenom, nom]
    );

    const newUserId = insertUser.rows[0].id;

    // Si c’est un client, on crée ou met à jour sa fiche client
    if (role === 'client') {
      if (chefId) {
        // Cas 1 : client lié directement à un traiteur
        await pool.query(
          `INSERT INTO clients (firstName, lastName, email, chef_id, user_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [prenom, nom, normalizedEmail, chefId, newUserId]
        );
        console.log("Fiche client créée et liée au traiteur.");
      } else {
        // Cas 2 : client seul → cherche s’il existe déjà une fiche
        const clientRow = await pool.query(
          `SELECT id FROM clients WHERE email = $1 AND user_id IS NULL`,
          [normalizedEmail]
        );

        if (clientRow.rows.length > 0) {
          // Mise à jour de fiche existante
          await pool.query(
            `UPDATE clients SET user_id = $1 WHERE id = $2`,
            [newUserId, clientRow.rows[0].id]
          );
          console.log("Fiche client existante liée.");
        } else {
          // Création automatique d’une nouvelle fiche
          await pool.query(
            `INSERT INTO clients (firstName, lastName, email, user_id)
             VALUES ($1, $2, $3, $4)`,
            [prenom, nom, normalizedEmail, newUserId]
          );
          console.log("Fiche client créée automatiquement à l'inscription.");
        }
      }
    }

    return res.status(201).json({ message: "Inscription réussie", userId: newUserId });

  } catch (err) {
    console.error("Erreur lors de l'inscription :", err.message);
    return res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

// ===============================
// POST - Connexion
// ===============================
router.post('/login', async (req, res) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    // Récupération utilisateur
    const userRes = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [normalizedEmail]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: "Aucun compte trouvé avec cet email" });
    }

    const user = userRes.rows[0];

    // Vérifie le mot de passe
    const validPassword = await bcrypt.compare(motDePasse, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Génère le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: "Connexion réussie, bravo!",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });

  } catch (err) {
    console.error("Erreur recherche utilisateur :", err.message);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
