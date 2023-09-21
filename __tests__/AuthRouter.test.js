const request = require('supertest');
const { app } = require('../server/server');
let server; // Declare server variable
const db = require('../server/db/database.js'); // Importing the pool to then close it in after all

beforeAll(() => {
  process.env.PORT = 3001;
  const serverModule = require('../server/server');
  server = serverModule.server || serverModule.app.listen(process.env.PORT); // Start the server here if it hasn't started yet
});

describe('Auth Routes', () => {
  // Test for /login
  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'testpassword' }); // Adjust with actual credentials
      expect(response.statusCode).toBe(200);
      expect(response.body.profile).toBeDefined();
    });
  });
});

// Test for /signup
describe('POST /auth/signup', () => {
  it('should signup a new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'newuser', password: 'newpassword' }); // Adjust with actual credentials
    expect(response.statusCode).toBe(200);
    expect(response.body.profile).toBeDefined();
  });
});

describe('GET /check', () => {
  it('should return a status indicating if the user is logged in', async () => {
    const response = await request(app).get('/api/auth/check');

    // This is a generic check, adapt based on your expected response format and logic
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('isLoggedIn');
    expect(typeof response.body.isLoggedIn).toBe('boolean');
  });
});

describe('POST /logout', () => {
  it('should log the user out and return a success status', async () => {
    const response = await request(app).post('/api/auth/logout');

    // Again, adapt based on your expected response format and logic
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Successfully logged out');
  });
});

afterAll(async () => {
  if (server) server.close(); // Close the server after all tests
  await db.end(); // Close the pool
});
