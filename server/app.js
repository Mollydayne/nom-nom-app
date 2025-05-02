const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors()); // autorise les requêtes depuis React (localhost:5173)
app.use(express.json());

// Test route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong depuis le backend 🍱' });
});

app.listen(PORT, () => {
  console.log(`🚀 NomNom backend is running on http://localhost:${PORT}`);
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
