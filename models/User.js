// models/User.js
const pool = require('../config/database');

const findByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

module.exports = { findByEmail };