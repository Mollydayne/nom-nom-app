// Chargement des variables d'environnement depuis le fichier .env
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware pour autoriser les requêtes depuis le frontend (ex. localhost:5173)
app.use(cors());
app.use(express.json());

// Route de test pour vérifier que le backend fonctionne
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong depuis le backend' });
});

// Routes liées aux utilisateurs (inscription, connexion, etc.)
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Routes liées aux clients (création, édition, profil, etc.)
const clientRoutes = require('./routes/clientRoutes');
app.use('/api/clients', clientRoutes);

// Routes liées aux livraisons (enregistrement des gamelles livrées)
const deliveryRoutes = require('./routes/deliveryRoutes');
app.use('/api/deliveries', deliveryRoutes);

// Routes liées aux préférences alimentaires (plats aimés ou non)
const preferenceRoutes = require('./routes/preferenceRoutes');
app.use('/api/preferences', preferenceRoutes);

// Routes de scan de QR code (détection du retour de gamelles)
const qrRoutes = require('./routes/qrRoutes');
app.use('/api/qr', qrRoutes);

// Expose le dossier qrcodes pour permettre l'accès aux fichiers .png depuis le navigateur
app.use('/qrcodes', express.static(__dirname + '/qrcodes'));


// Lancement du serveur sur le port défini
app.listen(PORT, () => {
  console.log(`NomNom backend is running on http://localhost:${PORT}`);
});
