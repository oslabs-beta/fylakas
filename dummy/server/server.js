const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3434;

const messageController = require('./controllers/messageController.js');
const authController = require('./controllers/authController.js');

// Parse all incoming requests and cookies
app.use(express.json());
app.use(cookieParser());

// Serve assets
app.use(express.static(path.join(__dirname, '../assets')));

// Serve index page
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../views/index.html'));
});

app.post('/messages', messageController.postMessage, (req, res) => {
  return res.sendStatus(200);
});

app.get('/messages', messageController.getMessages, (req, res) => {
  return res.status(200).json(res.locals.messages);
});

app.delete('/messages', authController.checkAuth, messageController.deleteMessage, (req, res) => {
  return res.sendStatus(200);
});

// 404 handler
app.use('*', (req, res) => {
  return res.status(404).send('File not found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.log(err);
  const defaultError = {
    log: 'Unknown middleware error caught in express error handler',
    status: 500,
    message: {err: 'An unknown error occurred'}
  };
  const error = {...defaultError, ...err};
  console.log(error.log);
  return res.status(error.status).json(error.message);
});

app.listen(PORT, () => {
  console.log(`Server open on port ${PORT}...`);
});