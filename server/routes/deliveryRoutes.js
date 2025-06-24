const express = require('express');
const router = express.Router();
const pool = require('../db'); // Connexion PostgreSQL
const authenticateToken = require('../middleware/authenticateToken');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// ================================
// Route : créer une nouvelle livraison (QR unique)
// ================================
router.post('/', authenticateToken, async (req, res) => {
  const { client_id, quantity, date, dish_name } = req.body;
  const sender_id = req.user.id;

  if (!client_id || !quantity || !date) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const unitPrice = 8.0;
  const totalPrice = quantity * unitPrice;

  // Génère un token unique pour cette livraison
  const qr_token = uuidv4();
  const qrDir = path.join(__dirname, '../qrcodes');
  const qrPath = path.join(qrDir, `${qr_token}.png`);
  const qrData = `https://www.nom-nom.app/qr/${qr_token}`; // lien scanné

  try {
    // Crée le dossier /qrcodes si nécessaire
    fs.mkdirSync(qrDir, { recursive: true });

    // Génère l’image PNG du QR code
    await QRCode.toFile(qrPath, qrData);

    // Insère la nouvelle livraison en base
    const result = await pool.query(
      `INSERT INTO deliveries (client_id, sender_id, quantity, date, returned, paid, price, qr_token, dish_name)
       VALUES ($1, $2, $3, $4, false, false, $5, $6, $7)
       RETURNING id`,
      [client_id, sender_id, quantity, date, totalPrice, qr_token, dish_name]
    );

    const deliveryId = result.rows[0].id;

    // Vérifie si une préférence pour ce plat existe déjà
    const prefCheck = await pool.query(
      `SELECT * FROM preferences WHERE client_id = $1 AND dish_name = $2`,
      [client_id, dish_name]
    );

    if (prefCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO preferences (client_id, dish_name, liked) VALUES ($1, $2, NULL)`,
        [client_id, dish_name]
      );
    }

    // Envoie la réponse avec l’URL du QR code
    res.status(201).json({
      message: 'Livraison enregistrée avec QR code unique',
      deliveryId,
      qr_token,
      qr_url: qrData,
      qr_image_url: `https://www.nom-nom.app/qrcodes/${qr_token}.png`
    });

  } catch (err) {
    console.error('Erreur ajout livraison :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ================================
// Route : historique des livraisons
// ================================
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT deliveries.date, deliveries.dish_name, deliveries.qr_token,
             COALESCE(clients.firstname, 'Utilisateur inconnu') AS prenom,
             COALESCE(clients.lastname, '') AS nom
      FROM deliveries
      LEFT JOIN clients ON deliveries.client_id = clients.id
      ORDER BY deliveries.date DESC
    `);

    const formatted = result.rows.map(row => ({
      date: row.date,
      dish_name: row.dish_name,
      qr_token: row.qr_token,
      client: `${row.prenom} ${row.nom}`.trim()
    }));

    res.json(formatted);

  } catch (err) {
    console.error('Erreur récupération historique :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
