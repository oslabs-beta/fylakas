import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VisualizationItem = ({dates, points, name, color}) => {

  // Options object expected by react-chartjs 
  // The chartjs docs are wonderful (https://www.chartjs.org/docs/latest/)
  const options = {
    maintainAspectRatio: true,
    // Disable animations
    animation: false,
    // Keep the line optimally curvy
    tension: 0.5,
    // Remove hover points
    pointRadius: 0,
    // Declare data ranges and names for X and Y axes
    scales: {
      x: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: '% Usage'
        }
      }
    }
  };

  // Declare labels array to insert into data object
  const labels = [dates[0]];
  // Fill entirely with blank entries except for the first/last datapoint
  for (let i = 2; i < dates.length; i++) labels.push('');
  labels.push(dates[dates.length - 1]);

  // Data object expected by reach-chartjs
  const data = {
    labels: labels,
    datasets: [
      {
        borderColor: color,
        backgroundColor: color,
        label: `Current ${name}`,
        // Map the data from properties to the chart
        data: points.map((datapoint, index) => {
          return {x: index, y: datapoint};
        })
      }
    ]
  };

  return (
    <div className="col">
    <div className="card mb-4 rounded-3 shadow-sm">
      <div className="card-header py-3">
        <h4 className="my-0 fw-normal"><i>{name}</i></h4>
      </div>
      <div className="card-body">
        <Line options={options} data={data} />
      </div>
    </div>
  </div>
  );
};

export default VisualizationItem;