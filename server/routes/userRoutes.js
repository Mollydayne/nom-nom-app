const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

// ===============================
// POST - Inscription
// ===============================
router.post('/register', async (req, res) => {
  const { prenom, nom, email, motDePasse, role, chefId } = req.body;

  if (!prenom || !nom || !email || !motDePasse || !role) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  const normalizedEmail = email.toLowerCase();

  // check si l'utilisateur existe déjà
  db.get(`SELECT * FROM users WHERE email = ?`, [normalizedEmail], async (err, existingUser) => {
    if (err) {
      console.error("Erreur vérification utilisateur :", err.message);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (existingUser) {
      return res.status(409).json({ error: "Un compte existe déjà avec cet email" });
    }

    // On hash le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // Insertion dans la table users
    db.run(
      `INSERT INTO users (username, email, password, role, firstname, lastname)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`${prenom} ${nom}`, normalizedEmail, hashedPassword, role, prenom, nom],
      function (err) {
        if (err) {
          console.error("Erreur lors de l'inscription :", err.message);
          return res.status(500).json({ error: "Erreur lors de l'inscription" });
        }

        const newUserId = this.lastID;

        // Si l'utilisateur est un client, on crée sa fiche client correspondante
        if (role === 'client') {
          if (chefId) {
            // Cas où le client est associé à un traiteur dès l'inscription
            db.run(
              `INSERT INTO clients (firstName, lastName, email, chef_id, user_id)
               VALUES (?, ?, ?, ?, ?)`,
              [prenom, nom, normalizedEmail, chefId, newUserId],
              (err) => {
                if (err) {
                  console.error("Erreur création fiche client :", err.message);
                } else {
                  console.log("Fiche client créée et liée au traiteur.");
                }
              }
            );
          } else {
            // Cas où aucune fiche client n'existe → on en crée une automatiquement
            db.get(
              `SELECT id FROM clients WHERE email = ? AND user_id IS NULL`,
              [normalizedEmail],
              (err, clientRow) => {
                if (err) {
                  console.error("Erreur recherche fiche client :", err.message);
                } else if (clientRow) {
                  // Si une fiche client existe mais sans user_id, on la lie
                  db.run(
                    `UPDATE clients SET user_id = ? WHERE id = ?`,
                    [newUserId, clientRow.id],
                    (err) => {
                      if (err) {
                        console.error("Erreur liaison user/client :", err.message);
                      } else {
                        console.log("Fiche client existante liée.");
                      }
                    }
                  );
                } else {
                  // Sinon, on crée une nouvelle fiche client
                  db.run(
                    `INSERT INTO clients (firstName, lastName, email, user_id)
                     VALUES (?, ?, ?, ?)`,
                    [prenom, nom, normalizedEmail, newUserId],
                    (err) => {
                      if (err) {
                        console.error("Erreur création fiche client automatique :", err.message);
                      } else {
                        console.log("Fiche client créée automatiquement à l'inscription.");
                      }
                    }
                  );
                }
              }
            );
          }
        }

        return res.status(201).json({ message: "Inscription réussie", userId: newUserId });
      }
    );
  });
});

// ===============================
// POST - Connexion
// ===============================
router.post('/login', (req, res) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const normalizedEmail = email.toLowerCase();

  db.get(`SELECT * FROM users WHERE email = ?`, [normalizedEmail], async (err, user) => {
    if (err) {
      console.error("Erreur recherche utilisateur :", err.message);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (!user) {
      return res.status(401).json({ error: "Aucun compte trouvé avec cet email" });
    }

    const validPassword = await bcrypt.compare(motDePasse, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

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
  });
});

module.exports = router;
