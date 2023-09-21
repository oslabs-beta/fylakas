const path = require("path");
const express = require("express");
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

// routers here
const authRouter = require("./routers/authRouter.js");
const clusterRouter = require("./routers/clusterRouter.js");

// NEED TO REQUIRE k8s ROUTER STILL
// const k8srouter = require("./routers/K8srouter.js");
/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use( express.static(path.resolve(__dirname, '../assets')));

app.use('/build', express.static(path.resolve(__dirname, '../build')));

app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

// paths to routers here
app.use('/api/auth', authRouter);
app.use('/api/cluster', clusterRouter);
// app.use('/api/k8s', k8srouter);

// catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => res.status(404).send('This is not the page you\'re looking for...'));

/*Global Error Handler */
app.use((err, req, res, next) => {
    const defaultErr = {
      log: "Express error handler caught unknown middleware error",
      status: 500,
      message: { err: "An error occurred" },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });
  
 /*
 * start server
 */
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`);
  });

module.exports = app;
