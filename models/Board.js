// models/Board.js
const pool = require('../config/database');

// Busca todos os boards de um usuário
const findByUserId = async (usuario_id) => {
  const query = 'SELECT * FROM boards WHERE usuario_id = $1 ORDER BY id';
  const result = await pool.query(query, [usuario_id]);
  return result.rows;
};

// Cria um novo board
const create = async ({ nome, descricao, usuario_id }) => {
  const query = 'INSERT INTO boards (nome, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *';
  const result = await pool.query(query, [nome, descricao, usuario_id]);
  return result.rows[0];
};

module.exports = { findByUserId, create };