import React, { useEffect, useState } from 'react';
import VisualizationItem from './visualizerComponents/VisualizationItem.jsx';
import ConnectionModal from './Connection.jsx';

// Number of points of data to display per graph
const range = 60;
// Time to wait in between requests, in milliseconds
const delay = 15000;
// Use dummy data instead of requesting prometheus to test charts
const dummyData = false;

// Generates a readable HH:MM:SS string from a Date object (i.e., 14:20:54)
const zeroedDate = (date = new Date()) => {
  const timePieces = [date.getHours(), date.getMinutes(), date.getSeconds()];
  const zeroedTimePieces = timePieces.map((timePiece) => {
    return timePiece < 10 ? '0' + timePiece.toString() : timePiece.toString();
  });
  return `${zeroedTimePieces[0]}:${zeroedTimePieces[1]}:${zeroedTimePieces[2]}`;
};

// Removes the appropriate amount of time for first timestamp, in reference to the timerange
function subtractMinutes(date) {
  date.setMinutes(date.getMinutes() - range * delay / 60000);
  return date;
}

// Function for generating dummy data (it does math don't worry about it)
const convincingRandomDeviation = (num) => {
  return ((num / 100) * 3 + 0.1 ** Math.random()) * 25;
};

const VisualizerBox = ({ cluster }) => {

  // Declare an initialDate as the current time and subtracting appropriate minutes from it
  const initialDate = zeroedDate(subtractMinutes(new Date()));;

  // Initialize data as an array fitting the range of points
  // Fill the array with blank (zeroed) data points
  const [liveData, setLiveData] = useState(
    Array(range + 1).fill({ date: initialDate, cpu: 0, mem: 0, net: 0, disk: 0 }, 0, range + 1)
  );
  
  // Declare state for rendering the connection modal
  const [modalVisible, setModalVisible] = useState(false);

  // Handle opening/closing the modal
  const handleConnectClick = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Requests updates for all datapoints
  useEffect(() => {
    setTimeout(() => {
      // Create a copy of the existing liveData 
      const newData = liveData.slice();
      // If generating dummy data, push convincing random deviations of the previous datapoints to newData
      if (dummyData) {
        newData.push({
          date: zeroedDate(),
          cpu: convincingRandomDeviation(liveData[range].cpu),
          mem: convincingRandomDeviation(liveData[range].mem),
          net: convincingRandomDeviation(liveData[range].net),
          disk: convincingRandomDeviation(liveData[range].disk),
        });
      // If not, send request to prometheus for metrics
      } else {
        fetch('api/prom/metrics', {
          method: 'POST',
          body: JSON.stringify({ cluster: cluster }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => {
            if (response.ok) return response.json();
            // If request fails, imitate all previous datapoints
            return {
              date: zeroedDate(),
              cpu: liveData[range].cpu,
              mem: liveData[range].mem,
              net: liveData[range].net,
              disk: liveData[range].disk,
            }
          })
          .then((response) => {
            // If any values are missing from request, duplicate previous datapoint for that metric
            if (!response.cpu) response.cpu = liveData[range].cpu;
            if (!response.mem) response.mem = liveData[range].mem;
            if (!response.net) response.net = liveData[range].net;
            if (!response.disk) response.disk = liveData[range].disk;
            response.date = zeroedDate();
            // Push acquired data to the end of the newData array
            newData.push(response);
          })
          .catch(err => console.log(err));
      }
      // Trim the array down to the appropriate length, removing old data
      while (newData.length > range + 1) newData.shift();
      // Update the liveData object with the newData
      setLiveData(newData);
    }, delay);
    // This functionality loops every (delay) milliseconds
    // The following dependency ensures the recalling of this useEffect hook
  }, [liveData]);

  // Map the dates from liveData to their own array
  const dates = liveData.map((datapoint) => datapoint.date);

  // Pass down the relevant metric to each visualization item
  // Pass down dates to every visualization item
  // Pass down name/coloration of each chart
  return (
    <div className="card mb-4 rounded-3 shadow-sm">
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div className="col-md-3 mb-2 mb-md-0"></div>
        <h4 className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0 fw-normal"> Display Options</h4>
        <div className="col-md-3 text-end">
          <button className="btn btn-primary py-2 me-2" onClick={handleConnectClick}>Connect</button>
        </div>
      </div>
      <div className='card-body'>
        <div className='row row-cols-1 mb-2 text-center'>
          {
            <VisualizationItem
              name={'CPU Usage'}
              dates={dates}
              points={liveData.map((datapoint) => datapoint.cpu)}
              color={'rgb(127, 191, 255)'}
            />
          }
          {
            <VisualizationItem
              name={'Memory Usage'}
              dates={dates}
              points={liveData.map((datapoint) => datapoint.mem)}
              color={'rgb(127, 159, 255)'}
            />
          }
          {/* {
            <VisualizationItem
              name={'Network Traffic'}
              dates={dates}
              points={liveData.map((datapoint) => datapoint.net)}
            />
          } */}
          {
            <VisualizationItem
              name={'Disk Usage'}
              dates={dates}
              points={liveData.map((datapoint) => datapoint.disk)}
              color={'rgb(127, 127, 255)'}
            />
          }
        </div>
      </div>
      <div className="modal-wrapper">
        <ConnectionModal modalVisible={modalVisible} closeModal={handleCloseModal} />
      </div>
    </div>
  );
};

export default VisualizerBox;
