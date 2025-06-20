const express = require('express');
const router = express.Router();
const pool = require('../db'); // passage à PostgreSQL

// ==============================
// Route : traitement du scan d’un QR code
// ==============================
router.get('/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Recherche de la livraison associée au QR code
    const deliveryRes = await pool.query(
      'SELECT * FROM deliveries WHERE qr_token = $1',
      [token]
    );

    if (deliveryRes.rows.length === 0) {
      return res.status(404).json({ message: 'QR code inconnu' });
    }

    const delivery = deliveryRes.rows[0];

    // Si la livraison n’a pas encore été marquée comme retournée
    if (!delivery.returned) {
      await pool.query(
        'UPDATE deliveries SET returned = true WHERE id = $1',
        [delivery.id]
      );

      return res.json({
        message: 'Retour enregistré',
        delivery_id: delivery.id,
        client_id: delivery.client_id
      });
    } else {
      //  Si déjà retourné
      return res.json({
        message: 'Les gamelles ont déjà été rendues',
        delivery_id: delivery.id,
        client_id: delivery.client_id
      });
    }

  } catch (err) {
    console.error('Erreur recherche QR :', err.message);
    return res.status(500).json({ message: 'Erreur serveur' });
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
