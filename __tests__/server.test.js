const request = require('supertest');
const { app } = require('../server/server');
let server; // Declare server variable

beforeAll(() => {
  process.env.PORT = 3000;
  const serverModule = require('../server/server');
  server = serverModule.server || serverModule.app.listen(process.env.PORT); // Start the server here if it hasn't started yet
});

describe('Server Routes', () => {
  describe('GET /', () => {
    it('should respond with the index.html file', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('text/html');
    });
  });

  describe('Unknown Routes', () => {
    it('should respond with a 404 status and message', async () => {
      const response = await request(app).get('/unknownpath');
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("This is not the page you're looking for...");
    });
  });
});

afterAll((done) => {
  if (server) server.close(done); // Close the server after all tests
});
