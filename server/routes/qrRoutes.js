const express = require('express');
const router = express.Router();
const pool = require('../db'); // passage à PostgreSQL

// ==============================
// Route : récupération d’une livraison par QR token (sans modifier le retour)
// ==============================
router.get('/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const result = await pool.query(
      `SELECT d.id, d.qr_token, d.returned, d.date, d.dish_name,
              c.firstname, c.lastname
       FROM deliveries d
       LEFT JOIN clients c ON d.client_id = c.id
       WHERE d.qr_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'QR code inconnu' });
    }

    const delivery = result.rows[0];

    res.json({
      delivery_id: delivery.id,
      dish: delivery.dish_name,
      date: delivery.date,
      client: `${delivery.firstname || 'Utilisateur'} ${delivery.lastname || ''}`.trim(),
      returned: delivery.returned
    });

  } catch (err) {
    console.error('Erreur recherche QR :', err.message);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==============================
// Route : marquer un QR comme retourné
// ==============================
router.patch('/:token/return', async (req, res) => {
  const { token } = req.params;

  try {
    const result = await pool.query(
      `UPDATE deliveries
       SET returned = true
       WHERE qr_token = $1
       RETURNING id`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'QR code introuvable pour mise à jour' });
    }

    return res.json({ message: 'Retour enregistré avec succès' });

  } catch (err) {
    console.error('Erreur retour QR :', err.message);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==============================
// Route : historique des livraisons associées à un QR token 
// ==============================
router.get('/boxes/:qr_token/deliveries', async (req, res) => {
  const { qr_token } = req.params;

  const query = `
    SELECT deliveries.id, deliveries.date, deliveries.quantity, deliveries.returned, deliveries.dish_name,
           users.firstName, users.lastName
    FROM deliveries
    JOIN users ON deliveries.sender_id = users.id
    WHERE qr_token = $1
    ORDER BY date DESC
  `;

  try {
    const result = await pool.query(query, [qr_token]);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erreur récupération historique :', err.message);
    return res.status(500).json({
      error: 'Erreur serveur lors de la récupération de l’historique'
    });
  }
});

module.exports = router;
