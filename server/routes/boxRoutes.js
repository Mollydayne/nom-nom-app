
const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/:qr_token/deliveries', (req, res) => {
  const { qr_token } = req.params;

  db.get('SELECT id FROM boxes WHERE qr_token = ?', [qr_token], (err, box) => {
    if (err || !box) {
      return res.status(404).json({ error: 'Box non trouvée' });
    }

    db.all(
      `SELECT deliveries.*, clients.firstName, clients.lastName, boxes.qr_token
       FROM deliveries
       JOIN clients ON deliveries.client_id = clients.id
       JOIN boxes ON deliveries.box_id = boxes.id
       WHERE deliveries.box_id = ?
       ORDER BY date DESC`,
      [box.id],
      (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erreur récupération livraisons' });
        res.json(rows);
      }
    );
  });
});

module.exports = router;
