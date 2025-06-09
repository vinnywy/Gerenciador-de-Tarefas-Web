const pool = require('../config/database');

const findByBoardId = async (board_id) => {
  const query = 'SELECT * FROM columns WHERE board_id = $1 ORDER BY posicao';
  const result = await pool.query(query, [board_id]);
  return result.rows;
};

const create = async ({ titulo, posicao, board_id }) => {
  const query = 'INSERT INTO columns (titulo, posicao, board_id) VALUES ($1, $2, $3) RETURNING *';
  const result = await pool.query(query, [titulo, posicao, board_id]);
  return result.rows[0];
};

const update = async ({ id, titulo }) => {
  const query = 'UPDATE columns SET titulo = $1 WHERE id = $2 RETURNING *';
  const result = await pool.query(query, [titulo, id]);
  return result.rows[0];
};

module.exports = { findByBoardId, create, update };