const express = require('express');
const router = express.Router();
const db = require('../db/database');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'Missing fields' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
          message: 'User registered successfully',
          userId: this.lastID,
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Error hashing password' });
  }
});

module.exports = router;
