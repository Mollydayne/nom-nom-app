// server/index.js

const app = require('./app');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`NomNom backend is running on http://localhost:${PORT}`);
});
