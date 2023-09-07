import React, { useState, useEffect } from 'react';
import DashboardPage from './dashboardComponents/DashboardPage.jsx';
import LoginPage from './authComponents/LoginPage.jsx';
import { createRoot } from 'react-dom/client';

function App() {
  // declare initial state and assign to 'false' using useState hook
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    // Will check to see if user is logged in
    console.log('Run login check');
  }, []);

  // Is isLoggedIn truthy? If yes, assign page to DashboardPage.  If no, assign page to LoginPage.
  const page = isLoggedIn ?
    <DashboardPage logOut = {() => setIsLoggedIn(false)} /> :
    <LoginPage logIn = {() => setIsLoggedIn(true)} />;

  // Render the page within a div
  return (
    <div className = "App">
      { page }
    </div>
  )
}

const root = createRoot(document.querySelector('#root'));
root.render(<App/>);