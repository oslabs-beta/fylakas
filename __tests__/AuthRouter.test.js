const request = require('supertest');
const express = require('express');
const { server } = require('../server/server');
const authRouter = require('../server/routers/authRouter');
const db = require('../db/database.js'); // Importing the pool to then close it in after all

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
  // Test for /login
  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'testpassword' }); // Adjust with actual credentials
      expect(response.statusCode).toBe(200);
      expect(response.body.profile).toBeDefined();
    });
  });
});

afterAll(async (done) => {
  server.close();
  await db.end(); // Close the pool
  done();
});
