const pool = require('../config/database');

exports.login = async (req, res) => {
  const { email } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      res.status(200).json({ success: true, userId: rows[0].id });
    } else {
      res.status(401).json({ success: false, message: 'E-mail não cadastrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
