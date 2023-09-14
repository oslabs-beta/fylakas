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
  // console.log('K8s API:', k8sApi);
  try {
    // Fetch node information from the Kubernetes API
    const data = await k8sApi.listNode();
    // console.log('Data returned:', data);
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
      // console.log('this is the node info', node);
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

k8sController.allocatableCapacity = async(req, res, next) => {
  try {
    // Fetch node information from the Kubernetes API
    const data = await k8sApi.listNode();
    // map data to find the status properties (allocatable, capacity, images) with cpu and memory for each 
    const nodeUsageData = data.body.items.map(data => {
      const { creationTimestamp } = data.metadata;  
      console.log('creationTimestamp', creationTimestamp);
      const { allocatable, capacity, images } = data.status;
      //const timeStamp = creationTimestamp;
      const usage = {
        creationTimestamp,
        allocatable,
        capacity,
        images
      };
      console.log('this is usage', usage);
      return usage;
    });
    res.locals.usage = nodeUsageData;
    console.log('this is nodeUsageData in allocatableCapacity controller', nodeUsageData);
    return next();
  } catch(err) {
    return next({
      log: 'Error caught in k8sController allocatableCapacity',
      err,
      status: 400, 
      message: {
        err: `An error occurred when fetching usage info from the k8sApi. Error: ${err.message}`
      }
    });
  }
}

module.exports = k8sController;

/*

{
    "nodes": [
        {
            "name": "minikube",
            "creationTimestamp": "2023-09-13T12:16:15.000Z",
            "uid": "03b017a9-367f-4826-bd4d-b86d719049b9",
            "labels": {
                "beta.kubernetes.io/arch": "amd64",
                "beta.kubernetes.io/os": "linux",
                "kubernetes.io/arch": "amd64",
                "kubernetes.io/hostname": "minikube",
                "kubernetes.io/os": "linux",
                "minikube.k8s.io/commit": "fd7ecd9c4599bef9f04c0986c4a0187f98a4396e",
                "minikube.k8s.io/name": "minikube",
                "minikube.k8s.io/primary": "true",
                "minikube.k8s.io/updated_at": "2023_09_13T08_16_26_0700",
                "minikube.k8s.io/version": "v1.31.2",
                "node-role.kubernetes.io/control-plane": "",
                "node.kubernetes.io/exclude-from-external-load-balancers": ""
            },
            "status": {
                "addresses": [
                    {
                        "address": "192.168.49.2",
                        "type": "InternalIP"
                    },
                    {
                        "address": "minikube",
                        "type": "Hostname"
                    }
                ],
                "allocatable": {
                    "cpu": "2",
                    "ephemeral-storage": "61202244Ki",
                    "hugepages-2Mi": "0",
                    "memory": "8048516Ki",
                    "pods": "110"
                },
                "capacity": {
                    "cpu": "2",
                    "ephemeral-storage": "61202244Ki",
                    "hugepages-2Mi": "0",
                    "memory": "8048516Ki",
                    "pods": "110"
                },
                "conditions": [
                    {
                        "lastHeartbeatTime": "2023-09-13T12:32:06.000Z",
                        "lastTransitionTime": "2023-09-13T12:16:14.000Z",
                        "message": "kubelet has sufficient memory available",
                        "reason": "KubeletHasSufficientMemory",
                        "status": "False",
                        "type": "MemoryPressure"
                    },
                    {
                        "lastHeartbeatTime": "2023-09-13T12:32:06.000Z",
                        "lastTransitionTime": "2023-09-13T12:16:14.000Z",
                        "message": "kubelet has no disk pressure",
                        "reason": "KubeletHasNoDiskPressure",
                        "status": "False",
                        "type": "DiskPressure"
                    },
                    {
                        "lastHeartbeatTime": "2023-09-13T12:32:06.000Z",
                        "lastTransitionTime": "2023-09-13T12:16:14.000Z",
                        "message": "kubelet has sufficient PID available",
                        "reason": "KubeletHasSufficientPID",
                        "status": "False",
                        "type": "PIDPressure"
                    },
                    {
                        "lastHeartbeatTime": "2023-09-13T12:32:06.000Z",
                        "lastTransitionTime": "2023-09-13T12:16:25.000Z",
                        "message": "kubelet is posting ready status",
                        "reason": "KubeletReady",
                        "status": "True",
                        "type": "Ready"
                    }
                ],
                "daemonEndpoints": {
                    "kubeletEndpoint": {
                        "Port": 10250
                    }
                },
                "images": [
                    {
                        "names": [
                            "registry.k8s.io/etcd@sha256:51eae8381dcb1078289fa7b4f3df2630cdc18d09fb56f8e56b41c40e191d6c83",
                            "registry.k8s.io/etcd:3.5.7-0"
                        ],
                        "sizeBytes": 295724043
                    },
                    {
                        "names": [
                            "registry.k8s.io/kube-apiserver@sha256:697cd88d94f7f2ef42144cb3072b016dcb2e9251f0e7d41a7fede557e555452d",
                            "registry.k8s.io/kube-apiserver:v1.27.4"
                        ],
                        "sizeBytes": 120653626
                    },
                    {
                        "names": [
                            "registry.k8s.io/kube-controller-manager@sha256:6286e500782ad6d0b37a1b8be57fc73f597dc931dfc73ff18ce534059803b265",
                            "registry.k8s.io/kube-controller-manager:v1.27.4"
                        ],
                        "sizeBytes": 112507033
                    },
                    {
                        "names": [
                            "registry.k8s.io/kube-proxy@sha256:4bcb707da9898d2625f5d4edc6d0c96519a24f16db914fc673aa8f97e41dbabf",
                            "registry.k8s.io/kube-proxy:v1.27.4"
                        ],
                        "sizeBytes": 71122088
                    },
                    {
                        "names": [
                            "registry.k8s.io/kube-scheduler@sha256:5897d7a97d23dce25cbf36fcd6e919180a8ef904bf5156583ffdb6a733ab04af",
                            "registry.k8s.io/kube-scheduler:v1.27.4"
                        ],
                        "sizeBytes": 58390668
                    },
                    {
                        "names": [
                            "registry.k8s.io/coredns/coredns@sha256:a0ead06651cf580044aeb0a0feba63591858fb2e43ade8c9dea45a6a89ae7e5e",
                            "registry.k8s.io/coredns/coredns:v1.10.1"
                        ],
                        "sizeBytes": 53612153
                    },
                    {
                        "names": [
                            "gcr.io/k8s-minikube/storage-provisioner@sha256:18eb69d1418e854ad5a19e399310e52808a8321e4c441c1dddad8977a0d7a944",
                            "gcr.io/k8s-minikube/storage-provisioner:v5"
                        ],
                        "sizeBytes": 31465472
                    },
                    {
                        "names": [
                            "registry.k8s.io/pause@sha256:7031c1b283388d2c2e09b57badb803c05ebed362dc88d84b480cc47f72a21097",
                            "registry.k8s.io/pause:3.9"
                        ],
                        "sizeBytes": 743952
                    }
                ],
                "nodeInfo": {
                    "architecture": "amd64",
                    "bootID": "33bfa64e-4e01-4372-b199-5f4c9940baad",
                    "containerRuntimeVersion": "docker://24.0.4",
                    "kernelVersion": "5.15.49-linuxkit-pr",
                    "kubeProxyVersion": "v1.27.4",
                    "kubeletVersion": "v1.27.4",
                    "machineID": "94e2e64d19cc417681d49158d95cadf5",
                    "operatingSystem": "linux",
                    "osImage": "Ubuntu 22.04.2 LTS",
                    "systemUUID": "94e2e64d19cc417681d49158d95cadf5"
                }
            }
        }
    ],
    "pods": [
        {
            "name": "coredns-5d78c9869d-ww9gd",
            "namespace": "kube-system",
            "uid": "40852688-7d60-426c-bf08-5f63b23fb37e",
            "creationTimestamp": "2023-09-13T12:16:42.000Z",
            "labels": {
                "k8s-app": "kube-dns",
                "pod-template-hash": "5d78c9869d"
            },
            "nodeName": "minikube",
            "containers": [
                {
                    "args": [
                        "-conf",
                        "/etc/coredns/Corefile"
                    ],
                    "image": "registry.k8s.io/coredns/coredns:v1.10.1",
                    "imagePullPolicy": "IfNotPresent",
                    "livenessProbe": {
                        "failureThreshold": 5,
                        "httpGet": {
                            "path": "/health",
                            "port": 8080,
                            "scheme": "HTTP"
                        },
                        "initialDelaySeconds": 60,
                        "periodSeconds": 10,
                        "successThreshold": 1,
                        "timeoutSeconds": 5
                    },
                    "name": "coredns",
                    "ports": [
                        {
                            "containerPort": 53,
                            "name": "dns",
                            "protocol": "UDP"
                        },
                        {
                            "containerPort": 53,
                            "name": "dns-tcp",
                            "protocol": "TCP"
                        },
                        {
                            "containerPort": 9153,
                            "name": "metrics",
                            "protocol": "TCP"
                        }
                    ],
                    "readinessProbe": {
                        "failureThreshold": 3,
                        "httpGet": {
                            "path": "/ready",
                            "port": 8181,
                            "scheme": "HTTP"
                        },
                        "periodSeconds": 10,
                        "successThreshold": 1,
                        "timeoutSeconds": 1
                    },
                    "resources": {
                        "limits": {
                            "memory": "170Mi"
                        },
                        "requests": {
                            "cpu": "100m",
                            "memory": "70Mi"
                        }
                    },
                    "securityContext": {
                        "allowPrivilegeEscalation": false,
                        "capabilities": {
                            "add": [
                                "NET_BIND_SERVICE"
                            ],
                            "drop": [
                                "all"
                            ]
                        },
                        "readOnlyRootFilesystem": true
                    },
                    "terminationMessagePath": "/dev/termination-log",
                    "terminationMessagePolicy": "File",
                    "volumeMounts": [
                        {
                            "mountPath": "/etc/coredns",
                            "name": "config-volume",
                            "readOnly": true
                        },
                        {
                            "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount",
                            "name": "kube-api-access-jbw95",
                            "readOnly": true
                        }
                    ]
                }
            ],
            "serviceAccount": "coredns",
            "conditions": [
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:43.000Z",
                    "status": "True",
                    "type": "Initialized"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:53.000Z",
                    "status": "True",
                    "type": "Ready"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:53.000Z",
                    "status": "True",
                    "type": "ContainersReady"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:43.000Z",
                    "status": "True",
                    "type": "PodScheduled"
                }
            ],
            "containerStatuses": [
                {
                    "containerID": "docker://381f9edc0884322b69b428fb2d7d087bc1c932cde96b1b1b18f226a7ead7df79",
                    "image": "registry.k8s.io/coredns/coredns:v1.10.1",
                    "imageID": "docker-pullable://registry.k8s.io/coredns/coredns@sha256:a0ead06651cf580044aeb0a0feba63591858fb2e43ade8c9dea45a6a89ae7e5e",
                    "lastState": {},
                    "name": "coredns",
                    "ready": true,
                    "restartCount": 0,
                    "started": true,
                    "state": {
                        "running": {
                            "startedAt": "2023-09-13T12:16:50.000Z"
                        }
                    }
                }
            ],
            "phase": "Running",
            "podIP": "10.244.0.2"
        },
        {
            "name": "etcd-minikube",
            "namespace": "kube-system",
            "uid": "8ef32248-0a4d-4f85-84db-3a0cc40d2bf1",
            "creationTimestamp": "2023-09-13T12:16:26.000Z",
            "labels": {
                "component": "etcd",
                "tier": "control-plane"
            },
            "nodeName": "minikube",
            "containers": [
                {
                    "command": [
                        "etcd",
                        "--advertise-client-urls=https://192.168.49.2:2379",
                        "--cert-file=/var/lib/minikube/certs/etcd/server.crt",
                        "--client-cert-auth=true",
                        "--data-dir=/var/lib/minikube/etcd",
                        "--experimental-initial-corrupt-check=true",
                        "--experimental-watch-progress-notify-interval=5s",
                        "--initial-advertise-peer-urls=https://192.168.49.2:2380",
                        "--initial-cluster=minikube=https://192.168.49.2:2380",
                        "--key-file=/var/lib/minikube/certs/etcd/server.key",
                        "--listen-client-urls=https://127.0.0.1:2379,https://192.168.49.2:2379",
                        "--listen-metrics-urls=http://127.0.0.1:2381",
                        "--listen-peer-urls=https://192.168.49.2:2380",
                        "--name=minikube",
                        "--peer-cert-file=/var/lib/minikube/certs/etcd/peer.crt",
                        "--peer-client-cert-auth=true",
                        "--peer-key-file=/var/lib/minikube/certs/etcd/peer.key",
                        "--peer-trusted-ca-file=/var/lib/minikube/certs/etcd/ca.crt",
                        "--proxy-refresh-interval=70000",
                        "--snapshot-count=10000",
                        "--trusted-ca-file=/var/lib/minikube/certs/etcd/ca.crt"
                    ],
                    "image": "registry.k8s.io/etcd:3.5.7-0",
                    "imagePullPolicy": "IfNotPresent",
                    "livenessProbe": {
                        "failureThreshold": 8,
                        "httpGet": {
                            "host": "127.0.0.1",
                            "path": "/health?exclude=NOSPACE&serializable=true",
                            "port": 2381,
                            "scheme": "HTTP"
                        },
                        "initialDelaySeconds": 10,
                        "periodSeconds": 10,
                        "successThreshold": 1,
                        "timeoutSeconds": 15
                    },
                    "name": "etcd",
                    "resources": {
                        "requests": {
                            "cpu": "100m",
                            "memory": "100Mi"
                        }
                    },
                    "startupProbe": {
                        "failureThreshold": 24,
                        "httpGet": {
                            "host": "127.0.0.1",
                            "path": "/health?serializable=false",
                            "port": 2381,
                            "scheme": "HTTP"
                        },
                        "initialDelaySeconds": 10,
                        "periodSeconds": 10,
                        "successThreshold": 1,
                        "timeoutSeconds": 15
                    },
                    "terminationMessagePath": "/dev/termination-log",
                    "terminationMessagePolicy": "File",
                    "volumeMounts": [
                        {
                            "mountPath": "/var/lib/minikube/etcd",
                            "name": "etcd-data"
                        },
                        {
                            "mountPath": "/var/lib/minikube/certs/etcd",
                            "name": "etcd-certs"
                        }
                    ]
                }
            ],
            "conditions": [
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:25.000Z",
                    "status": "True",
                    "type": "Initialized"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:33.000Z",
                    "status": "True",
                    "type": "Ready"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:33.000Z",
                    "status": "True",
                    "type": "ContainersReady"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:25.000Z",
                    "status": "True",
                    "type": "PodScheduled"
                }
            ],
            "containerStatuses": [
                {
                    "containerID": "docker://c376067b1cb2c836bb7967f4cd8f57cfa9e9583232d7b75775e848251bdba44d",
                    "image": "registry.k8s.io/etcd:3.5.7-0",
                    "imageID": "docker-pullable://registry.k8s.io/etcd@sha256:51eae8381dcb1078289fa7b4f3df2630cdc18d09fb56f8e56b41c40e191d6c83",
                    "lastState": {},
                    "name": "etcd",
                    "ready": true,
                    "restartCount": 0,
                    "started": true,
                    "state": {
                        "running": {
                            "startedAt": "2023-09-13T12:15:51.000Z"
                        }
                    }
                }
            ],
            "phase": "Running",
            "podIP": "192.168.49.2"
        },
        {
            "name": "kube-apiserver-minikube",
            "namespace": "kube-system",
            "uid": "7d77cb36-6f1d-4ad8-8c23-306befaeb1d3",
            "creationTimestamp": "2023-09-13T12:16:26.000Z",
            "labels": {
                "component": "kube-apiserver",
                "tier": "control-plane"
            },
            "nodeName": "minikube",
            "containers": [
                {
                    "command": [
                        "kube-apiserver",
                        "--advertise-address=192.168.49.2",
                        "--allow-privileged=true",
                        "--authorization-mode=Node,RBAC",
                        "--client-ca-file=/var/lib/minikube/certs/ca.crt",
                        "--enable-admission-plugins=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,NodeRestriction,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota",
                        "--enable-bootstrap-token-auth=true",
                        "--etcd-cafile=/var/lib/minikube/certs/etcd/ca.crt",
                        "--etcd-certfile=/var/lib/minikube/certs/apiserver-etcd-client.crt",
                        "--etcd-keyfile=/var/lib/minikube/certs/apiserver-etcd-client.key",
                        "--etcd-servers=https://127.0.0.1:2379",
                        "--kubelet-client-certificate=/var/lib/minikube/certs/apiserver-kubelet-client.crt",
                        "--kubelet-client-key=/var/lib/minikube/certs/apiserver-kubelet-client.key",
                        "--kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname",
                        "--proxy-client-cert-file=/var/lib/minikube/certs/front-proxy-client.crt",
                        "--proxy-client-key-file=/var/lib/minikube/certs/front-proxy-client.key",
                        "--requestheader-allowed-names=front-proxy-client",
                        "--requestheader-client-ca-file=/var/lib/minikube/certs/front-proxy-ca.crt",
                        "--requestheader-extra-headers-prefix=X-Remote-Extra-",
                        "--requestheader-group-headers=X-Remote-Group",
                        "--requestheader-username-headers=X-Remote-User",
                        "--secure-port=8443",
                        "--service-account-issuer=https://kubernetes.default.svc.cluster.local",
                        "--service-account-key-file=/var/lib/minikube/certs/sa.pub",
                        "--service-account-signing-key-file=/var/lib/minikube/certs/sa.key",
                        "--service-cluster-ip-range=10.96.0.0/12",
                        "--tls-cert-file=/var/lib/minikube/certs/apiserver.crt",
                        "--tls-private-key-file=/var/lib/minikube/certs/apiserver.key"
                    ],
                    "image": "registry.k8s.io/kube-apiserver:v1.27.4",
                    "imagePullPolicy": "IfNotPresent",
                    "livenessProbe": {
                        "failureThreshold": 8,
                        "httpGet": {
                            "host": "192.168.49.2",
                            "path": "/livez",
                            "port": 8443,
                            "scheme": "HTTPS"
                        },
                        "initialDelaySeconds": 10,
                        "periodSeconds": 10,
                        "successThreshold": 1,
                        "timeoutSeconds": 15
                    },
                    "name": "kube-apiserver",
                    "readinessProbe": {
                        "failureThreshold": 3,
                        "httpGet": {
                            "host": "192.168.49.2",
                            "path": "/readyz",
                            "port": 8443,
                            "scheme": "HTTPS"
                        },
                        "periodSeconds": 1,
                        "successThreshold": 1,
                        "timeoutSeconds": 15
                    },
                    "resources": {
                        "requests": {
                            "cpu": "250m"
                        }
                    },
                    "startupProbe": {
                        "failureThreshold": 24,
                        "httpGet": {
                            "host": "192.168.49.2",
                            "path": "/livez",
                            "port": 8443,
                            "scheme": "HTTPS"
                        },
                        "initialDelaySeconds": 10,
                        "periodSeconds": 10,
                        "successThreshold": 1,
                        "timeoutSeconds": 15
                    },
                    "terminationMessagePath": "/dev/termination-log",
                    "terminationMessagePolicy": "File",
                    "volumeMounts": [
                        {
                            "mountPath": "/etc/ssl/certs",
                            "name": "ca-certs",
                            "readOnly": true
                        },
                        {
                            "mountPath": "/etc/ca-certificates",
                            "name": "etc-ca-certificates",
                            "readOnly": true
                        },
                        {
                            "mountPath": "/var/lib/minikube/certs",
                            "name": "k8s-certs",
                            "readOnly": true
                        },
                        {
                            "mountPath": "/usr/local/share/ca-certificates",
                            "name": "usr-local-share-ca-certificates",
                            "readOnly": true
                        },
                        {
                            "mountPath": "/usr/share/ca-certificates",
                            "name": "usr-share-ca-certificates",
                            "readOnly": true
                        }
                    ]
                }
            ],
            "conditions": [
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:25.000Z",
                    "status": "True",
                    "type": "Initialized"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:32.000Z",
                    "status": "True",
                    "type": "Ready"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:32.000Z",
                    "status": "True",
                    "type": "ContainersReady"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:25.000Z",
                    "status": "True",
                    "type": "PodScheduled"
                }
            ],
            "containerStatuses": [
                {
                    "containerID": "docker://9ac7afc8a53d2f41bc781bdde3de98c12c53a382dd0b740e68fead9c7d675826",
                    "image": "registry.k8s.io/kube-apiserver:v1.27.4",
                    "imageID": "docker-pullable://registry.k8s.io/kube-apiserver@sha256:697cd88d94f7f2ef42144cb3072b016dcb2e9251f0e7d41a7fede557e555452d",
                    "lastState": {},
                    "name": "kube-apiserver",
                    "ready": true,
                    "restartCount": 0,
                    "started": true,
                    "state": {
                        "running": {
                            "startedAt": "2023-09-13T12:15:50.000Z"
                        }
                    }
                }
            ],
            "phase": "Running",
            "podIP": "192.168.49.2"
        },
        {
            "name": "kube-controller-manager-minikube",
            "namespace": "kube-system",
            "uid": "957c83dd-cda3-47d2-8f49-cea7f6847f87",
            "creationTimestamp": "2023-09-13T12:16:25.000Z",
            "labels": {
                "component": "kube-controller-manager",
                "tier": "control-plane"
            },
            "nodeName": "minikube",
            "containers": [
                {
                    "command": [
                        "kube-controller-manager",
                        "--allocate-node-cidrs=true",
                        "--authentication-kubeconfig=/etc/kubernetes/controller-manager.conf",
                        "--authorization-kubeconfig=/etc/kubernetes/controller-manager.conf",
                        "--bind-address=127.0.0.1",
                        "--client-ca-file=/var/lib/minikube/certs/ca.crt",
                        "--cluster-cidr=10.244.0.0/16",
                        "--cluster-name=mk",
                        "--cluster-signing-cert-file=/var/lib/minikube/certs/ca.crt",
                        "--cluster-signing-key-file=/var/lib/minikube/certs/ca.key",
                        "--controllers=*,bootstrapsigner,tokencleaner",
                        "--kubeconfig=/etc/kubernetes/controller-manager.conf",
                        "--leader-elect=false",
                        "--requestheader-client-ca-file=/var/lib/minikube/certs/front-proxy-ca.crt",
                        "--root-ca-file=/var/lib/minikube/certs/ca.crt",
                        "--service-account-private-key-file=/var/lib/minikube/certs/sa.key",
                        "--service-cluster-ip-range=10.96.0.0/12",
                        "--use-service-account-credentials=true"
                    ],
                    "image": "registry.k8s.io/kube-controller-manager:v1.27.4",
                    "imagePullPolicy": "IfNotPresent",
                    "livenessProbe": {
                        "failureThreshold": 8,
                        "httpGet": {
                            "host": "127.0.0.1",
                            "path": "/healthz",
                            "port": 10257,
                            "scheme": "HTTPS"
                        },
                        "initialDelaySeconds": 10,
                        "periodSeconds": 10,
                        "successThreshold": 1,
                        "timeoutSeconds": 15
                    },
                    "name": "kube-controller-manager",
                    "resources": {
                        "requests": {
                            "cpu": "200m"
                        }
                    },
                    "startupProbe": {
                        "failureThreshold": 24,
                        "httpGet": {
                            "host": "127.0.0.1",
                            "path": "/healthz",
                            "port": 10257,
                            "scheme": "HTTPS"
                        },
                        "initialDelaySeconds": 10,
                        "periodSeconds": 10,
                        "successThreshold": 1,
                        "timeoutSeconds": 15
                    },
                    "terminationMessagePath": "/dev/termination-log",
                    "terminationMessagePolicy": "File",
                    "volumeMounts": [
                        {
                            "mountPath": "/etc/ssl/certs",
                            "name": "ca-certs",
                            "readOnly": true
                        },
                        {
                            "mountPath": "/etc/ca-certificates",
                            "name": "etc-ca-certificates",
                            "readOnly": true
                        },
                        {
                            "mountPath": "/usr/libexec/kubernetes/kubelet-plugins/volume/exec",
                            "name": "flexvolume-dir"
                        },
                        {
                            "mountPath": "/var/lib/minikube/certs",
                            "name": "k8s-certs",
                            "readOnly": true
                        },
                        {
                            "mountPath": "/etc/kubernetes/controller-manager.conf",
                            "name": "kubeconfig",
                            "readOnly": true
                        },
                        {
                            "mountPath": "/usr/local/share/ca-certificates",
                            "name": "usr-local-share-ca-certificates",
                            "readOnly": true
                        },
                        {
                            "mountPath": "/usr/share/ca-certificates",
                            "name": "usr-share-ca-certificates",
                            "readOnly": true
                        }
                    ]
                }
            ],
            "conditions": [
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:25.000Z",
                    "status": "True",
                    "type": "Initialized"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:33.000Z",
                    "status": "True",
                    "type": "Ready"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:33.000Z",
                    "status": "True",
                    "type": "ContainersReady"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:25.000Z",
                    "status": "True",
                    "type": "PodScheduled"
                }
            ],
            "containerStatuses": [
                {
                    "containerID": "docker://30a8e9da6be7bc6e7c0c9afdb802931b2ca94186705c6f2bba67f9d369d558b2",
                    "image": "registry.k8s.io/kube-controller-manager:v1.27.4",
                    "imageID": "docker-pullable://registry.k8s.io/kube-controller-manager@sha256:6286e500782ad6d0b37a1b8be57fc73f597dc931dfc73ff18ce534059803b265",
                    "lastState": {},
                    "name": "kube-controller-manager",
                    "ready": true,
                    "restartCount": 0,
                    "started": true,
                    "state": {
                        "running": {
                            "startedAt": "2023-09-13T12:15:51.000Z"
                        }
                    }
                }
            ],
            "phase": "Running",
            "podIP": "192.168.49.2"
        },
        {
            "name": "kube-proxy-sdcrs",
            "namespace": "kube-system",
            "uid": "0ed61e04-cc1c-4db3-ab4c-0d07ada7963d",
            "creationTimestamp": "2023-09-13T12:16:41.000Z",
            "labels": {
                "controller-revision-hash": "86cc8bcbf7",
                "k8s-app": "kube-proxy",
                "pod-template-generation": "1"
            },
            "nodeName": "minikube",
            "containers": [
                {
                    "command": [
                        "/usr/local/bin/kube-proxy",
                        "--config=/var/lib/kube-proxy/config.conf",
                        "--hostname-override=$(NODE_NAME)"
                    ],
                    "env": [
                        {
                            "name": "NODE_NAME",
                            "valueFrom": {
                                "fieldRef": {
                                    "apiVersion": "v1",
                                    "fieldPath": "spec.nodeName"
                                }
                            }
                        }
                    ],
                    "image": "registry.k8s.io/kube-proxy:v1.27.4",
                    "imagePullPolicy": "IfNotPresent",
                    "name": "kube-proxy",
                    "resources": {},
                    "securityContext": {
                        "privileged": true
                    },
                    "terminationMessagePath": "/dev/termination-log",
                    "terminationMessagePolicy": "File",
                    "volumeMounts": [
                        {
                            "mountPath": "/var/lib/kube-proxy",
                            "name": "kube-proxy"
                        },
                        {
                            "mountPath": "/run/xtables.lock",
                            "name": "xtables-lock"
                        },
                        {
                            "mountPath": "/lib/modules",
                            "name": "lib-modules",
                            "readOnly": true
                        },
                        {
                            "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount",
                            "name": "kube-api-access-fphwt",
                            "readOnly": true
                        }
                    ]
                }
            ],
            "serviceAccount": "kube-proxy",
            "conditions": [
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:42.000Z",
                    "status": "True",
                    "type": "Initialized"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:48.000Z",
                    "status": "True",
                    "type": "Ready"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:48.000Z",
                    "status": "True",
                    "type": "ContainersReady"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:42.000Z",
                    "status": "True",
                    "type": "PodScheduled"
                }
            ],
            "containerStatuses": [
                {
                    "containerID": "docker://77f3f27ee56c646ce3dd3f1167f3758adfea5d29c8938e69ace5cdb732257b17",
                    "image": "registry.k8s.io/kube-proxy:v1.27.4",
                    "imageID": "docker-pullable://registry.k8s.io/kube-proxy@sha256:4bcb707da9898d2625f5d4edc6d0c96519a24f16db914fc673aa8f97e41dbabf",
                    "lastState": {},
                    "name": "kube-proxy",
                    "ready": true,
                    "restartCount": 0,
                    "started": true,
                    "state": {
                        "running": {
                            "startedAt": "2023-09-13T12:16:48.000Z"
                        }
                    }
                }
            ],
            "phase": "Running",
            "podIP": "192.168.49.2"
        },
        {
            "name": "kube-scheduler-minikube",
            "namespace": "kube-system",
            "uid": "ea121d7d-22ef-473c-83c8-f402a761ff13",
            "creationTimestamp": "2023-09-13T12:16:25.000Z",
            "labels": {
                "component": "kube-scheduler",
                "tier": "control-plane"
            },
            "nodeName": "minikube",
            "containers": [
                {
                    "command": [
                        "kube-scheduler",
                        "--authentication-kubeconfig=/etc/kubernetes/scheduler.conf",
                        "--authorization-kubeconfig=/etc/kubernetes/scheduler.conf",
                        "--bind-address=127.0.0.1",
                        "--kubeconfig=/etc/kubernetes/scheduler.conf",
                        "--leader-elect=false"
                    ],
                    "image": "registry.k8s.io/kube-scheduler:v1.27.4",
                    "imagePullPolicy": "IfNotPresent",
                    "livenessProbe": {
                        "failureThreshold": 8,
                        "httpGet": {
                            "host": "127.0.0.1",
                            "path": "/healthz",
                            "port": 10259,
                            "scheme": "HTTPS"
                        },
                        "initialDelaySeconds": 10,
                        "periodSeconds": 10,
                        "successThreshold": 1,
                        "timeoutSeconds": 15
                    },
                    "name": "kube-scheduler",
                    "resources": {
                        "requests": {
                            "cpu": "100m"
                        }
                    },
                    "startupProbe": {
                        "failureThreshold": 24,
                        "httpGet": {
                            "host": "127.0.0.1",
                            "path": "/healthz",
                            "port": 10259,
                            "scheme": "HTTPS"
                        },
                        "initialDelaySeconds": 10,
                        "periodSeconds": 10,
                        "successThreshold": 1,
                        "timeoutSeconds": 15
                    },
                    "terminationMessagePath": "/dev/termination-log",
                    "terminationMessagePolicy": "File",
                    "volumeMounts": [
                        {
                            "mountPath": "/etc/kubernetes/scheduler.conf",
                            "name": "kubeconfig",
                            "readOnly": true
                        }
                    ]
                }
            ],
            "conditions": [
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:25.000Z",
                    "status": "True",
                    "type": "Initialized"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:32.000Z",
                    "status": "True",
                    "type": "Ready"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:32.000Z",
                    "status": "True",
                    "type": "ContainersReady"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:25.000Z",
                    "status": "True",
                    "type": "PodScheduled"
                }
            ],
            "containerStatuses": [
                {
                    "containerID": "docker://4b1795b1275f7d71a911b73789016487bdada2e84d09de7a35663b7ad9c1af56",
                    "image": "registry.k8s.io/kube-scheduler:v1.27.4",
                    "imageID": "docker-pullable://registry.k8s.io/kube-scheduler@sha256:5897d7a97d23dce25cbf36fcd6e919180a8ef904bf5156583ffdb6a733ab04af",
                    "lastState": {},
                    "name": "kube-scheduler",
                    "ready": true,
                    "restartCount": 0,
                    "started": true,
                    "state": {
                        "running": {
                            "startedAt": "2023-09-13T12:15:52.000Z"
                        }
                    }
                }
            ],
            "phase": "Running",
            "podIP": "192.168.49.2"
        },
        {
            "name": "storage-provisioner",
            "namespace": "kube-system",
            "uid": "7cc8f6f3-2ff6-43e3-a37a-280378f07b17",
            "creationTimestamp": "2023-09-13T12:16:50.000Z",
            "labels": {
                "addonmanager.kubernetes.io/mode": "Reconcile",
                "integration-test": "storage-provisioner"
            },
            "nodeName": "minikube",
            "containers": [
                {
                    "command": [
                        "/storage-provisioner"
                    ],
                    "image": "gcr.io/k8s-minikube/storage-provisioner:v5",
                    "imagePullPolicy": "IfNotPresent",
                    "name": "storage-provisioner",
                    "resources": {},
                    "terminationMessagePath": "/dev/termination-log",
                    "terminationMessagePolicy": "File",
                    "volumeMounts": [
                        {
                            "mountPath": "/tmp",
                            "name": "tmp"
                        },
                        {
                            "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount",
                            "name": "kube-api-access-rjb5t",
                            "readOnly": true
                        }
                    ]
                }
            ],
            "serviceAccount": "storage-provisioner",
            "conditions": [
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:50.000Z",
                    "status": "True",
                    "type": "Initialized"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:33:39.000Z",
                    "status": "True",
                    "type": "Ready"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:33:39.000Z",
                    "status": "True",
                    "type": "ContainersReady"
                },
                {
                    "lastProbeTime": null,
                    "lastTransitionTime": "2023-09-13T12:16:50.000Z",
                    "status": "True",
                    "type": "PodScheduled"
                }
            ],
            "containerStatuses": [
                {
                    "containerID": "docker://f0c9d1d02f3c98b365ec14d93b641ce8c3719d5da6b426d97a06cbd9f4ea3959",
                    "image": "gcr.io/k8s-minikube/storage-provisioner:v5",
                    "imageID": "docker-pullable://gcr.io/k8s-minikube/storage-provisioner@sha256:18eb69d1418e854ad5a19e399310e52808a8321e4c441c1dddad8977a0d7a944",
                    "lastState": {
                        "terminated": {
                            "containerID": "docker://0e035141fd5b54114bd8169e2858796445c4473d2b5e39b7dd38c48d330c9fd4",
                            "exitCode": 255,
                            "finishedAt": "2023-09-13T12:33:23.000Z",
                            "reason": "Error",
                            "startedAt": "2023-09-13T12:16:52.000Z"
                        }
                    },
                    "name": "storage-provisioner",
                    "ready": true,
                    "restartCount": 1,
                    "started": true,
                    "state": {
                        "running": {
                            "startedAt": "2023-09-13T12:33:38.000Z"
                        }
                    }
                }
            ],
            "phase": "Running",
            "podIP": "192.168.49.2"
        }
    ],
    "namespaces": [
        {
            "name": "default",
            "uid": "55333ff2-133f-499b-8c6b-cfa6bdca3c72",
            "creationTimestamp": "2023-09-13T12:16:15.000Z",
            "labels": {
                "kubernetes.io/metadata.name": "default"
            },
            "phase": "Active",
            "nodeName": ""
        },
        {
            "name": "kube-node-lease",
            "uid": "182e850e-e809-488e-ae8b-aea3298b7a48",
            "creationTimestamp": "2023-09-13T12:16:15.000Z",
            "labels": {
                "kubernetes.io/metadata.name": "kube-node-lease"
            },
            "phase": "Active",
            "nodeName": ""
        },
        {
            "name": "kube-public",
            "uid": "5f094858-a0ee-44e8-975b-a4b285c559f1",
            "creationTimestamp": "2023-09-13T12:16:15.000Z",
            "labels": {
                "kubernetes.io/metadata.name": "kube-public"
            },
            "phase": "Active",
            "nodeName": ""
        },
        {
            "name": "kube-system",
            "uid": "bbffaa98-c820-46e7-839e-ef14176b0f08",
            "creationTimestamp": "2023-09-13T12:16:15.000Z",
            "labels": {
                "kubernetes.io/metadata.name": "kube-system"
            },
            "phase": "Active",
            "nodeName": ""
        }
    ],
    "services": [
        {
            "name": "kubernetes",
            "namespace": "default",
            "uid": "0d491f5d-ce16-4075-b44a-43776a5157a7",
            "creationTimestamp": "2023-09-13T12:16:21.000Z",
            "labels": {
                "component": "apiserver",
                "provider": "kubernetes"
            },
            "ports": [
                {
                    "name": "https",
                    "port": 443,
                    "protocol": "TCP",
                    "targetPort": 8443
                }
            ],
            "loadBalancer": {},
            "clusterIP": "10.96.0.1"
        },
        {
            "name": "kube-dns",
            "namespace": "kube-system",
            "uid": "32bf078c-1658-4651-b964-ecfedd31893d",
            "creationTimestamp": "2023-09-13T12:16:24.000Z",
            "labels": {
                "k8s-app": "kube-dns",
                "kubernetes.io/cluster-service": "true",
                "kubernetes.io/name": "CoreDNS"
            },
            "ports": [
                {
                    "name": "dns",
                    "port": 53,
                    "protocol": "UDP",
                    "targetPort": 53
                },
                {
                    "name": "dns-tcp",
                    "port": 53,
                    "protocol": "TCP",
                    "targetPort": 53
                },
                {
                    "name": "metrics",
                    "port": 9153,
                    "protocol": "TCP",
                    "targetPort": 9153
                }
            ],
            "loadBalancer": {},
            "clusterIP": "10.96.0.10"
        }
    ],
    "deployments": [
        {
            "name": "coredns",
            "namespace": "kube-system",
            "uid": "d500d0eb-3030-4a26-b30d-ff76869f5c7c",
            "creationTimestamp": "2023-09-13T12:16:24.000Z",
            "labels": {
                "k8s-app": "kube-dns"
            },
            "replicas": 1
        }
    ]
}



*/