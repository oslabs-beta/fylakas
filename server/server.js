const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000; // Default to 3000 if no environment variable is set

// Routers
const authRouter = require('./routers/authRouter.js');
const promRouter = require('./routers/promRouter.js');

// Parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Handle static files
app.use('/', express.static(path.resolve(__dirname, '../build')));
app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

// Use routers
app.use('/api/auth', authRouter);
app.use('/api/prom', promRouter);

// Catch-all route handler for any requests to an unknown route
app.use('*', (req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

// Global Error Handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Start server
let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`);
  });
}

module.exports = { app, server };
