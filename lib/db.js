const { Pool } = require('pg');
let pool;
if (!global.pgPool) {
  global.pgPool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false } });
}
pool = global.pgPool;
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
