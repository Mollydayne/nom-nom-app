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
  const { client_id, quantity, date, reuse_qr_token } = req.body;
  const sender_id = req.user.id;

  if (!client_id || !quantity || !date) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const unitPrice = 8.0;
  const totalPrice = quantity * unitPrice;
  const qr_token = reuse_qr_token || uuidv4();
  const qrDir = path.join(__dirname, '../qrcodes');
  const qrPath = path.join(qrDir, `${qr_token}.png`);
  const qrData = `http://localhost:3001/api/qr/${qr_token}`;

  // Si c’est une réutilisation, ne régénère pas le QR
  const proceed = () => {
    db.run(
      `INSERT INTO deliveries (client_id, sender_id, quantity, date, returned, paid, price, qr_token)
       VALUES (?, ?, ?, ?, 0, 0, ?, ?)`,
      [client_id, sender_id, quantity, date, totalPrice, qr_token],
      function (err) {
        if (err) {
          console.error('Erreur ajout livraison :', err.message);
          return res.status(500).json({ error: 'Erreur serveur' });
        }

        res.status(201).json({
          message: reuse_qr_token ? 'Livraison réutilisant une boîte existante' : 'Livraison enregistrée avec QR code',
          deliveryId: this.lastID,
          qr_token,
          qr_url: qrData,
          qr_image_url: `http://localhost:3001/qrcodes/${qr_token}.png`
        });
      }
    );
  };

  if (reuse_qr_token) {
    return proceed();
  }

  // Générer le QR code si pas de réutilisation
  fs.mkdir(qrDir, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) {
      console.error('Erreur dossier QR :', mkdirErr.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    QRCode.toFile(qrPath, qrData, (qrErr) => {
      if (qrErr) {
        console.error('Erreur QR code :', qrErr.message);
        return res.status(500).json({ error: 'Erreur QR code' });
      }
      proceed();
    });
  });
});

module.exports = router;
