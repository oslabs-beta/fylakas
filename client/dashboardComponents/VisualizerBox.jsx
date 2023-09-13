import React, { useEffect, useState } from 'react';
import VisualizationItem from './visualizerComponents/VisualizationItem.jsx';

const VisualizerBox = () => {

  const zeroedDate = () => {
    const date = new Date();
    const timePieces = [date.getHours(), date.getMinutes(), date.getSeconds()];
    const zeroedTimePieces = timePieces.map(timePiece => {
      return timePiece < 10 ? '0' + timePiece.toString() : timePiece.toString();
    }) 
    return `${zeroedTimePieces[0]}:${zeroedTimePieces[1]}:${zeroedTimePieces[2]}`;
  }

  const convincingRandomDeviation = (num) => {
    return (((num/100) * 3) + 0.1 ** Math.random()) * 25;
  }

  const initialDate = zeroedDate();
  const [liveData, setLiveData] = useState(Array(61).fill({date: initialDate, cpu: 0, mem: 0, net: 0, disk: 0}, 0, 61));
  console.log(liveData);

  useEffect(() => {
    const timeout = setInterval(() => {
      const newData = liveData.slice();
      if (newData.length > 60) newData.shift();
      const date = zeroedDate();
      newData.push({
        date: date,
        cpu: convincingRandomDeviation(liveData[60].cpu),
        mem: convincingRandomDeviation(liveData[60].mem),
        net: convincingRandomDeviation(liveData[60].net),
        disk: convincingRandomDeviation(liveData[60].disk),
      })
      setLiveData(newData);
    }, 1000)
    return () => {clearTimeout(timeout)};
  },[liveData])

  const dates = liveData.map(datapoint => datapoint.date)

  return (
    <div className="card mb-4 rounded-3 shadow-sm">
      <div className="card-header py-3 text-center">
        <h4 className="my-0 fw-normal"> Display Options</h4>
      </div>
      <div className="card-body">
        <div className="row row-cols-1 row-cols-md-2 mb-2 text-center">
          {<VisualizationItem name = {'CPU Usage'} dates = {dates} points = {liveData.map(datapoint => datapoint.cpu)}/>}
          {<VisualizationItem name = {'Memory Usage'} dates = {dates} points = {liveData.map(datapoint => datapoint.mem)}/>}
          {<VisualizationItem name = {'Network Traffic'} dates = {dates} points = {liveData.map(datapoint => datapoint.net)}/>}
          {<VisualizationItem name = {'Disk Usage'} dates = {dates} points = {liveData.map(datapoint => datapoint.disk)}/>}
        </div>
      </div>
    </div>
  );
};

export default VisualizerBox;