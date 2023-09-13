import * as k8s from '@kubernetes/client-node';
const express = require('express');

// connect config from kat root directory
const kc = new k8s.KubeConfig();
kc.loadFromFile('/Users/katfry/.kube/config');


const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
if (k8sApi) console.log('user is connected');
else console.log('problem connecting');
const k8sApi2 = kc.makeApiClient(k8s.AppsV1Api);

// initialize controller to add methods later
const k8sController = {};

// export controller
export default k8sController;