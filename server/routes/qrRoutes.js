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

module.exports = router;
