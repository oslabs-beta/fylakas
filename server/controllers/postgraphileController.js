// NOT IMPLEMENTED IN CURRENT VERSION.

const express = require('express');
const { postgraphile } = require('postgraphile');

const app = express();

app.use(postgraphile(
  'postgres://postgres:cincitychilli@localhost/fylakas-database',
  'public', // schema name or array of schema names
  {
    watchPg: true,
    graphiql: true, // allows you to use graphQL with whatever db you're using
    enhanceGraphiql: true, // gives us more features 
  }
));

app.listen(5000);
