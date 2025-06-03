const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Route : ajouter une préférence
router.post('/', (req, res) => {
  const { user_id, item, type } = req.body;

  if (!user_id || !item || !type || !['liked', 'disliked'].includes(type)) {
    return res.status(400).json({ message: "Champs invalides ou manquants" });
  }

  db.run(
    `INSERT INTO preference_items (user_id, item, type) VALUES (?, ?, ?)`,
    [user_id, item, type],
    function (err) {
      if (err) return res.status(500).json({ message: "Erreur serveur", error: err.message });

      res.status(201).json({ message: "Préférence ajoutée", id: this.lastID });
    }
  );
});

// Route : récupérer toutes les préférences d’un utilisateur
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;

  db.all(
    `SELECT * FROM preference_items WHERE user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Erreur serveur", error: err.message });

      res.json(rows);
    }
  );
});

// Route : mettre à jour une préférence existante
router.patch('/:id', (req, res) => {
  const preferenceId = req.params.id;
  const { type } = req.body;

  if (type !== 'liked' && type !== 'disliked' && type !== null) {
    return res.status(400).json({ message: "Type must be 'liked', 'disliked' or null" });
  }

  db.run(
    `UPDATE preference_items SET type = ? WHERE id = ?`,
    [type, preferenceId],
    function (err) {
      if (err) return res.status(500).json({ message: "Erreur serveur", error: err.message });

      if (this.changes === 0) {
        return res.status(404).json({ message: "Préférence non trouvée" });
      }

      res.json({ message: "Préférence mise à jour", id: preferenceId, type });
    }
  );
});

module.exports = router;
