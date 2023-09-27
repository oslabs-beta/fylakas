const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database.js');

// Settings for hashing
const WORKFACTOR = 12;
const AUTHKEY = 'd433288a-649e-4f57-8786-4824bf35c5e3';

const authController = {};

// Initializes any login/signup request
authController.handleUserDetails = async (req, res, next) => {
  try {
    res.locals.valid = true;
    const { username, password } = req.body;
    console.log(`Handling auth request for "${username}".`);
    // Input validation for username/password
    if (!username || typeof username !== 'string') {
      res.locals.valid = false;
      console.log(`Invalid username format in signup.`);
    }
    if (!password || typeof password !== 'string') {
      res.locals.valid = false;
      console.log('Invalid password format in signup.');
    }
    // Store a hashed version of the input password
    if (res.locals.valid)
      res.locals.hpassword = await bcrypt.hash(password, WORKFACTOR);
    next();
  } catch (err) {
    next({
      log: err,
      message: { err: 'Error occurred handling user details.' },
    });
  }
};

// Handles a login request
authController.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { valid } = res.locals;
    // Only procede if previous steps returned valid; otherwise, skip this step.
    if (valid) {
      console.log(`Making login request with username "${username}".`);
      // Select user details matching the username from the request
      const user = await db.query(
        'SELECT username, hash_id, password FROM public.users WHERE username=$1;',
        [username]
      );
      if (
        // Check to see if there's a returned a user with the username
        user.rows[0] &&
        // Check to see if the password for that user is correct
        (await bcrypt.compare(password, user.rows[0].password))
      ) {
        // If details are correct, store the hashed user ID
        console.log(`Succesfully verified login details for "${username}".`);
        res.locals.id = user.rows[0].hash_id;
      } else {
        // If details are incorrect, reject the attempt
        console.log('Username or password is incorrect.');
        res.locals.valid = false;
      }
    }
    next();
  } catch (err) {
    next({ log: err, message: { err: 'Error occurred in login.' } });
  }
};

// Handles a signup request
authController.signup = async (req, res, next) => {
  try {
    const { username } = req.body;
    const { valid, hpassword } = res.locals;
    // Only procede if previous steps returned valid; otherwise, skip this step.
    if (valid) {
      console.log(`Making signup request with username "${username}".`);
      // Select user details matching the username from the request
      const matchedUsernames = await db.query(
        'SELECT * FROM public.users WHERE username = $1;',
        [username]
      );
      if (matchedUsernames.rows[0]) {
        // If username already exists, reject the signup attempt
        console.log(`Username "${username}" already exists.`);
        res.locals.valid = false;
      } else {
        // On valid signup attempt, add new user to user table with username and hashed password
        // Return and store the id associated with this user
        console.log(`Creating new account in database for "${username}".`);
        const insertedUser = await db.query(
          'INSERT INTO public.users (username, password) VALUES ($1, $2) RETURNING user_id;',
          [username, hpassword]
        );
        // Store a hashed version of the userID on the user profile
        const newUserId = insertedUser.rows[0].user_id.toString();
        const hashID = await bcrypt.hash(newUserId, WORKFACTOR);
        await db.query(
          `UPDATE public.users SET hash_id = '${hashID}' WHERE user_id = '${newUserId}'`
        );
        res.locals.id = hashID;
      }
    }
    next();
  } catch (err) {
    next({ log: err, message: { err: 'Error occurred in signup.' } });
  }
};

// Creates new user session on successful login/signup
authController.startSession = async (req, res, next) => {
  try {
    const { username } = req.body;
    const { valid, id } = res.locals;
    // Only procede if previous steps returned valid; otherwise, skip this step.
    if (valid) {
      console.log(`Starting session for username "${username}".`);
      // Create a jwt from the username that expires in 1 day
      const token = jwt.sign({ username: req.body.username }, AUTHKEY, {
        expiresIn: '86400s',
      });
      // Store the jwt as a cookie
      res.cookie('jwt', token, {
        maxAge: 86400000,
        httpOnly: true,
      });
      // Store hashed ID onto profile
      res.locals.profile = { id: id };
    } else {
      console.log(`Refusing to start session for ${username}.`);
      // If skipped session start attempt, assign profile as null
      res.locals.profile = null;
    }
    next();
  } catch (err) {
    next({
      log: err,
      message: { err: 'Error occurred starting user session.' },
    });
  }
};

// Check to see what user is logged in, if any, on a request
authController.isLoggedIn = async (req, res, next) => {
  try {
    console.log(`Checking cookies.`);
    res.locals.isLoggedIn = true;
    // Verify the jwt from the request, if it exists
    let payload;
    try {
      payload = await jwt.verify(req.cookies.jwt, AUTHKEY);
    } catch (err) {
      // Declare username on payload as null on failed jwt verification
      payload = { username: null };
      console.log('Rejected cookie.');
    }
    res.locals.username = payload.username;
    // Find user account associated with username from cookie
    const matchedAccounts = await db.query(
      'SELECT username FROM public.users WHERE username = $1;',
      [payload.username]
    );
    if (!matchedAccounts.rows[0]) {
      // If username doesn't exist, reject attempt
      res.locals.isLoggedIn = false;
    } else {
      // If username exists, store username for future middleware
      res.locals.username = matchedAccounts.rows[0].username;
      console.log(`Verified cookie for ${res.locals.username}.`)
    }
    next();
  } catch (err) {
    next({
      log: err,
      message: { err: 'Error occurred checking user credentials.' },
    });
  }
};

// Log a user out
authController.logout = async (req, res, next) => {
  try {
    // Removes any jwt cookie from request
    res.clearCookie('jwt');
    return next();
  } catch (err) {
    next({ log: err, message: { err: 'Error occurred while logging out.' } });
  }
};

module.exports = authController;
