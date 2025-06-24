const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adapté pour PostgreSQL
const authenticateToken = require('../middleware/authenticateToken');
const nodemailer = require('nodemailer'); // ajout requis pour envoyer des emails

// =======================
// GET - Dashboard client avec prénom + préférences
// =======================
router.get('/client-dashboard', authenticateToken, async (req, res) => {
  const userEmail = req.user.email;

  try {
    // Étape 1 : récupération de la fiche client (attention à la casse sur firstname)
    const clientRes = await pool.query(
      `SELECT id, firstname FROM clients WHERE email = $1`,
      [userEmail]
    );

    if (clientRes.rows.length === 0) {
      return res.status(404).json({ error: "Fiche client introuvable pour cet utilisateur" });
    }

    const client = clientRes.rows[0];
    const clientId = client.id;

    // Étape 2 : statistiques du dashboard
    const dashboardRes = await pool.query(
      `
      SELECT
        COUNT(*) AS total_delivered,
        SUM(CASE WHEN returned = false THEN 1 ELSE 0 END) AS pending_returns,
        SUM(CASE WHEN paid = false THEN price ELSE 0 END) AS unpaid_amount
      FROM deliveries
      WHERE client_id = $1
      `,
      [clientId]
    );

    // Étape 3 : préférences liées aux plats
    const preferencesRes = await pool.query(
      `
      SELECT
        d.dish_name,
        p.id AS preference_id,
        p.liked
      FROM deliveries d
      LEFT JOIN preferences p
        ON d.client_id = p.client_id AND d.dish_name = p.dish_name
      WHERE d.client_id = $1
      GROUP BY d.dish_name, p.id, p.liked
      `,
      [clientId]
    );

    // Étape 4 : réponse globale
    res.json({
      firstName: client.firstname,
      preferences: preferencesRes.rows || [],
      ...dashboardRes.rows[0]
    });

  } catch (err) {
    console.error("Erreur SQL (dashboard) :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// =======================
// Connexion fiche client
// =======================
router.get('/me', authenticateToken, async (req, res) => {
  const userEmail = req.user.email;

  try {
    const result = await pool.query(`SELECT * FROM clients WHERE email = $1`, [userEmail]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Client non trouvé avec cet email" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur récupération client (par email) :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// =======================
// GET - Un client par ID (vérifie chef_id + ajoute statistiques)
// =======================
router.get('/:id', authenticateToken, async (req, res) => {
  const clientId = req.params.id;
  const chefId = req.user.id;

  try {
    // Vérifie que ce client appartient bien à ce traiteur
    const clientResult = await pool.query(
      `SELECT id, firstname, lastname, email, allergies, likes FROM clients
       WHERE id = $1 AND chef_id = $2`,
      [clientId, chefId]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found or unauthorized' });
    }

    const client = clientResult.rows[0];

    // Récupère le nombre de gamelles en attente de retour
    const boxRes = await pool.query(
      'SELECT COUNT(*) FROM deliveries WHERE client_id = $1 AND returned = false',
      [clientId]
    );

    // Récupère le montant total non payé
    const amountRes = await pool.query(
      'SELECT COALESCE(SUM(price), 0) FROM deliveries WHERE client_id = $1 AND paid = false',
      [clientId]
    );

    // Nombre total de livraisons
    const totalRes = await pool.query(
      'SELECT COUNT(*) FROM deliveries WHERE client_id = $1',
      [clientId]
    );

    // Réponse enrichie
    res.json({
      ...client,
      box_owed: parseInt(boxRes.rows[0].count, 10),
      amount_due: parseFloat(amountRes.rows[0].coalesce),
      total_deliveries: parseInt(totalRes.rows[0].count, 10),
    });
  } catch (err) {
    console.error('Erreur GET /clients/:id :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// =======================
// POST - Ajouter un client
// =======================
router.post('/', authenticateToken, async (req, res) => {
  const { firstName, lastName, email, allergies, likes } = req.body;
  const chefId = req.user.id;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  try {
    // Vérification existence client
    const existingRes = await pool.query(
      `SELECT * FROM clients
       WHERE ((firstName = $1 AND lastName = $2) OR (email = $3 AND email IS NOT NULL))
       AND chef_id = $4`,
      [firstName, lastName, email, chefId]
    );

    if (existingRes.rows.length > 0) {
      return res.status(400).json({ error: 'Client already exists for this chef' });
    }

    // Insertion du nouveau client (avec RETURNING id)
    const insertRes = await pool.query(
      `INSERT INTO clients (firstName, lastName, email, allergies, likes, chef_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [firstName, lastName, email || null, allergies, likes, chefId]
    );

    const clientId = insertRes.rows[0].id;

    // Envoi de l'email d'invitation si email fourni
    if (email) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const signupUrl = `${process.env.FRONTEND_URL}/signup?email=${encodeURIComponent(email)}`;

      const htmlContent = `... même contenu email ...`;

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

        return res.status(201).json({ message: 'Client added', id: clientId });
      });
    } else {
      return res.status(201).json({ message: 'Client added', id: clientId });
    }

  } catch (err) {
    console.error("Erreur ajout client :", err.message);
    res.status(500).json({ error: 'Failed to add client' });
  }
});

// =======================
// PUT - Modifier un client (vérifie chef_id)
// =======================
router.put('/:id', authenticateToken, async (req, res) => {
  const clientId = req.params.id;
  const chefId = req.user.id;
  const { firstName, lastName, email, allergies, likes } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  try {
    const checkRes = await pool.query(
      `SELECT * FROM clients WHERE id = $1 AND chef_id = $2`,
      [clientId, chefId]
    );

    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found or unauthorized' });
    }

    await pool.query(
      `UPDATE clients
       SET firstName = $1, lastName = $2, email = $3, allergies = $4, likes = $5
       WHERE id = $6`,
      [firstName, lastName, email || null, allergies, likes, clientId]
    );

    res.json({ message: 'Client updated' });

  } catch (err) {
    console.error("Erreur modification client :", err.message);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// =======================
// DELETE - Supprimer un client (vérifie chef_id)
// =======================
router.delete('/:id', authenticateToken, async (req, res) => {
  const clientId = req.params.id;
  const chefId = req.user.id;

  try {
    const checkRes = await pool.query(
      `SELECT * FROM clients WHERE id = $1 AND chef_id = $2`,
      [clientId, chefId]
    );

    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found or unauthorized' });
    }

    await pool.query(
      `DELETE FROM clients WHERE id = $1`,
      [clientId]
    );

    res.json({ message: 'Client deleted' });

  } catch (err) {
    console.error("Erreur suppression client :", err.message);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// =======================
// GET - Tous les clients du traiteur connecté
// =======================
router.get('/', authenticateToken, async (req, res) => {
  const chefId = req.user.id;

  try {
    const result = await pool.query(`SELECT * FROM clients WHERE chef_id = $1`, [chefId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur récupération clients :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
