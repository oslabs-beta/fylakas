import React, {useState} from 'react';

const SignupBox = ({ routeToLoginPage, logIn }) => {
  const [usernameField, setUsernameField] = useState('');
  const [passwordField, setPasswordField] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [signupError, setSignupError] = useState(false);

  const usernameErrorBox = usernameError ? <div>You must enter a username.</div> : <></>;
  const passwordErrorBox = passwordError ? <div>You must enter a password.</div> : <></>;
  const signupErrorBox = signupError ? <div>The username you selected already belongs to an account.</div> : <></>;

  // Still requires real functionality
  const signUp = (e) => {
    e.preventDefault();
    if (signupError) setSignupError(false);
    if (usernameError) setUsernameError(false);
    if (passwordError) setPasswordError(false);
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
        if (response.profile) {
          logIn();
        } else {
          // Add functionality for failed sign up attempt
          setSignupError(true);
        }
      })
      .catch(err => console.log(err));
    } else {
      if (!usernameField) setUsernameError(true);
      if (!passwordField) setPasswordError(true);
    }
  }

  return (
    <div id='signupBox'>
      <h2>Signup Box</h2>
      <form>
        <h3>Username</h3>
        {usernameErrorBox}
        {signupErrorBox}
        <input
          value={usernameField}
          placeholder='Username'
          onChange={(e) => setUsernameField(e.target.value)}
        ></input>
        <h3>Password</h3>
        {passwordErrorBox}
        <input
          value={passwordField}
          placeholder='Password'
          onChange={(e) => setPasswordField(e.target.value)}
        ></input>
        <button onClick = {signUp}>Sign Up</button>
      </form>
      <button onClick = {routeToLoginPage}>Already have an account?</button>
    </div>
  )
}

export default SignupBox;