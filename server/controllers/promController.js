// Prometheus server endpoint
const prometheusUrl = 'http://localhost:9090'; // Replace with your Prometheus server URL

const PromController = {};

Promcontroller.cpuUsageByContainer = async function (req, res, next) {
// PromQL query
const query = 'sum by (container_name) (rate(container_cpu_usage_seconds_total[1m]))'; // Replace with your desired PromQL query

// Construct the URL for the query
const queryUrl = `${prometheusUrl}/api/v1/query?query=${encodeURIComponent(query)}`;

try {
  const response = await fetch(prometheusUrl);
  console.log('response to test:', response);
  
  return next();
} catch (error) {
  return next(error);
}

}

// Send the GET request to Prometheus
fetch(queryUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Handle the Prometheus query result here
    console.log('Query Result:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

