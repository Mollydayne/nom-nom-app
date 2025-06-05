const express = require('express');
const router = express.Router();
const db = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ---------------------------
// Route d'inscription
// ---------------------------
router.post('/register', async (req, res) => {
  const { firstname, lastname, email, motDePasse, role, chefId } = req.body;

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
          if (chefId) {
            db.run(
              `INSERT INTO clients (firstName, lastName, email, chef_id, user_id)
               VALUES (?, ?, ?, ?, ?)`,
              [firstname, lastname, normalizedEmail, chefId, newUserId],
              (err) => {
                if (err) {
                  console.error("Erreur création fiche client :", err.message);
                } else {
                  console.log("Fiche client créée et liée au traiteur.");
                }
              }
            );
          } else {
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
                        console.log("Fiche client existante liée.");
                      }
                    }
                  );
                }
              }
            );
          }
        }

        const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, 
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

          // Envoi mail à l’admin pour notification
          const adminMailOptions = {
            from: `"NomNom App" <${process.env.SMTP_USER}>`,
            to: 'nomnom.appli@gmail.com',
            subject: `Nouvelle inscription : ${firstname} ${lastname}`,
            text: `Nouvel utilisateur inscrit :

Nom : ${firstname} ${lastname}
Email : ${normalizedEmail}
Rôle : ${userRole}
${userRole === 'client' && chefId ? `Chef assigné : ID ${chefId}` : ''}
            `
          };

          transporter.sendMail(adminMailOptions, (err) => {
            if (err) {
              console.error("Erreur envoi email à l’admin :", err);
            } else {
              console.log("Notification envoyée à l’admin NomNom.");
            }
          });

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
// Route pour récupérer les traiteurs
// ---------------------------
router.get('/chefs', (req, res) => {
  db.all(`SELECT id, firstname, lastname, email FROM users WHERE role = 'traiteur'`, (err, rows) => {
    if (err) {
      console.error('Erreur récupération traiteurs :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(rows);
  });
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

// ---------------------------
// Route de delete de compte
// ---------------------------

const authenticateToken = require('../middleware/authenticateToken');

router.delete('/me', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.serialize(() => {
    db.run(`DELETE FROM clients WHERE user_id = ?`, [userId], function (err) {
      if (err) {
        console.error("Erreur suppression fiche client :", err.message);
        return res.status(500).json({ error: "Erreur suppression fiche client" });
      }

      db.run(`DELETE FROM users WHERE id = ?`, [userId], function (err) {
        if (err) {
          console.error("Erreur suppression utilisateur :", err.message);
          return res.status(500).json({ error: "Erreur suppression compte utilisateur" });
        }

        res.json({ message: "Compte supprimé avec succès" });
      });
    });
  });
});

module.exports = router;
