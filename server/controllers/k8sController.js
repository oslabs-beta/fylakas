const express = require('express');
// import * as k8s from '@kubernetes/client-node';
const k8s = require('@kubernetes/client-node');


// connect config from kat root directory
const kc = new k8s.KubeConfig();
kc.loadFromFile('/Users/katfry/.kube/config');


const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
if (k8sApi) console.log('user is connected');
else console.log('problem connecting');
const k8sApi2 = kc.makeApiClient(k8s.AppsV1Api);

// Initialize an empty object to hold Kubernetes controller functions
const k8sController = {};

// Define a function to get information about Kubernetes nodes
k8sController.getNodes = async (req, res, next
) => {
  console.log('K8s API:', k8sApi);
  try {
    // Fetch node information from the Kubernetes API
    const data = await k8sApi.listNode();
    console.log('Data returned:', data)
    // Process the fetched data and map it into an array of Node objects
    const nodes = data.body.items.map(data => {
      const { name, namespace, creationTimestamp, labels, uid } = data.metadata;
      const { providerID } = data.spec;
      const { status } = data;
      const node = {
        name,
        namespace,
        creationTimestamp,
        uid,
        labels,
        providerID,
        status,
      };
      return node;
    });

    // Store the processed Nodes in the response locals object
    res.locals.nodes = nodes;

    // Store cluster information in the response locals
    res.locals.cluster = { nodes: nodes };

    // Call the 'next' function to continue along the middleware chain
    return next();
  } catch (error) {
    // Handle errors by sending an error response
    return next({
      log: 'Error caught in k8sController getNodes',
      error,
      status: 400,
        message: {
          err: `An error occured when fetching Node information from the Kubernetes API. Error: ${error.message}`,
        },
    });
  }
};

// Define a function to get information about the Kubernetes pods
k8sController.getPods = async (req, res, next
) => {
  try {
    // Fetch pod data from the Kubernetes API
    const data = await k8sApi.listPodForAllNamespaces();

    // Process the fetched data and map it to an array of Pod objects
    const pods = data.body.items.map(data => {
      const { name, namespace, creationTimestamp, uid, labels } = data.metadata;
      const { nodeName, containers, serviceAccount } = data.spec;
      const { conditions, containerStatuses, phase, podIP } = data.status;
      const pod= {
        name,
        namespace,
        uid,
        creationTimestamp,
        labels,
        nodeName,
        containers,
        serviceAccount,
        conditions,
        containerStatuses,
        phase,
        podIP,
      };
      return pod;
    });

    // Store the processed data in the res.locals
    res.locals.pods = pods;

    // Store the processed data in the cluster property of res.locals
    res.locals.cluster = { pods: pods };
        // Call the 'next' function to continue along the middleware chain
    next();
  } catch (error) {
    // Handle errors by sending an error response    
    return next({
      log: 'Error caught in k8sController getPods',
      error,
      status: 400,
      message: {
        err: 'An error occured when fetching Pod information from the Kubernetes API',
      },
    });
  }
};

k8sController.getNamespaces = async (req, res, next
) => {
  try {
    const data = await k8sApi.listNamespace();
    const namespaces = data.body.items.map(data => {
      const { name, creationTimestamp, labels, uid } = data.metadata;
      const { phase } = data.status;
      const nodeName = '';
      const namespace= {
        name,
        uid,
        creationTimestamp,
        labels,
        phase,
        nodeName,
      };
      return namespace;
    });
    res.locals.namespaces = namespaces;
    res.locals.cluster = { namespaces: namespaces };
    next();
  } catch (error) {
    // Handle errors by sending an error response    
    return next({
      log: 'Error caught in k8sController getNamespaces',
      error,
      status: 400,
      message: {
        err: 'An error occured when fetching Namespace information from the Kubernetes API',
      },
    });
  }
};

k8sController.getServices = async (req, res, next
) => {
  try {
    const data = await k8sApi.listServiceForAllNamespaces();
    const services = data.body.items.map(data => {
      const { name, namespace, uid, creationTimestamp, labels } = data.metadata;
      const { ports, clusterIP } = data.spec;
      const { loadBalancer } = data.status;
      const service = {
        name,
        namespace,
        uid,
        creationTimestamp,
        labels,
        ports,
        loadBalancer,
        clusterIP,
      };
      return service;
    });
    res.locals.services = services;
    res.locals.cluster = { services: services };
    next();
  } catch (error) {
    // Handle errors by sending an error response    
    return next({
      log: 'Error caught in k8sController getServices',
      error,
      status: 400,
      message: {
        err: 'An error occured when fetching Service information from the Kubernetes API',
      },
    });
  }
};

k8sController.getDeployments = async (req, res, next
) => {
  try {
    const data = await k8sApi2.listDeploymentForAllNamespaces();

    const deployments = data.body.items.map(data => {
      const { name, creationTimestamp, labels, namespace, uid } = data.metadata;
      const { replicas } = data.spec;
      const { status } = data.status;
      const deployment = {
        name,
        namespace,
        uid,
        creationTimestamp,
        labels,
        replicas,
        status,
      };
      return deployment;
    });
    res.locals.deployments = deployments;
    res.locals.cluster = { deployments: deployments };
    next();
  } catch (error) {
    // Handle errors by sending an error response
    return next({
      log: 'Error caught in k8sController getDeployments',
      error,
      status: 400,
      message: {
        err: 'An error occured when fetching Deployment information from the Kubernetes API',
      },
    });
  }
};

// Define a function to get information about the cluster
k8sController.getCluster = async (req, res, next
) => {
  try {
    // Retrieve data about nodes, pods, namespaces, services, and deployments from res.locals
    const nodes = res.locals.nodes;
    const pods = res.locals.pods;
    const namespaces = res.locals.namespaces;
    const services = res.locals.services;
    const deployments = res.locals.deployments;

    // Create a Cluster object that contains information about the entire cluster
    const cluster = {
      nodes,
      pods,
      namespaces,
      services,
      deployments,
    };

    // Store the cluster information in the response locals
    //currently does not accounting for multiple clusters, just one cluster for now
    res.locals.cluster = cluster;
    // Call the 'next' function to continue along the middleware chain
    next();
  } catch (error) {
    // Handle errors by sending an error response
    return next({
      log: 'Error caught in k8sController getCluster',
      error,
      status: 400,
      message: {
        err: 'An error occured when fetching Cluster information from the Kubernetes API',
      },
    });
  }
};

module.exports = k8sController;