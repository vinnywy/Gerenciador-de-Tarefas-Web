const pool = require('../config/database');

exports.getBoardsByUser = async (userId) => {
  const result = await pool.query('SELECT * FROM boards WHERE usuario_id = $1', [userId]);
  return result.rows;
};

exports.createBoard = async (nome, descricao, usuario_id) => {
  const result = await pool.query(
    'INSERT INTO boards (nome, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *',
    [nome, descricao, usuario_id]
  );
  return result.rows[0];
};