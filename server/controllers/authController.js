const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database.js');

const WORKFACTOR = 12;
const AUTHKEY = 'd433288a-649e-4f57-8786-4824bf35c5e3';

const authController = {};

// include auth middleware here

authController.handleUserDetails = async (req, res, next) => {
  try {
    res.locals.valid = true;
    const { username, password } = req.body;
    console.log(`Handling auth request for "${username}".`);
    if (!username || typeof username !== 'string') {
      res.locals.valid = false;
      console.log(`Invalid username format in signup.`);
    }
    if (!password || typeof password !== 'string') {
      res.locals.valid = false;
      console.log('Invalid password format in signup.');
    }
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

authController.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { valid, hpassword } = res.locals;
    if (valid) {
      console.log(`Making login request with username "${username}".`);
      const user = await db.query(
        'SELECT username, hash_id, password FROM public.users WHERE username=$1;',
        [username]
      );
      if (
        user.rows[0] &&
        (await bcrypt.compare(password, user.rows[0].password))
      ) {
        console.log(`Succesfully verified login details for "${username}".`);
        res.locals.id = user.rows[0].hash_id;
      } else {
        console.log('Username or password is incorrect.');
        res.locals.valid = false;
      }
    }
    next();
  } catch (err) {
    next({ log: err, message: { err: 'Error occurred in login.' } });
  }
};

authController.signup = async (req, res, next) => {
  try {
    const { username } = req.body;
    const { valid, hpassword } = res.locals;
    if (valid) {
      console.log(`Making signup request with username "${username}".`);
      const matchedUsernames = await db.query(
        'SELECT * FROM public.users WHERE username = $1;',
        [username]
      );

      if (matchedUsernames.rows[0]) {
        console.log(`Username "${username}" already exists.`);
        res.locals.valid = false;
      } else {
        console.log(`Creating new account in database for "${username}".`);
        const insertedUser = await db.query(
          'INSERT INTO public.users (username, password) VALUES ($1, $2) RETURNING user_id;',
          [username, hpassword]
        );
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

authController.startSession = async (req, res, next) => {
  try {
    const { username } = req.body;
    const { valid, id } = res.locals;
    if (valid) {
      console.log(`Starting session for username "${username}".`);
      const token = jwt.sign({ username: req.body.username }, AUTHKEY, {
        expiresIn: '3600s',
      });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.locals.profile = { id: id };
    } else {
      console.log(`Refusing to start session for ${username}.`);
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

authController.isLoggedIn = async (req, res, next) => {
  try {
    console.log(`Checking cookies.`);
    res.locals.isLoggedIn = true;
    let payload;
    try {
      payload = await jwt.verify(req.cookies.jwt, AUTHKEY);
    } catch (err) {
      payload = { username: null };
      console.log('Rejected cookie.');
    }
    res.locals.username = payload.username;
    const matchedAccounts = await db.query(
      'SELECT username FROM public.users WHERE username = $1;',
      [payload.username]
    );
    if (!matchedAccounts.rows[0]) {
      res.locals.isLoggedIn = false;
    } else {
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

authController.logout = async (req, res, next) => {
  try {
    res.clearCookie('jwt');
    return next();
  } catch (err) {
    next({ log: err, message: { err: 'Error occurred while logging out.' } });
  }
};

module.exports = authController;
