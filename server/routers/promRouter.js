const express = require('express');
const PromController = require('../controllers/promController.js');
const authController = require('../controllers/authController.js');

const promRouter = express.Router();

promRouter.use(authController.isLoggedIn);

promRouter.post(
  '/metrics',
  PromController.getDate,
  PromController.cpuUsageByContainer,
  PromController.memoryUsageByContainer,
  // PromController.networkTrafficByContainer,
  PromController.diskSpace,
  async (_, res) => {
    // console.log('res.locals.cluster', res.locals.cluster);
    console.log(`Sending res.locals.metrics to ${res.locals.username}.`);
    return res.status(200).json(res.locals.metrics);
  }
);

promRouter.post(
  '/endpoint',
  PromController.addEndpoint,
  (_, res) => {
    return res.status(200).json({success: res.locals.success});
  }
);

module.exports = promRouter;
