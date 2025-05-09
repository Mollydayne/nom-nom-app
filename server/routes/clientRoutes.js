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
  const { firstName, lastName, email, allergies, likes } = req.body;

  console.log('📝 Nouveau client reçu :', req.body);

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  // Vérifie s'il y a déjà un client avec ce nom complet ou cet email
  db.get(
    `SELECT * FROM clients WHERE (firstName = ? AND lastName = ?) OR (email = ? AND email IS NOT NULL)`,
    [firstName, lastName, email],
    (err, existingClient) => {
      if (err) {
        console.error('❌ Erreur vérification client :', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingClient) {
        return res.status(400).json({ error: 'Client already exists' });
      }

      // Insertion du nouveau client
      db.run(
        `INSERT INTO clients (firstName, lastName, email, allergies, likes) VALUES (?, ?, ?, ?, ?)`,
        [firstName, lastName, email || null, allergies, likes],
        function (err) {
          if (err) {
            console.error('❌ Erreur ajout client :', err.message);
            return res.status(500).json({ error: 'Failed to add client' });
          }

          res.status(201).json({ message: 'Client added', id: this.lastID });
        }
      );
    }
  );
});

// =======================
// PUT - Modifier un client
// =======================
router.put('/:id', (req, res) => {
  const clientId = req.params.id;
  const { firstName, lastName, email, allergies, likes } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  db.run(
    `UPDATE clients
     SET firstName = ?, lastName = ?, email = ?, allergies = ?, likes = ?
     WHERE id = ?`,
    [firstName, lastName, email || null, allergies, likes, clientId],
    function (err) {
      if (err) {
        console.error('❌ Erreur modification client :', err.message);
        return res.status(500).json({ error: 'Failed to update client' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json({ message: 'Client updated' });
    }
  );
});

// =======================
// DELETE - Supprimer un client
// =======================
router.delete('/:id', (req, res) => {
  const clientId = req.params.id;

  db.run(`DELETE FROM clients WHERE id = ?`, [clientId], function (err) {
    if (err) {
      console.error('❌ Erreur suppression client :', err.message);
      return res.status(500).json({ error: 'Failed to delete client' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client deleted' });
  });
});


module.exports = router;
