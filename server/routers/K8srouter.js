const express = require('express');
const k8sController = require('../controllers/k8sController.js');

const k8srouter = express.Router();

k8srouter.get(
  '/cluster',
  k8sController.getNodes,
  k8sController.getPods,
  k8sController.getNamespaces,
  k8sController.getServices,
  k8sController.getDeployments,
  k8sController.getCluster,
  k8sController.nodeStatus,
  k8sController.podStatus,
  async (_, res) => {
    // console.log('res.locals.cluster', res.locals.cluster);
    return res.status(200).json(res.locals.cluster);
  },
);

module.exports = k8srouter;