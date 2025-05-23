// server/app.js

require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes de test
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong depuis le backend' });
});

// Routes de l'application
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');
const qrRoutes = require('./routes/qrRoutes');

app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/qr', qrRoutes);

// Exposer le dossier qrcodes
app.use('/qrcodes', express.static(__dirname + '/qrcodes'));

// Export uniquement l'app pour les tests
module.exports = app;
