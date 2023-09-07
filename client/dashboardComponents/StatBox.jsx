import React from 'react';
import ContainerRunningBox from './statBoxComponents/ContainerRunningBox.jsx';
import NodesRunningBox from './statBoxComponents/NodesRunningBox.jsx';
import PodsRunningBox from './statBoxComponents/PodsRunningBox.jsx';

const StatBox = () => {

  return (
    <div className="row row-cols-1 mb-3">
    <div className="col">
    <div className="card mb-4 rounded-3 shadow-sm">
      <div className="card-header py-3 text-center">
        <h4 className="my-0 fw-normal"> Stats</h4>
      </div>
      <div className="card-body">
        <ul className="list-unstyled mt-3 mb-4 text-left">
          <li>Pods Running:</li>
          <li>Nodes Running:</li>
          <li>Containers Running:</li>
        </ul>
      </div>
    </div>
  </div>
  </div>
  );
};

export default StatBox;
