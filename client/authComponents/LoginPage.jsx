import React, { useState } from 'react';

import LoginBox from './LoginBox.jsx';
import SignupBox from './SignupBox.jsx';

const LoginPage = (props) => {
  const [accountExists, setAccountExists] = useState(true);

  const page = accountExists ? 
  <LoginBox routeToSignupPage = {() => setAccountExists(false)}/> : 
  <SignupBox routeToLoginPage = {() => setAccountExists(true)}/>; 

  return (
    <div>
      <h1>Login Page</h1>
      {page}
    </div>
  )
}

export default LoginPage;