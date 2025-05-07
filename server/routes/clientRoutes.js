const express = require('express');
const router = express.Router();
const db = require('../db/database');

// =======================
// GET - Tous les clients
// =======================
router.get('/', (req, res) => {
  db.all(`SELECT * FROM clients`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// =======================
// GET - Un client par ID
// =======================
router.get('/:id', (req, res) => {
  const clientId = req.params.id;

  db.get(`SELECT * FROM clients WHERE id = ?`, [clientId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Client not found' });

    res.json(row);
  });
});

// =======================
// POST - Ajouter un client
// =======================
router.post('/', (req, res) => {
  const { name, email, allergies, likes } = req.body;

  console.log('📝 Nouveau client reçu :', req.body);

  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.run(
    `INSERT INTO clients (name, email, allergies, likes) VALUES (?, ?, ?, ?)`,
    [name, email, allergies, likes],
    function (err) {
      if (err) {
        console.error('❌ Erreur ajout client :', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Client added', id: this.lastID });
    }
  );
});

module.exports = router;
