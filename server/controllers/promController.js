const db = require('../db/database.js');
const PromController = {};

// Prometheus server endpoint
const prometheusUrl = 'http://localhost:9090'; // Replace with your Prometheus server URL

PromController.getEndpoint = async (req, res, next) => {
  const { username } = res.locals;
  if (!res.locals.isLoggedIn) return next();
  try {
    // add endpoint query
    const userIdQuery = `SELECT user_id FROM public.users WHERE username = '${username}';`;
    const result = await db.query(userIdQuery);
    const userId = result.rows[0].user_id;
    const endpointQuery = `SELECT prom_url FROM public.clusters WHERE user_id = '${userId}';`;
    const endpoints = await db.query(endpointQuery);
    if (endpoints.rows[0] !== undefined) {
      res.locals.endpoint = endpoints.rows[endpoints.rows.length - 1].prom_url;
      console.log(`Fetching data from "${res.locals.endpoint}" for "${username}".`);
    } else {
      res.locals.isLoggedIn = false;
      console.log(`Cannot fetch data for "${username}" without a request URL.`);
    }
    return next();
  } catch (err) {
    return next({
      log: err,
      message: {err: 'Error occurred requesting endpoint for Prometheus.'},
    })
  }
}

PromController.getDate = function (req, res, next) {
  // if (!res.locals.isLoggedIn) return next();
  // console.log('PromController.getDate middleware invoked');
  try {
    res.locals.metrics = {};
    res.locals.metrics.date = Date.now();
    return next();
  } catch (err) {
    return next({
      log: err,
      message: { err: 'Error occurred adding timeStamp to metrics.' },
    });
  }
};

PromController.cpuUsageByContainer = async function (req, res, next) {
  if (!res.locals.isLoggedIn) return next();
  console.log('PromController.cpuUsageByContainer middleware invoked');
  // PromQL query
  const query =
    '(100 * sum(rate(node_cpu_seconds_total{mode="user"}[5m])) by (cluster)) / (sum(rate(node_cpu_seconds_total[5m])) by (cluster))';
  //'sum(rate(node_cpu_seconds_total{mode="user"}[5m])) by (cluster) * 100'; // Replace with your desired PromQL query

  // Construct the URL for the query
  const queryUrl = `${prometheusUrl}/api/v1/query?query=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Make sure to throw new Error, not return Error
    if (!response.ok) {
      console.log('Response to GET request to prometheus server was not ok');
      throw new Error('Response error');
    }

    const queryData = await response.json();
    // console.log(
    //   'Data returned from GET request to prometheus server',
    //   queryData
    // );

    // console.log('data to test:', queryData);
    if (queryData.data.result[0])
      res.locals.metrics.cpu = queryData.data.result[0].value[1];

    return next();
  } catch (err) {
    return next({
      log: err,
      message: { err: 'Error occurred adding cpuUsage to metrics.' },
    });
  }
};

// Get memory usage by container and add to the metrics object on res.locals
PromController.memoryUsageByContainer = async function (req, res, next) {
  if (!res.locals.isLoggedIn) return next();
  // declare specific query for memory usage for each container
  const query =
    '100 * sum(container_memory_usage_bytes) / sum(container_spec_memory_limit_bytes)';
  // 'container_memory_usage_bytes';
  // Construct the URL for the query
  const queryUrl = `${prometheusUrl}/api/v1/query?query=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    // if the response is not ok, throw a new error referencing this middleware
    if (!response.ok) {
      throw new Error(
        'Response error in PromController.memoryUsageByContainer'
      );
    }

    const queryData = await response.json();
    // console.log(queryData);
    // assign memoryUsageByContainer as a property on res.locals.metrics assigned to the data received from the fetch
    if (queryData.data.result[0])
      res.locals.metrics.mem = queryData.data.result[0].value[1];
    return next();
  } catch (err) {
    return next({
      log: err,
      message: { err: 'Error occurred adding memoryUsage to metrics.' },
    });
  }
};

PromController.networkTrafficByContainer = async function (req, res, next) {
  if (!res.locals.isLoggedIn) return next();
  // PromQL queries
  const receiveQuery =
    '(rate(container_network_receive_bytes_total[5m]) / 1e9) * 100';
  //'100 * rate(container_network_receive_bytes_total[5m])';
  const transmitQuery =
    '(rate(container_network_receive_bytes_total[5m]) / 1e9) * 100';
  // Construct the URL for the queries
  const receiveQueryUrl = `${prometheusUrl}/api/v1/query?query=${encodeURIComponent(
    receiveQuery
  )}`;
  const transmitQueryUrl = `${prometheusUrl}/api/v1/query?query=${encodeURIComponent(
    transmitQuery
  )}`;

  try {
    const [receiveResponse, transmitResponse] = await Promise.all([
      fetch(receiveQueryUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
      fetch(transmitQueryUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ]);

    // Check if both responses are OK
    if (!receiveResponse.ok || !transmitResponse.ok) {
      console.log('Response to GET request was not ok');
      throw new Error('Response error');
    }

    const [receiveData, transmitData] = await Promise.all([
      receiveResponse.json(),
      transmitResponse.json(),
    ]);

    // console.log('Received Data from server:', receiveData);
    // console.log('Transmitted Data from server:', transmitData);

    res.locals.metrics.networkTrafficByContainer = {
      received: receiveData,
      transmitted: transmitData,
    };

    return next();
  } catch (err) {
    return next({
      log: err,
      message: { err: 'Error occurred adding networkTraffic to metrics.' },
    });
  }
};

PromController.diskSpace = async function (req, res, next) {
  if (!res.locals.isLoggedIn) return next();
  //PromQL query for finding free space, gives percentage of available space on a pointed disk
  const query =
    //used disk space
    '100 - ((node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"} * 100) / node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"})';
  //free disk space
  // '100 * (node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"} / node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"})';
  //Construct the URL for the query
  const queryUrl = `${prometheusUrl}/api/v1/query?query=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    //Throw new error
    if (!response.ok) {
      console.log('Response to GET request to prometheus server was not ok');
      throw new Error('Response error');
    }

    const queryData = await response.json();
    // console.log(
    //   'Data returned from GET request to prometheus server',
    //   queryData
    // );

    // console.log('data to test:', queryResult);
    if (queryData.data.result[0])
      res.locals.metrics.disk = queryData.data.result[0].value[1];

    return next();
  } catch (err) {
    return next({
      log: err,
      message: { err: 'Error occurred adding diskSpace to metrics.' },
    });
  }
};

PromController.addEndpoint = async (req, res, next) => {
  const { promURL } = req.body
  const { username, isLoggedIn } = res.locals;
  if (!isLoggedIn) {
    res.locals.success = false;
    return next();
  }
  try {
    const userIdQuery = `SELECT user_id FROM public.users WHERE username = '${username}'`
    const result = await db.query(userIdQuery)
    const userId = result.rows[0].user_id;
    console.log(`Adding endpoint "${promURL}" for user "${username}".`);
    const endpointQuery = `INSERT INTO public.clusters (user_id, prom_url) VALUES ('${userId}', '${promURL}');`
    await db.query(endpointQuery);
    res.locals.success = true;
    return next();
  } catch (err) {
    return next({
      log: err,
      message: { err: 'Error occurred adding Prometheus endpoint to database.'}
    })
  }
}

module.exports = PromController;
