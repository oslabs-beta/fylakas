const express = require('express');
const { postgraphile } = require('postgraphile');

const app = express();

app.use(postgraphile(
  'postgres://postgres:cincitychilli@localhost/fylakas-database',
  'public', // schema name or array of schema names
  {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
  }
));

app.listen(5000);
