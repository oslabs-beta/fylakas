import React, { useState, useEffect } from 'react';
import DashboardPage from './dashboardComponents/DashboardPage.jsx';
import LoginPage from './authComponents/LoginPage.jsx';
import LoadingPage from './dashboardComponents/LoadingPage.jsx';
import { createRoot } from 'react-dom/client';

function App() {
  // declare initial state and assign to 'loading' using useState hook
  const [isLoggedIn, setIsLoggedIn] = useState('loading');

  useEffect(() => {
    // Will check a jwt cookie to see if any user is logged in. 
    fetch('api/auth/check')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('ERROR: request in App useEffect failed');
      })
      .then((response) => {
        console.log(response);
        // Change state of isLoggedIn to match the response given
        response.isLoggedIn ? setIsLoggedIn(true) : setIsLoggedIn(false);
      });
  }, []);

  // Load page "loading" initially.
  // If logged in, serve the Dashboard page. If not, serve the Login page.
  const page =
    isLoggedIn === 'loading' ? (
      <LoadingPage />
    ) : isLoggedIn ? (
      <DashboardPage logOut={() => setIsLoggedIn(false)} />
    ) : (
      <LoginPage logIn={() => setIsLoggedIn(true)} />
    );

  // Render the page within a div
  return <div className='App'>{page}</div>;
}

// Render the application inside the root div.
const root = createRoot(document.querySelector('#root'));
root.render(<App />);
