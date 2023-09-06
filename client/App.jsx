import React, { useState } from 'react';
import DashboardPage from './dashboardComponents/DashboardPage.jsx';
import LoginPage from './authComponents/LoginPage.jsx';
import { createRoot } from 'react-dom/client';

function App() {
  // declare initial state and assign to 'false' using useState hook
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Is isLoggedIn truthy? If yes, assign page to DashboardPage.  If no, assign page to LoginPage.
  const page = isLoggedIn ? <DashboardPage /> : <LoginPage />;

  // Render the page within a div
  return (
    <div className = "App">
      <h1> 'Ello govnuh </h1>
      { page }
    </div>
  )
}

const root = createRoot(document.querySelector('#root'));
root.render(<App/>);