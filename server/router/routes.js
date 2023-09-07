const express = require("express");
const app = express();
const authController = require('../controllers/authController.js');
const router = express.Router();

// routes go here




// Unknown route handler, used if user is trying to access anything outside of the scope provided.
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

module.exports = router; 