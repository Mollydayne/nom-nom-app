// server/routes/boxRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../db'); // nouveau fichier db.js PostgreSQL

// Route : récupérer les livraisons associées à une boîte (par QR token)
router.get('/:qr_token/deliveries', async (req, res) => {
  const { qr_token } = req.params;

  try {
    // 1. Récupérer l’ID de la boîte
    const boxResult = await pool.query(
      'SELECT id FROM boxes WHERE qr_token = $1',
      [qr_token]
    );

    if (boxResult.rows.length === 0) {
      return res.status(404).json({ error: 'Box non trouvée' });
    }

    const boxId = boxResult.rows[0].id;

    // 2. Récupérer les livraisons associées
    const deliveriesResult = await pool.query(
      `SELECT deliveries.*, clients.firstName, clients.lastName, boxes.qr_token
       FROM deliveries
       JOIN clients ON deliveries.client_id = clients.id
       JOIN boxes ON deliveries.box_id = boxes.id
       WHERE deliveries.box_id = $1
       ORDER BY date DESC`,
      [boxId]
    );

    res.json(deliveriesResult.rows);

  } catch (err) {
    console.error('Erreur récupération livraisons :', err);
    res.status(500).json({ error: 'Erreur récupération livraisons' });
  }
});

module.exports = router;
