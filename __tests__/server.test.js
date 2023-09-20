const request = require('supertest');
const { app, server } = require('../server/server'); // Import both app and server

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
  server.close(done);
});
