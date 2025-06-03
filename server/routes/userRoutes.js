const express = require('express');
const router = express.Router();
const db = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ---------------------------
// Route d'inscription avec liaison à une fiche client existante
// ---------------------------
router.post('/register', async (req, res) => {
  const { firstname, lastname, email, motDePasse, role } = req.body;

  if (!firstname || !lastname || !email || !motDePasse)
    return res.status(400).json({ error: 'Champs requis manquants' });

  const normalizedEmail = email.toLowerCase();
  const username = `${firstname.trim()} ${lastname.trim()}`;
  const userRole = role === 'traiteur' ? 'traiteur' : 'client';

  try {
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    db.run(
      `INSERT INTO users (username, firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [username, firstname, lastname, normalizedEmail, hashedPassword, userRole],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const newUserId = this.lastID;

        if (userRole === 'client') {
          db.get(
            `SELECT id FROM clients WHERE email = ? AND user_id IS NULL`,
            [normalizedEmail],
            (err, clientRow) => {
              if (err) {
                console.error("Erreur recherche fiche client :", err.message);
              } else if (clientRow) {
                db.run(
                  `UPDATE clients SET user_id = ? WHERE id = ?`,
                  [newUserId, clientRow.id],
                  (err) => {
                    if (err) {
                      console.error("Erreur liaison user/client :", err.message);
                    } else {
                      console.log("Fiche client liée à l'utilisateur.");
                    }
                  }
                );
              }
            }
          );
        }

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const htmlWelcome = `
          <div style="font-family: 'Helvetica Neue', sans-serif; background-color: #fff7e6; color: #5a3a00; padding: 2rem;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #ffd29d; border-radius: 12px; padding: 2rem; background-color: #fff;">
              <h2 style="color: #a41623;">Bienvenue chez NomNom</h2>
              <p>Bonjour ${firstname},</p>
              <p>Merci de rejoindre la communauté NomNom en tant que <strong>${userRole}</strong> !</p>
              <p>Depuis votre profil, vous pourrez suivre vos commandes, paiements, ou organiser vos livraisons si vous êtes traiteur.</p>
              <hr style="margin: 2rem 0;" />
              <p style="font-size: 0.9rem; color: #918450;">
                NomNom Central Kitchen<br />
                À très vite autour d'une bonne gamelle
              </p>
            </div>
          </div>
        `;

        const mailOptions = {
          from: `"NomNom App" <${process.env.SMTP_USER}>`,
          to: normalizedEmail,
          subject: "Bienvenue chez NomNom",
          html: htmlWelcome,
        };

        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            console.error("Erreur envoi email de bienvenue :", err);
          }

          res.status(201).json({
            message: 'Utilisateur inscrit avec succès',
            userId: newUserId,
            role: userRole,
          });
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du traitement du mot de passe' });
  }
});

// ---------------------------
// Route de connexion
// ---------------------------
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  const normalizedEmail = email.toLowerCase();

  db.get(`SELECT * FROM users WHERE email = ?`, [normalizedEmail], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: 'Invalid password' });

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '2d' }
      );

      res.json({
        message: 'Login successful',
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
      res.status(500).json({ error: 'Login failed' });
    }
  });
});

module.exports = router;
