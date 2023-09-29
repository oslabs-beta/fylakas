const { Pool } = require('pg');
const PG_URI = process.env.pg_uri;

const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  end: () => pool.end(),
};
