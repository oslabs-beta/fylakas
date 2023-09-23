const PromController = {};

PromController.cpuUsageByContainer = async function (req, res, next) {

// Prometheus server endpoint
const prometheusUrl = 'http://localhost:9090'; // Replace with your Prometheus server URL
// PromQL query
const query = 'container_cpu_usage_seconds_total'; // Replace with your desired PromQL query

// Construct the URL for the query
const queryUrl = `${prometheusUrl}/api/v1/query?query=${encodeURIComponent(query)}`;

try {
  const response = await fetch(queryUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }    
  });
  
  // Make sure to throw new Error, not return Error
  if (!response.ok) {
    console.log('Response to GET request to /messages was not ok');
    throw new Error('Response error');
  }

  const data = await response.json();
  console.log('Data returned from GET request to server', data);
  
  console.log('data to test:', data);
  res.locals.cpuUsage = data;

  return next();

} catch (error) {
  return next(error);
}
}

module.exports = PromController;