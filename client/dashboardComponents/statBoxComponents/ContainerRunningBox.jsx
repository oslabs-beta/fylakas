import React from 'react';

const ContainerRunningBox = () => {

  return (
    // <div>
    //   <h1> ContainerRunningBox</h1>
    // </div>
    <div className="col">
        <div className="card mb-4 rounded-3 shadow-sm">
          <div className="card-header py-3">
            <h4 className="my-0 fw-normal"> # of containers running</h4>
          </div>
          <div className="card-body">
            <ul className="list-unstyled mt-3 mb-4">
              <li>Data</li>
              <li>Data</li>
              <li>Data</li>
              <li>Data</li>
            </ul>
          </div>
        </div>
      </div>
  );
};

export default ContainerRunningBox;