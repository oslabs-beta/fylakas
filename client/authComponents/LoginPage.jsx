import React, { useState } from 'react';

import LoginBox from './LoginBox.jsx';
import SignupBox from './SignupBox.jsx';

const LoginPage = ({logIn}) => {

  // State initialization shows user LoginBox on initial loadup
  const [accountExists, setAccountExists] = useState(true);

  // Determines whether to show the LoginBox or SignupBox through events passed to each
  const page = accountExists ? 
  <LoginBox routeToSignupPage = {() => setAccountExists(false)} logIn = {logIn}/> : 
  <SignupBox routeToLoginPage = {() => setAccountExists(true)} logIn = {logIn}/>; 

  return (
    <div>
      {page}
    </div>
  )
}

export default LoginPage;