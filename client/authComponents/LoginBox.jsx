import React, {useState} from 'react';

const LoginBox = ({ routeToSignupPage, logIn }) => {
  const [usernameField, setUsernameField] = useState('');
  const [passwordField, setPasswordField] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const usernameErrorBox = usernameError ? <div>You must enter a username.</div> : <></>;
  const passwordErrorBox = passwordError ? <div>You must enter a password.</div> : <></>;
  const loginErrorBox = loginError ? <div>Invalid login credentials. Please check the spelling of your username and password.</div> : <></>;

  const checkLogIn = (e) => {
    e.preventDefault();
    if (usernameError) setUsernameError(false);
    if (passwordError) setPasswordError(false);
    if (loginError) setLoginError(false);
    if (usernameField && passwordField) { 
      fetch('api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: usernameField, password: passwordField})
      })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('ERROR: request in checkLogIn failed');
      })
      .then(response => {
        if (response.profile) {
          logIn();
        } else {
          // Add functionality for failed login attempt
          setLoginError(true);
        }
      })
      .catch(err => console.log(err));
    } else {
      if (!usernameField) setUsernameError(true);
      if (!passwordField) setPasswordError(true);
    }
  }

  return (
    <div id='loginBox' className="d-flex justify-content-center align-items-center py-4 bg-body-tertiary" style={{ height: '100vh', width: '100vw' }}>
      <div className="form-signin text-center">
        <form>
          <h1 className="h3 mb-2 fw-normal">Welcome Aboard</h1>
          <div className="form-floating">
            {usernameErrorBox}
            {loginErrorBox}
            <input
              value={usernameField}
              placeholder='Username'
              onChange={(e) => setUsernameField(e.target.value)}
            ></input>
          </div>
          <div className="form-floating">
            {passwordErrorBox}
            <input
              type='password'
              value={passwordField}
              placeholder='Password'
              onChange={(e) => setPasswordField(e.target.value)}
            ></input>
          </div>
        </form>
        <button className = "mt-2" onClick = {checkLogIn}>Log In</button>
        <button onClick = {routeToSignupPage}>Create new account</button>
    </div>
      </div>
  )
}

export default LoginBox;