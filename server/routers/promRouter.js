const express = require('express');
const Promcontroller = require('../controllers/promController.js');

const promRouter = express.Router();

promRouter.get(
  '/prom',
  Promcontroller.cpuUsageByContainer,
  async (_, res) => {
    // console.log('res.locals.cluster', res.locals.cluster);
    return res.status(200).json(res.locals.response);
  },
);

module.exports = promRouter;