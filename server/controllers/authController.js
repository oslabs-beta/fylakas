const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const WORKFACTOR = 12;
const AUTHKEY = 'd433288a-649e-4f57-8786-4824bf35c5e3';

const authController = {};

// include auth middleware here 

authController.handleUserDetails = async (req, res, next) => {
  try {
    res.locals.valid = true;
    const { username, password } = req.body;
    console.log(`Handling auth request for "${username}".`)
    if (!username || typeof username !== 'string') {
      res.locals.valid = false;
      console.log(`Invalid username format in signup.`);
    }
    if (!password || typeof password !== 'string') {
      res.locals.valid = false;
      console.log('Invalid password format in signup.');
    }
    if (res.locals.valid) res.locals.hpassword = await bcrypt.hash(password, WORKFACTOR);
    next();
  } catch (err) {
    next({log: err, message: {err: 'Error occured handling user details.'}});
  }
}

authController.login = async (req, res, next) => {
  try {
    const { username } = req.body;
    const { valid, hpassword } = res.locals;
    if (valid) {
      console.log(`Making login request with username "${username}".`)
      // Reject login if username/password do not match an entry in the users table
      if (false /*logic*/) {
        console.log('Username or password is incorrect.');
        res.locals.valid = false;
      }
    }
    next();
  } catch (err) {
    next({log: err, message: {err: 'Error occured in login.'}});
  }
}

authController.signup = async (req, res, next) => {
  try {
    const { username } = req.body;
    const { valid, hpassword } = res.locals;
    if (valid) {
      console.log(`Making signup request with username "${username}".`)
      // Reject signup if username already exists in the users table
      if (false /*logic*/) {
        console.log(`Username "${username}" already exists.`);
        res.locals.valid = false;
      } else {
        console.log(`Creating new account in database for "${username}".`);
        // Add new account to database
      }
    }
    next();
  } catch (err) {
    next({log: err, message: {err: 'Error occured in signup.'}});
  }
}

authController.startSession = async (req, res, next) => {
  try {
    const { username } = req.body;
    const { valid } = res.locals;
    if (valid) {
      console.log(`Starting session for username "${username}".`);
      // Get relevant profile data for account.
      clusters = 'mock cluster data';
      res.locals.profile = {clusters: clusters};
    } else {
      console.log(`Refusing to start session for ${username}.`);
      res.locals.profile = null;
    }
    next();
  } catch (err) {
    next({log: err, message: {err: 'Error occured starting user session.'}});
  }
}

module.exports = authController;