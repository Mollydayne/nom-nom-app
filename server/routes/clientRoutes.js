const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authenticateToken = require('../middleware/authenticateToken');
const nodemailer = require('nodemailer'); // ajout requis pour envoyer des emails

// =======================
// GET - Dashboard client
// =======================
router.get('/client-dashboard', authenticateToken, (req, res) => {
  const clientId = req.user.id;

  const query = `
    SELECT
      COUNT(*) AS total_delivered,
      SUM(CASE WHEN returned = 0 THEN 1 ELSE 0 END) AS pending_returns,
      SUM(CASE WHEN paid = 0 THEN price ELSE 0 END) AS unpaid_amount
    FROM deliveries
    WHERE client_id = ?
  `;

  db.get(query, [clientId], (err, row) => {
    if (err) {
      console.error("Erreur SQL :", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// =======================
// GET - Tous les clients du traiteur connecté
// =======================
router.get('/', authenticateToken, (req, res) => {
  const chefId = req.user.id;

  db.all(`SELECT * FROM clients WHERE chef_id = ?`, [chefId], (err, rows) => {
    if (err) {
      console.error("Erreur récupération clients :", err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(rows);
  });
});

// =======================
// GET - Un client par ID (vérifie chef_id)
// =======================
router.get('/:id', authenticateToken, (req, res) => {
  const clientId = req.params.id;
  const chefId = req.user.id;

  db.get(`SELECT * FROM clients WHERE id = ? AND chef_id = ?`, [clientId, chefId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Client not found or unauthorized' });

    res.json(row);
  });
});

// =======================
// POST - Ajouter un client
// =======================
router.post('/', authenticateToken, (req, res) => {
  const { firstName, lastName, email, allergies, likes } = req.body;
  const chefId = req.user.id;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  db.get(
    `SELECT * FROM clients 
     WHERE ((firstName = ? AND lastName = ?) OR (email = ? AND email IS NOT NULL))
     AND chef_id = ?`,
    [firstName, lastName, email, chefId],
    (err, existingClient) => {
      if (err) {
        console.error('Erreur vérification client :', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingClient) {
        return res.status(400).json({ error: 'Client already exists for this chef' });
      }

      db.run(
        `INSERT INTO clients (firstName, lastName, email, allergies, likes, chef_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [firstName, lastName, email || null, allergies, likes, chefId],
        function (err) {
          if (err) {
            console.error('Erreur ajout client :', err.message);
            return res.status(500).json({ error: 'Failed to add client' });
          }

          const clientId = this.lastID;

          // Si un email a été renseigné, on envoie un email d'invitation
          if (email) {
            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: process.env.SMTP_PORT,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
            });

            // Préparation de l'URL avec pré-remplissage de l'email
            const signupUrl = `${process.env.FRONTEND_URL}/signup?email=${encodeURIComponent(email)}`;

            const htmlContent = `
              <div style="font-family: 'Helvetica Neue', sans-serif; background-color: #fff7e6; color: #5a3a00; padding: 2rem;">
                <div style="max-width: 600px; margin: auto; border: 1px solid #ffd29d; border-radius: 12px; padding: 2rem; background-color: #fff;">
                  <h2 style="color: #a41623;">Ton traiteur t’a ajouté sur NomNom</h2>
                  <p>Bonjour ${firstName || ''},</p>
                  <p>Tu as été ajouté comme client sur l’application NomNom. Pour pouvoir accéder à ton espace personnel, consulter tes livraisons et régler tes commandes, il te suffit de créer ton compte.</p>
                  <div style="text-align: center; margin: 2rem 0;">
                    <a href="${signupUrl}" style="background-color: #f85e00; color: white; text-decoration: none; padding: 0.8rem 1.5rem; border-radius: 25px; display: inline-block;">
                      Créer mon compte
                    </a>
                  </div>
                  <p style="font-size: 0.9rem; color: #918450;">
                    Utilise l’adresse email suivante : <strong>${email}</strong><br />
                    Elle te permettra d’accéder à ta fiche client dès l’inscription.
                  </p>
                </div>
              </div>
            `;

            const mailOptions = {
              from: `"NomNom App" <${process.env.SMTP_USER}>`,
              to: email,
              subject: "Bienvenue sur NomNom - Crée ton compte",
              html: htmlContent,
            };

            transporter.sendMail(mailOptions, (err) => {
              if (err) {
                console.error("Erreur envoi email d'invitation client :", err);
              } else {
                console.log(`Invitation envoyée à ${email}`);
              }

              // Envoi de la réponse même si l'email échoue
              return res.status(201).json({ message: 'Client added', id: clientId });
            });
          } else {
            // Aucun email fourni, on envoie directement la réponse
            return res.status(201).json({ message: 'Client added', id: clientId });
          }
        }
      );
    }
  );
});

// =======================
// PUT - Modifier un client (vérifie chef_id)
// =======================
router.put('/:id', authenticateToken, (req, res) => {
  const clientId = req.params.id;
  const chefId = req.user.id;
  const { firstName, lastName, email, allergies, likes } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  db.get(`SELECT * FROM clients WHERE id = ? AND chef_id = ?`, [clientId, chefId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Client not found or unauthorized' });

    db.run(
      `UPDATE clients
       SET firstName = ?, lastName = ?, email = ?, allergies = ?, likes = ?
       WHERE id = ?`,
      [firstName, lastName, email || null, allergies, likes, clientId],
      function (err) {
        if (err) {
          console.error('Erreur modification client :', err.message);
          return res.status(500).json({ error: 'Failed to update client' });
        }

        res.json({ message: 'Client updated' });
      }
    );
  });
});

// =======================
// DELETE - Supprimer un client (vérifie chef_id)
// =======================
router.delete('/:id', authenticateToken, (req, res) => {
  const clientId = req.params.id;
  const chefId = req.user.id;

  db.get(`SELECT * FROM clients WHERE id = ? AND chef_id = ?`, [clientId, chefId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Client not found or unauthorized' });

    db.run(`DELETE FROM clients WHERE id = ?`, [clientId], function (err) {
      if (err) {
        console.error('Erreur suppression client :', err.message);
        return res.status(500).json({ error: 'Failed to delete client' });
      }

      res.json({ message: 'Client deleted' });
    });
  });
});

module.exports = router;
