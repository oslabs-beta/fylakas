const express = require("express");
const authController = require('../controllers/authController.js');
const router = express.Router();

// routes go here

router.post(
  '/login',
  authController.handleUserDetails,
  authController.login,
  authController.startSession, 
  (req, res) => {res.status(200).json({profile: res.locals.profile})}
);

router.post(
  '/signup',
  authController.handleUserDetails,
  authController.signup,
  authController.startSession,
  (req, res) => {res.status(200).json({profile: res.locals.profile})}
);

router.get(
  '/check',
  authController.isLoggedIn,
  (req, res) => {res.status(200).json({isLoggedIn: res.locals.isLoggedIn})}
);

router.get(
  '/logout',
  authController.logout,
  (req, res) => {res.sendStatus(200)}
);

module.exports = router; 