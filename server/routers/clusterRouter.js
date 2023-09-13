const express = require("express");
const clusterController = require('../controllers/clusterController.js');
const authController = require('../controllers/authController.js');
const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/data',
  (req, res) => {res.status(200).json({isLoggedIn: res.locals.isLoggedIn})}
);

module.exports = router;