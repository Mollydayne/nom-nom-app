const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const db = require('../db/database');
const { promisify } = require('util');

const closeDb = promisify(db.close).bind(db);
const getAsync = promisify(db.get).bind(db);

describe('POST /api/deliveries', () => {
  let clientId;
  let token;

  beforeAll(async () => {
    // Supprimer tout utilisateur test existant (évite erreur UNIQUE)
    await db.run(`DELETE FROM users WHERE email = ?`, ['testclient@nomnom.com']);

    // Créer un utilisateur test
    await db.run(
      `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
      ['testClient', 'testclient@nomnom.com', 'hashedPassword123', 'client']
    );

    const client = await getAsync(
      `SELECT id FROM users WHERE email = ?`,
      ['testclient@nomnom.com']
    );

    console.log('Client récupéré en base :', client);

    clientId = client?.id;
    console.log('ID du client utilisé dans le test :', clientId);

    token = jwt.sign(
      { id: clientId, role: 'client' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await db.run(`DELETE FROM deliveries WHERE client_id = ?`, [clientId]);
    await db.run(`DELETE FROM users WHERE id = ?`, [clientId]);

    await closeDb();
  });

  it('devrait enregistrer une nouvelle livraison (test sans prix)', async () => {
    const today = new Date().toISOString().split('T')[0]; // ex: 2025-05-22

    const payload = {
      client_id: clientId,
      quantity: 2,
      date: today
    };

    console.log('Payload envoyé dans .send() :', payload);

    const res = await request(app)
      .post('/api/deliveries')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    console.log('Réponse reçue (status) :', res.statusCode);
    console.log('Réponse reçue (body) :', res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('qr_token');
    expect(res.body).toHaveProperty('deliveryId');
    expect(res.body.message).toMatch(/Livraison enregistrée|réutilisant une boîte/);
  });
});
