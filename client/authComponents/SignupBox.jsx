import React, {useState} from 'react';

const SignupBox = ({ routeToLoginPage, logIn }) => {
  const [usernameField, setUsernameField] = useState('');
  const [passwordField, setPasswordField] = useState('');

  // Still requires real functionality
  const signUp = (e) => {
    e.preventDefault();
    console.log(usernameField, passwordField);
    logIn();
  }

  return (
    <div id='signupBox'>
      <h2>Signup Box</h2>
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
        <button onClick = {signUp}>Sign Up</button>
      </form>
      <button onClick = {routeToLoginPage}>Already have an account?</button>
    </div>
  )
}

export default SignupBox;