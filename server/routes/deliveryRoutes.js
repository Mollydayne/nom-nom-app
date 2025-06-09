const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authenticateToken = require('../middleware/authenticateToken');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// Route : ajouter une nouvelle livraison (QR code ou réutilisation)
router.post('/', authenticateToken, (req, res) => {
  console.log(' BODY reçu :', req.body);

  const { client_id, quantity, date, reuse_qr_token, dish_name } = req.body;
  const sender_id = req.user.id;

  console.log('  Vérification des champs requis :');
  console.log('  client_id =', client_id);
  console.log('  quantity  =', quantity);
  console.log('  date      =', date);

  if (!client_id || !quantity || !date) {
    console.log('Champs requis manquants → 400');
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const unitPrice = 8.0;
  const totalPrice = quantity * unitPrice;
  const qr_token = reuse_qr_token || uuidv4();
  const qrDir = path.join(__dirname, '../qrcodes');
  const qrPath = path.join(qrDir, `${qr_token}.png`);
  const qrData = `http://localhost:3001/api/qr/${qr_token}`;

  // Fonction à exécuter une fois le QR code prêt (ou en réutilisation)
  const proceed = () => {
    db.run(
      `INSERT INTO deliveries (client_id, sender_id, quantity, date, returned, paid, price, qr_token, dish_name)
       VALUES (?, ?, ?, ?, 0, 0, ?, ?, ?)`,
      [client_id, sender_id, quantity, date, totalPrice, qr_token, dish_name],
      function (err) {
        if (err) {
          console.error('Erreur ajout livraison :', err.message);
          return res.status(500).json({ error: 'Erreur serveur' });
        }

        console.log('Livraison enregistrée avec ID :', this.lastID);

        // Vérifie si une préférence pour ce plat existe déjà
        const checkPref = `
          SELECT * FROM preferences WHERE client_id = ? AND dish_name = ?
        `;
        db.get(checkPref, [client_id, dish_name], (err2, row) => {
          if (err2) {
            console.error('Erreur vérification préférence :', err2.message);
          } else if (!row) {
            // Si aucune préférence n'existe, on la crée
            const insertPref = `
              INSERT INTO preferences (client_id, dish_name, liked)
              VALUES (?, ?, NULL)
            `;
            db.run(insertPref, [client_id, dish_name], (err3) => {
              if (err3) {
                console.error('Erreur création préférence :', err3.message);
              }
            });
          }
        });

        // Réponse envoyée au frontend
        res.status(201).json({
          message: reuse_qr_token
            ? 'Livraison réutilisant une boîte existante'
            : 'Livraison enregistrée avec QR code',
          deliveryId: this.lastID,
          qr_token,
          qr_url: qrData,
          qr_image_url: `http://localhost:3001/qrcodes/${qr_token}.png`,
        });
      }
    );
  };

  // Si on réutilise un QR code existant, on saute la génération d'image
  if (reuse_qr_token) {
    console.log('♻️ Réutilisation de QR code');
    return proceed();
  }

  // Sinon, on génère une nouvelle image QR code
  fs.mkdir(qrDir, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) {
      console.error('Erreur création dossier QR :', mkdirErr.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    QRCode.toFile(qrPath, qrData, (qrErr) => {
      if (qrErr) {
        console.error('Erreur QR code :', qrErr.message);
        return res.status(500).json({ error: 'Erreur QR code' });
      }

      console.log('QR code généré avec succès');
      proceed();
    });
  });
});

module.exports = router;
