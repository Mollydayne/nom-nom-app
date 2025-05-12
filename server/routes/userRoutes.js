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
  const { username, email, password, role } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: 'Missing fields' });

  const normalizedEmail = email.toLowerCase();
  const userRole = role === 'traiteur' ? 'traiteur' : 'client'; // sécurité : empêche des rôles bidons

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
      [username, normalizedEmail, hashedPassword, userRole],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Envoi de l'e-mail de bienvenue
        const transporter = require('nodemailer').createTransport({
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
              <h2 style="color: #a41623;">Bienvenue chez NomNom !</h2>
              <p>Bonjour ${username},</p>
              <p>Merci de rejoindre la communauté NomNom en tant que <strong>${userRole}</strong> !</p>
              <p>Depuis votre profil, vous pourrez suivre vos commandes, paiements, ou organiser vos livraisons si vous êtes traiteur.</p>
              <hr style="margin: 2rem 0;" />
              <p style="font-size: 0.9rem; color: #918450;">
                🍽 NomNom Central Kitchen<br />
                À très vite autour d'une bonne gamelle ❤
              </p>
            </div>
          </div>
        `;

        const mailOptions = {
          from: `"NomNom App" <${process.env.SMTP_USER}>`,
          to: normalizedEmail,
          subject: "Bienvenue chez NomNom !",
          html: htmlWelcome,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Erreur lors de l'envoi de l'email de bienvenue :", err);
          }

          res.status(201).json({
            message: 'User registered successfully',
            userId: this.lastID,
            role: userRole,
          });
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Error hashing password' });
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

      const { password: _, ...userData } = user;

      res.json({
        message: 'Login successful',
        token,
        user: userData,
      });
    } catch (err) {
      res.status(500).json({ error: 'Login failed' });
    }
  });
});

// ---------------------------
// Route : demande de réinitialisation de mot de passe
// ---------------------------
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email requis" });

  const normalizedEmail = email.toLowerCase();

  db.get(`SELECT * FROM users WHERE email = ?`, [normalizedEmail], (err, user) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });

    // Toujours répondre positivement pour ne pas révéler si l'utilisateur existe
    if (!user) {
      return res.json({ message: "Si cet email est connu, un lien a été envoyé." });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1h

    db.run(
      `UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?`,
      [token, expires, user.id],
      (err) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });

        // Préparation de l'e-mail HTML
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        const htmlContent = `
          <div style="font-family: 'Helvetica Neue', sans-serif; background-color: #fff7e6; color: #5a3a00; padding: 2rem;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #ffd29d; border-radius: 12px; padding: 2rem; background-color: #fff;">
              <h2 style="color: #a41623;">NomNom - Réinitialisation de mot de passe</h2>
              <p>Bonjour,</p>
              <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous :</p>
              <div style="text-align: center; margin: 2rem 0;">
                <a href="${resetUrl}" style="background-color: #f85e00; color: white; text-decoration: none; padding: 0.8rem 1.5rem; border-radius: 25px; display: inline-block;">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              <p>Ce lien expirera dans une heure.</p>
              <hr style="margin: 2rem 0;" />
              <p style="font-size: 0.9rem; color: #918450;">
                🍽 NomNom Central Kitchen<br />
                Merci de faire partie de notre aventure culinaire ❤
              </p>
            </div>
          </div>
        `;

        // Configuration du transporteur nodemailer
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: `"NomNom App" <${process.env.SMTP_USER}>`,
          to: normalizedEmail,
          subject: "Réinitialisation de mot de passe",
          html: htmlContent,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error('Erreur envoi email :', err);
            return res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
          }

          res.json({ message: "Un lien de réinitialisation a été envoyé à votre adresse email." });
        });
      }
    );
  });
});

// ---------------------------
// Route : soumission du nouveau mot de passe
// ---------------------------
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) return res.status(400).json({ message: "Mot de passe requis" });

  db.get(
    `SELECT * FROM users WHERE reset_token = ? AND reset_expires > ?`,
    [token, Date.now()],
    async (err, user) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      if (!user) return res.status(400).json({ message: "Lien invalide ou expiré" });

      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.run(
          `UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?`,
          [hashedPassword, user.id],
          (err) => {
            if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour" });

            res.json({ message: "Mot de passe mis à jour avec succès" });
          }
        );
      } catch (err) {
        res.status(500).json({ message: "Erreur de hachage" });
      }
    }
  );
});

// ---------------------------
// Route : email de livraison
// ---------------------------
router.post('/send-delivery-recap', (req, res) => {
  const { clientEmail, clientName, quantity, date } = req.body;

  if (!clientEmail || !clientName || !quantity || !date) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const htmlRecap = `
    <div style="font-family: 'Helvetica Neue', sans-serif; background-color: #fff7e6; color: #5a3a00; padding: 2rem;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #ffd29d; border-radius: 12px; padding: 2rem; background-color: #fff;">
        <h2 style="color: #a41623;">NomNom - Livraison du ${date}</h2>
        <p>Bonjour ${clientName},</p>
        <p>Nous avons bien enregistré la livraison de <strong>${quantity} gamelle${quantity > 1 ? 's' : ''}</strong> ce jour-là.</p>
        <p>Merci pour ta fidélité et bon appétit !</p>
        <hr style="margin: 2rem 0;" />
        <p style="font-size: 0.9rem; color: #918450;">
          🍽 NomNom Central Kitchen<br />
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"NomNom App" <${process.env.SMTP_USER}>`,
    to: clientEmail,
    subject: `Votre livraison du ${date}`,
    html: htmlRecap,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Erreur envoi mail récap livraison :", err);
      return res.status(500).json({ message: "Erreur lors de l'envoi du mail" });
    }

    res.json({ message: "Email de livraison envoyé avec succès" });
  });
});

module.exports = router;
