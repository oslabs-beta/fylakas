import React, { useState } from 'react';

import LoginBox from './LoginBox.jsx';
import SignupBox from './SignupBox.jsx';

const LoginPage = ({logIn}) => {
  const [accountExists, setAccountExists] = useState(true);

  const page = accountExists ? 
  <LoginBox routeToSignupPage = {() => setAccountExists(false)} logIn = {logIn}/> : 
  <SignupBox routeToLoginPage = {() => setAccountExists(true)} logIn = {logIn}/>; 

  return (
    <div>
      <h1>Login Page</h1>
      {page}
    </div>
  )
}

export default LoginPage;