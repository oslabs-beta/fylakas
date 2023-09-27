import React, {useState} from 'react';

const SignupBox = ({ routeToLoginPage, logIn }) => {

  // Declare state for field input strings and error booleans.
  const [usernameField, setUsernameField] = useState('');
  const [passwordField, setPasswordField] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [signupError, setSignupError] = useState(false);

  // Error boxes can be empty if there is no error, or filled with the appropriate error message if needbe.
  const usernameErrorBox = usernameError ? <div>You must enter a username.</div> : <></>;
  const passwordErrorBox = passwordError ? <div>You must enter a password.</div> : <></>;
  const signupErrorBox = signupError ? <div>The username you selected already belongs to an account.</div> : <></>;

  const signUp = (e) => {
    // Prevent the page from reloading on event.
    e.preventDefault();
    // Reset all the state pertaining to errors.
    if (signupError) setSignupError(false);
    if (usernameError) setUsernameError(false);
    if (passwordError) setPasswordError(false);
    // If both a username and password have been entered, make a login request.
    if (usernameField && passwordField) { 
      fetch('api/auth/signup', {
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
        // If not, flag the signupError as true.
        if (response.profile) {
          logIn();
        } else {
          setSignupError(true);
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
    <div id='signupBox' className="d-flex justify-content-center align-items-center py-4 bg-body-tertiary" style={{ height: '100vh', width: '100vw' }}>
      <div className="form-signin text-center">
      <form>
        <div className="form-floating my-1">
          {usernameErrorBox}
          {signupErrorBox}
          <input
            class="form-control"
            id="floatingInput"
            placeholder='Username'
            value={usernameField}
            onChange={(e) => setUsernameField(e.target.value)}
          ></input>
          <label for="floatingInput">Username</label>
        </div>
        <div className="form-floating my-1">
          {passwordErrorBox}
          <input
            class="form-control"
            id="floatingPassword"
            type='password'
            value={passwordField}
            placeholder='Password'
            onChange={(e) => setPasswordField(e.target.value)}
          ></input>
          <label for="flaotingPassword">Password</label>
        </div>
      </form>
      <div>
      <button className ="btn btn-primary w-100 py-2 my-2" onClick = {signUp}>Sign Up</button>
      <button className ="btn btn-primary w-100 py-2 my-1" onClick = {routeToLoginPage}>Already have an account?</button>
      </div>
      </div>
    </div>
  )
}

export default SignupBox;