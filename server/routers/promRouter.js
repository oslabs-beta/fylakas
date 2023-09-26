const express = require('express');
const PromController = require('../controllers/promController.js');
const authController = require('../controllers/authController.js');

const promRouter = express.Router();

promRouter.use(authController.isLoggedIn);

promRouter.get(
  '/metrics',
  PromController.getDate,
  PromController.cpuUsageByContainer,
  PromController.memoryUsageByContainer,
  // PromController.networkTrafficByContainer,
  PromController.diskSpace,
  async (_, res) => {
    // console.log('res.locals.cluster', res.locals.cluster);
    console.log('sending res.locals.metrics:', res.locals.metrics);
    return res.status(200).json(res.locals.metrics);
  }
);

module.exports = promRouter;
