// server/index.js

// on charge les variables d'environnement depuis le fichier .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// importe l'application Express configurée dans app.js
const app = require('./app');

// choisit le port : celui défini dans les variables d'environnement, ou 3001 par défaut
const PORT = process.env.PORT || 3001;

// lance le serveur
app.listen(PORT, () => {
  console.log(`NomNom backend is running on http://localhost:${PORT}`);
});
