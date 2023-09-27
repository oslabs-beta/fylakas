import React, {useState} from 'react';

const LoginBox = ({ routeToSignupPage, logIn }) => {

  // Declare state for field input strings and error booleans.
  const [usernameField, setUsernameField] = useState('');
  const [passwordField, setPasswordField] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Error boxes can be empty if there is no error, or filled with the appropriate error message if needbe.
  const usernameErrorBox = usernameError ? <div>You must enter a username.</div> : <></>;
  const passwordErrorBox = passwordError ? <div>You must enter a password.</div> : <></>;
  const loginErrorBox = loginError ? <div>Invalid login credentials. Please check the spelling of your username and password.</div> : <></>;

  const checkLogIn = (e) => {
    // Prevent the page from reloading on event.
    e.preventDefault();
    // Reset all the state pertaining to errors.
    if (usernameError) setUsernameError(false);
    if (passwordError) setPasswordError(false);
    if (loginError) setLoginError(false);
    // If both a username and password have been entered, make a login request.
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
        // If a profile is returned, set state isLoggedIn to true.
        // If not, flag the loginError as true.
        if (response.profile) {
          logIn();
        } else {
          setLoginError(true);
        }
      })
      .catch(err => console.log(err));
    } else {
      // Determine which fields need to be filled and flag the appropriate error.
      if (!usernameField) setUsernameError(true);
      if (!passwordField) setPasswordError(true);
    }
  }

  return (
    <div id='loginBox' className="d-flex justify-content-center align-items-center py-4 bg-body-tertiary" style={{ height: '100vh', width: '100vw' }}>
      <div className="form-signin text-center">
        <form>
          <img className="mb-4" src="/assets/fylakas-logo-export.png" alt width="80" height="100"></img>
          <h1 className="h3 mb-2 fw-normal">Welcome Aboard</h1>
          <div className="form-floating">
            {usernameErrorBox}
            {loginErrorBox}
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="Username"
              value={usernameField}
              onChange={(e) => setUsernameField(e.target.value)}
            ></input>
            <label for="floatingInput">Username</label>
          </div>
          <div className="form-floating">
            {passwordErrorBox}
            <input
              type='password'
              class="form-control"
              id="floatingPassowrd"
              placeholder='Password'
              value={passwordField}
              onChange={(e) => setPasswordField(e.target.value)}
            ></input>
            <label for="flaotingPassword">Password</label>
          </div>
        </form>
        <button className ="btn btn-primary w-100 py-2 my-2" onClick = {checkLogIn}>Log In</button>
        <button className ="btn btn-primary w-100 py-2 my-1" onClick = {routeToSignupPage}>Create new account</button>
      </div>
    </div>
  )
}

export default LoginBox;