require('dotenv').config(); // charge .env d'abord
require('./initDb');        // ensuite seulement, appelle db.js


const express = require('express');
const cors = require('cors');

const app = express();

// =====================
// Configuration CORS
// =====================
// autorise les accès depuis le front local et le site en prod
// Version dynamique obligatoire quand on utilise credentials: true, changé suite à passage postgre
const allowedOrigins = [
  'http://localhost:5173',           // pour le dev local (Vite)
  'http://localhost:3000',           // pour le dev React classique
  'https://www.nom-nom.app',         // site frontend déployé avec www
  'https://nom-nom.app'              // site frontend sans www
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// =====================
// Middleware JSON
// =====================
app.use(express.json());

// =====================
// Routes de base (test / racine)
// =====================
app.get('/', (req, res) => {
  res.send('Bonjour patate');
});

app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong depuis le backend' });
});

// =====================
//  Routes de l'application
// =====================
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');
const boxRoutes = require('./routes/boxRoutes');
const qrRoutes = require('./routes/qrRoutes');

app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/boxes', boxRoutes);
app.use('/api/qrcodes', qrRoutes);

module.exports = app;
