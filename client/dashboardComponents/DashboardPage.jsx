import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import ClusterHealthHeader from './ClusterHealthHeader.jsx';
import VisualizerBox from './VisualizerBox.jsx';
import PageMode from './PageMode.jsx';

const DashboardPage = ({ logOut }) => {
  // declare initial state of our webpage and assign to 'currentHealth' using useState hook
  const [tabState, setTabState] = useState('currentHealth');

  const handleLogOut = () => {
    fetch('api/auth/logout', {})
      .then((response) => {
        if (response.ok) logOut();
        else throw new Error('ERROR: request failed in handleLogOut');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <header className="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow justify-content-between" data-bs-theme="dark">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white" href="#">Fylakas</a>
        <a onClick={(e) => handleLogOut()} className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-end" href="#">
          <i class="bi bi-box-arrow-left me-1"></i>
          Log Out
        </a>
      </header>
      <div className='container-fluid'>
        <div className='row'>
          {<Sidebar />}
          <div className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
            {<ClusterHealthHeader />}
            {<VisualizerBox />}
          </div>
        </div>
      </div>
      {/* <div className="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
        {<PageMode/>}
      </div> */}
    </div>
  );
};

export default DashboardPage;
