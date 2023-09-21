const request = require('supertest');
const express = require('express');
const authRouter = require('../server/routers/authRouter'); // adjust path to your router file

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
      // Other assertions as necessary...
    });
  });
});
