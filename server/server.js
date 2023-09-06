const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;
// const socialRouter = require('./routers/routes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/build', express.static(path.resolve(__dirname, '../build')))

// if (process.env.NODE_ENV === 'production') {
//   app.use('/build', express.static(path.resolve(__dirname, '../build')));
//   app.get('/', (req, res) => {
//     return res.status(200).sendFile(path.join(__dirname, '../client'));
//   });
// }
//serves html on load of website
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

//handles routes made to accounts endpoint
// app.use('/accounts', socialRouter);

// catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => res.status(404).send('This is an incorrect URL'));

//default error handler error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


module.exports = app.listen(port, () =>
  console.log(`Listening on port ${port}`)
);