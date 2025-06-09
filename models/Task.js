const pool = require('../config/database');

const findByColumnId = async (coluna_id) => {
  const query = 'SELECT * FROM tasks WHERE coluna_id = $1 ORDER BY posicao';
  const result = await pool.query(query, [coluna_id]);
  return result.rows;
};

const create = async ({ titulo, descricao, prioridade, coluna_id, responsavel_id, data_limite, posicao }) => {
  const query = `
    INSERT INTO tasks (titulo, descricao, prioridade, coluna_id, responsavel_id, data_limite, posicao)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  const result = await pool.query(query, [titulo, descricao, prioridade, coluna_id, responsavel_id, data_limite, posicao]);
  return result.rows[0];
};

const update = async ({ id, titulo, descricao, prioridade }) => {
  const query = `
    UPDATE tasks SET titulo = $1, descricao = $2, prioridade = $3 WHERE id = $4 RETURNING *`;
  const result = await pool.query(query, [titulo, descricao, prioridade, id]);
  return result.rows[0];
};

module.exports = { findByColumnId, create, update };