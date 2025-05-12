// Chargement des variables d'environnement depuis .env
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware pour permettre les requêtes depuis le frontend (localhost:5173)
app.use(cors());
app.use(express.json());

// Test de route pour vérifier que le backend fonctionne
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong depuis le backend' });
});

// Routes utilisateurs (authentification, etc.)
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Routes clients (gestion des fiches clients)
const clientRoutes = require('./routes/clientRoutes');
app.use('/api/clients', clientRoutes);

// Routes livraisons (enregistrement des gamelles livrées)
const deliveryRoutes = require('./routes/deliveryRoutes');
app.use('/api/deliveries', deliveryRoutes);

// Routes préférences alimentaires (plats aimés / non aimés)
const preferenceRoutes = require('./routes/preferenceRoutes');
app.use('/api/preferences', preferenceRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`NomNom backend is running on http://localhost:${PORT}`);
});
