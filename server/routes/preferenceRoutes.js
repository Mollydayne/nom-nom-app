const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL maintenant
const authenticateToken = require('../middleware/authenticateToken');

// ==============================
// POST - Créer une nouvelle préférence
// ==============================
router.post('/', authenticateToken, async (req, res) => {
  const { dish_name, liked } = req.body;
  const userEmail = req.user.email;

  // Vérification des champs
  if (!dish_name || liked === undefined) {
    return res.status(400).json({ error: 'dish_name et liked sont requis' });
  }

  try {
    // Récupère le client connecté via son email
    const clientRes = await pool.query(
      `SELECT id FROM clients WHERE email = $1`,
      [userEmail]
    );

    if (clientRes.rows.length === 0) {
      return res.status(404).json({ error: "Client introuvable" });
    }

    const clientId = clientRes.rows[0].id;

    // Insertion de la préférence
    const insertRes = await pool.query(
      `INSERT INTO preferences (client_id, dish_name, liked)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [clientId, dish_name, liked]
    );

    res.status(201).json({ id: insertRes.rows[0].id, liked });

  } catch (err) {
    console.error("Erreur insertion préférence :", err.message);
    res.status(500).json({ error: "Erreur lors de la création" });
  }
});

// ==============================
// PATCH - Modifier une préférence existante
// ==============================
router.patch('/:id', authenticateToken, async (req, res) => {
  const preferenceId = req.params.id;
  const { liked } = req.body;

  // Vérification du champ liked
  if (liked !== true && liked !== false) {
    return res.status(400).json({ error: "Le champ 'liked' doit être true ou false" });
  }

  try {
    // Mise à jour de la préférence
    const updateRes = await pool.query(
      `UPDATE preferences SET liked = $1 WHERE id = $2`,
      [liked, preferenceId]
    );

    if (updateRes.rowCount === 0) {
      return res.status(404).json({ error: "Préférence introuvable" });
    }

    res.json({ message: "Préférence mise à jour", id: preferenceId, liked });

  } catch (err) {
    console.error("Erreur mise à jour préférence :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
