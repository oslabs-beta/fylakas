const { Pool } = require('pg');
const PG_URI =
  'postgres://enxbfkfa:sy787kGlVmYSns2THIHhVXAQTmd08Qbo@berry.db.elephantsql.com/enxbfkfa';

const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  end: () => pool.end(), // Add this line to expose the end method
};
