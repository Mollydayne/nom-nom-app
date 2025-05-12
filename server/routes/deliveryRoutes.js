const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authenticateToken = require('../middleware/authenticateToken');

// Route : ajouter une nouvelle livraison (avec calcul du prix et token requis)
router.post('/', authenticateToken, (req, res) => {
  const { client_id, quantity, date } = req.body;
  const sender_id = req.user.id;

  if (!client_id || !quantity || !date) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const unitPrice = 8.0;
  const totalPrice = quantity * unitPrice;

  db.run(
    `INSERT INTO deliveries (client_id, sender_id, quantity, date, returned, paid, price)
     VALUES (?, ?, ?, ?, 0, 0, ?)`,
    [client_id, sender_id, quantity, date, totalPrice],
    function (err) {
      if (err) {
        console.error('Erreur lors de l’ajout de la livraison :', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      res.status(201).json({ message: 'Livraison enregistrée', deliveryId: this.lastID });
    }
  );
});

module.exports = router;
