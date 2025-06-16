const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authenticateToken = require('../middleware/authenticateToken');

// ==============================
// POST - Créer une nouvelle préférence
// ==============================
router.post('/', authenticateToken, (req, res) => {
  const { dish_name, liked } = req.body;
  const userEmail = req.user.email;

  // Vérification des champs
  if (!dish_name || liked === undefined) {
    return res.status(400).json({ error: 'dish_name et liked sont requis' });
  }

  // On récupère le client connecté via son email
  db.get(`SELECT id FROM clients WHERE email = ?`, [userEmail], (err, client) => {
    if (err) {
      console.error("Erreur SQL (client par email) :", err.message);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (!client) {
      return res.status(404).json({ error: "Client introuvable" });
    }

    // On ajoute la préférence en base
    db.run(
      `INSERT INTO preferences (client_id, dish_name, liked)
       VALUES (?, ?, ?)`,
      [client.id, dish_name, liked],
      function (err) {
        if (err) {
          console.error("Erreur insertion préférence :", err.message);
          return res.status(500).json({ error: "Erreur lors de la création" });
        }

        // On retourne l'ID de la préférence créée
        res.status(201).json({ id: this.lastID, liked });
      }
    );
  });
});

// ==============================
// PATCH - Modifier une préférence existante
// ==============================
router.patch('/:id', authenticateToken, (req, res) => {
  const preferenceId = req.params.id;
  const { liked } = req.body;

  // Vérification du champ liked
  if (liked !== true && liked !== false) {
    return res.status(400).json({ error: "Le champ 'liked' doit être true ou false" });
  }

  // Mise à jour de la préférence
  db.run(
    `UPDATE preferences SET liked = ? WHERE id = ?`,
    [liked, preferenceId],
    function (err) {
      if (err) {
        console.error("Erreur mise à jour préférence :", err.message);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Préférence introuvable" });
      }

      res.json({ message: "Préférence mise à jour", id: preferenceId, liked });
    }
  );
});

module.exports = router;
