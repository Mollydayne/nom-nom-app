const express = require('express');
const router = express.Router();
const pool = require('../db'); // ✅ PostgreSQL
const authenticateToken = require('../middleware/authenticateToken');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// ================================
// Route : ajouter une livraison
// ================================
router.post('/', authenticateToken, async (req, res) => {
  console.log(' BODY reçu :', req.body);

  const { client_id, quantity, date, reuse_qr_token, dish_name } = req.body;
  const sender_id = req.user.id;

  console.log('  Vérification des champs requis :');
  console.log('  client_id =', client_id);
  console.log('  quantity  =', quantity);
  console.log('  date      =', date);

  if (!client_id || !quantity || !date) {
    console.log('Champs requis manquants → 400');
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const unitPrice = 8.0;
  const totalPrice = quantity * unitPrice;
  const qr_token = reuse_qr_token || uuidv4();
  const qrDir = path.join(__dirname, '../qrcodes');
  const qrPath = path.join(qrDir, `${qr_token}.png`);
  const qrData = `http://localhost:3001/api/qr/${qr_token}`;

  // Fonction principale (réutilisation ou après QR généré)
  const proceed = async () => {
    try {
      // INSERT livraison
      const result = await pool.query(
        `INSERT INTO deliveries (client_id, sender_id, quantity, date, returned, paid, price, qr_token, dish_name)
         VALUES ($1, $2, $3, $4, false, false, $5, $6, $7)
         RETURNING id`,
        [client_id, sender_id, quantity, date, totalPrice, qr_token, dish_name]
      );

      const deliveryId = result.rows[0].id;
      console.log('Livraison enregistrée avec ID :', deliveryId);

      // Vérifier s’il existe déjà une préférence pour ce plat
      const prefCheck = await pool.query(
        `SELECT * FROM preferences WHERE client_id = $1 AND dish_name = $2`,
        [client_id, dish_name]
      );

      if (prefCheck.rows.length === 0) {
        // Sinon, l’ajouter avec liked = NULL
        await pool.query(
          `INSERT INTO preferences (client_id, dish_name, liked) VALUES ($1, $2, NULL)`,
          [client_id, dish_name]
        );
      }

      // Envoie la réponse finale
      res.status(201).json({
        message: reuse_qr_token
          ? 'Livraison réutilisant une boîte existante'
          : 'Livraison enregistrée avec QR code',
        deliveryId,
        qr_token,
        qr_url: qrData,
        qr_image_url: `http://localhost:3001/qrcodes/${qr_token}.png`,
      });

    } catch (err) {
      console.error('Erreur ajout livraison :', err.message);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };

  // ====================
  // Si QR déjà existant
  // ====================
  if (reuse_qr_token) {
    console.log('Réutilisation de QR code');
    return proceed();
  }

  // ====================
  // Sinon, on génère une image QR
  // ====================
  fs.mkdir(qrDir, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) {
      console.error('Erreur création dossier QR :', mkdirErr.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    QRCode.toFile(qrPath, qrData, (qrErr) => {
      if (qrErr) {
        console.error('Erreur QR code :', qrErr.message);
        return res.status(500).json({ error: 'Erreur QR code' });
      }

      console.log('QR code généré avec succès');
      proceed();
    });
  });
});

// ================================
// Route : historique des livraisons
// ================================
router.get('/history', authenticateToken, async (req, res) => {
  try {
    // PostgreSQL ne supporte pas IFNULL chngement pour COALESCE
    const result = await pool.query(`
      SELECT deliveries.date, deliveries.dish_name, deliveries.qr_token,
             COALESCE(clients.firstName, 'Utilisateur inconnu') AS prenom,
             COALESCE(clients.lastName, '') AS nom
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
