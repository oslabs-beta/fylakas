import React, { useEffect, useState } from 'react';
import VisualizationItem from './visualizerComponents/VisualizationItem.jsx';
import ConnectionModal from './Connection.jsx';

// Number of points of data to display per graph
const range = 60;
// Use dummy data instead of requesting prometheus to test charts
const dummyData = false;

const zeroedDate = (date = new Date()) => {
  const timePieces = [date.getHours(), date.getMinutes(), date.getSeconds()];
  const zeroedTimePieces = timePieces.map((timePiece) => {
    return timePiece < 10 ? '0' + timePiece.toString() : timePiece.toString();
  });
  return `${zeroedTimePieces[0]}:${zeroedTimePieces[1]}:${zeroedTimePieces[2]}`;
};

function subtractMinutes(date) {
  date.setMinutes(date.getMinutes() - range/4);
  return date;
}

const oldDate = zeroedDate(subtractMinutes(new Date()));
console.log(oldDate);

const convincingRandomDeviation = (num) => {
  return ((num / 100) * 3 + 0.1 ** Math.random()) * 25;
};

const VisualizerBox = ({ cluster }) => {
  const initialDate = oldDate;
  const [liveData, setLiveData] = useState(
    Array(range + 1).fill(
      { date: initialDate, cpu: 0, mem: 0, net: 0, disk: 0 },
      0,
      range + 1
    )
  );
  console.log(liveData);

  useEffect(() => {
    setTimeout(() => {
      const newData = liveData.slice();
      if (dummyData) {
        const date = zeroedDate();
        newData.push({
          date: date,
          cpu: convincingRandomDeviation(liveData[range].cpu),
          mem: convincingRandomDeviation(liveData[range].mem),
          net: convincingRandomDeviation(liveData[range].net),
          disk: convincingRandomDeviation(liveData[range].disk),
        });
      } else {
        fetch('api/prom/metrics', {
          method: 'POST',
          body: JSON.stringify({ cluster: cluster }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => {
            if (response.ok) return response.json();
            newData.push({
              date: zeroedDate(),
              cpu: liveData[range].cpu,
              mem: liveData[range].mem,
              net: liveData[range].net,
              disk: liveData[range].disk,
            })
          })
          .then((response) => {
            if (!response.cpu) response.cpu = liveData[range].cpu;
            if (!response.mem) response.mem = liveData[range].mem;
            if (!response.net) response.net = liveData[range].net;
            if (!response.disk) response.disk = liveData[range].disk;
            response.date = zeroedDate();
            newData.push(response);
          });
      }
      while (newData.length > range + 1) newData.shift();
      setLiveData(newData);
    }, 15000);
  }, [liveData]);

  const dates = liveData.map((datapoint) => datapoint.date);
  
  //Modal fucntinoality
  const [modalVisible, setModalVisible] = useState(false);

  const handleConnectClick = () => {
    console.log('Connect button clicked');
    setModalVisible(true);
    console.log('modalVisible set to true');
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

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
