import React, {useState} from 'react';

const LoginBox = ({ routeToSignupPage, logIn }) => {
  const [usernameField, setUsernameField] = useState('');
  const [passwordField, setPasswordField] = useState('');

  // Still requires real functionality
  const checkLogIn = (e) => {
    e.preventDefault();
    console.log(usernameField, passwordField);
    logIn();
  }

  return (
    <div id='loginBox'>
      <h2>Login Box</h2>
      <form>
        <input
          value={usernameField}
          placeholder='Username'
          onChange={(e) => setUsernameField(e.target.value)}
        ></input>
        <input
          value={passwordField}
          placeholder='Password'
          onChange={(e) => setPasswordField(e.target.value)}
        ></input>
        <button onClick = {checkLogIn}>Log In</button>
      </form>
      <button onClick = {routeToSignupPage}>Create new account?</button>
    </div>
  )
}

export default LoginBox;