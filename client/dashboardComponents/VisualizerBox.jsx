import React from 'react';
import VisualizationItem from './visualizerComponents/VisualizationItem.jsx';

const VisualizerBox = () => {

  return (
    <div className="card mb-4 rounded-3 shadow-sm">
      <div className="card-header py-3 text-center">
        <h4 className="my-0 fw-normal"> Display Options</h4>
      </div>
      <div className="card-body">
        <div className="row row-cols-1 row-cols-md-2 mb-2 text-center">
          {<VisualizationItem/>}
          {<VisualizationItem/>}
          {<VisualizationItem/>}
          {<VisualizationItem/>}
          {<VisualizationItem/>}
          {<VisualizationItem/>}
        </div>
      </div>
    </div>
  );
};

export default VisualizerBox;