const express = require('express');
const router = express.Router();
const db = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Route d'inscription
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'Missing fields' });

  const normalizedEmail = email.toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, normalizedEmail, hashedPassword],
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

// Route de connexion
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  const normalizedEmail = email.toLowerCase();

  db.get(`SELECT * FROM users WHERE email = ?`, [normalizedEmail], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    try {
      console.log('Mot de passe reçu :', password);
      console.log('Mot de passe en base :', user.password);

      const match = await bcrypt.compare(password, user.password);
      console.log('Résultat comparaison :', match);

      if (!match) return res.status(401).json({ error: 'Invalid password' });

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '2d' }
      );

      const { password: _, ...userData } = user;

      res.json({
        message: 'Login successful',
        token,
        user: userData,
      });
    } catch (err) {
      res.status(500).json({ error: 'Login failed' });
    }
  });
});

module.exports = router;
