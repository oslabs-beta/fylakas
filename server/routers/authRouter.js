const express = require('express');
const authController = require('../controllers/authController.js');
const router = express.Router();

router.post(
  '/login',
  authController.handleUserDetails,
  authController.login,
  authController.startSession,
  (req, res) => {
    res.status(200).json({ profile: res.locals.profile });
  }
);

router.post(
  '/signup',
  authController.handleUserDetails,
  authController.signup,
  authController.startSession,
  (req, res) => {
    res.status(200).json({ profile: res.locals.profile });
  }
);

router.get('/check', authController.isLoggedIn, (req, res) => {
  res.status(200).json({ isLoggedIn: res.locals.isLoggedIn });
});

router.get('/logout', authController.logout, (req, res) => {
  res.status(200).json({ message: 'Successfully logged out' });
});

module.exports = router;
