const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Route : traitement du scan d’un QR code
router.get('/:token', (req, res) => {
  const { token } = req.params;

  // Recherche la livraison associée au QR code
  db.get(
    'SELECT * FROM deliveries WHERE qr_token = ?',
    [token],
    (err, delivery) => {
      if (err) {
        console.error('Erreur recherche QR :', err.message);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (!delivery) {
        return res.status(404).json({ message: 'QR code inconnu' });
      }

      // Si la livraison n’a pas encore été marquée comme retournée
      if (delivery.returned === 0) {
        db.run(
          'UPDATE deliveries SET returned = 1 WHERE id = ?',
          [delivery.id],
          (updateErr) => {
            if (updateErr) {
              console.error('Erreur mise à jour retour :', updateErr.message);
              return res.status(500).json({ message: 'Erreur mise à jour du retour' });
            }

            return res.json({
              message: 'Retour enregistré',
              delivery_id: delivery.id,
              client_id: delivery.client_id
            });
          }
        );
      } else {
        // Si déjà retourné
        return res.json({
          message: 'Les gamelles ont déjà été rendues',
          delivery_id: delivery.id,
          client_id: delivery.client_id
        });
      }
    }
  );
});

// Route : historique des livraisons associées à un QR token
router.get('/boxes/:qr_token/deliveries', (req, res) => {
  const { qr_token } = req.params;

  const query = `
    SELECT deliveries.id, deliveries.date, deliveries.quantity, deliveries.returned, deliveries.dish_name,
           users.firstName, users.lastName
    FROM deliveries
    JOIN users ON deliveries.sender_id = users.id
    WHERE qr_token = ?
    ORDER BY date DESC
  `;

  db.all(query, [qr_token], (err, rows) => {
    if (err) {
      console.error('Erreur récupération historique :', err.message);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération de l’historique' });
    }

    return res.json(rows);
  });
});

module.exports = router;
