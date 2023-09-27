import React, { useState } from 'react';
import CurrentHealthTab from './CurrentHealthTab.jsx';
import ComparisonTab from './ComparisonTab.jsx';
import PastHealthTab from './PastHealthTab.jsx';
import AlertBox from './AlertBox.jsx';
import ErrorBox from './ErrorBox.jsx';
import StatBox from './StatBox.jsx';

export default function Sidebar() {
  return (
    <nav className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
      <div className="offcanvas-md offcanvas-end bg-body-tertiary" tabIndex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
        <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
          <ul className="nav flex-column">
            <li className="nav-item">{<CurrentHealthTab/>}</li>
            <li className="nav-item">{<PastHealthTab/>}</li>
            <li className="nav-item">{<ComparisonTab/>}</li>
          </ul>
          {/* <hr className="my-3"></hr>
          <ul className="nav flex-column">
            <li className="nav-item">{<StatBox/>}</li>
          </ul> */}
          <hr className="my-3"></hr>
          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
            <span>Other Info</span>
          </h6>
          <ul className="nav flex-column">
            <li className="nav-item">{<AlertBox/>}</li>
            <li className="nav-item">{<ErrorBox/>}</li>
          </ul>
        </div>
      </div>
      {/* <h3 className="list-group-item list-group-item-action list-group-item-light p-3">Sidebar</h3> */}
    </nav>
  )
}