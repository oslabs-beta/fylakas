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

const VisualizationItem = ({dates, points, name}) => {

  const options = {
    animation: false,
    tension: 0.5,
    pointRadius: 0,
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

  const labels = [dates[0]];
  for (let i = 2; i < dates.length; i++) labels.push('');
  labels.push(dates[dates.length - 1]);

  const data = {
    labels: labels,
    datasets: [
      {
        borderColor: 'rgb(191, 127, 255)',
        backgroundColor: 'rgb(191, 127, 255)',
        label: `Current ${name}`,
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