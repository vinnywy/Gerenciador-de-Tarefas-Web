const pool = require('../config/database');

/**
 * Model para gerenciamento de colunas do kanban
 * Implementa operações CRUD e reorganização de posições
 */

/**
 * Busca todas as colunas de um board específico
 * @param {number} board_id - ID do board
 * @returns {Array} Lista de colunas ordenadas por posição
 */
const findByBoardId = async (board_id) => {
  const query = 'SELECT * FROM columns WHERE board_id = $1 ORDER BY posicao';
  const result = await pool.query(query, [board_id]);
  return result.rows;
};

/**
 * Busca uma coluna específica por ID
 * @param {number} id - ID da coluna
 * @returns {Object|null} Dados da coluna ou null se não encontrada
 */
const findById = async (id) => {
  const query = 'SELECT * FROM columns WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

/**
 * Cria uma nova coluna
 * @param {Object} columnData - Dados da coluna
 * @returns {Object} Coluna criada
 */
const create = async ({ titulo, posicao, board_id }) => {
  const query = 'INSERT INTO columns (titulo, posicao, board_id) VALUES ($1, $2, $3) RETURNING *';
  const result = await pool.query(query, [titulo, posicao, board_id]);
  return result.rows[0];
};

/**
 * Atualiza uma coluna existente
 * @param {Object} columnData - Dados para atualização
 * @returns {Object} Coluna atualizada
 */
const update = async ({ id, titulo }) => {
  const query = 'UPDATE columns SET titulo = $1, atualizado_em = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
  const result = await pool.query(query, [titulo, id]);
  return result.rows[0];
};

/**
 * Remove uma coluna e todas as suas tarefas
 * @param {number} id - ID da coluna
 * @returns {boolean} True se removida com sucesso
 */
const remove = async (id) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Busca a coluna para obter board_id e posição
    const columnResult = await client.query('SELECT board_id, posicao FROM columns WHERE id = $1', [id]);
    if (columnResult.rows.length === 0) {
      return false;
    }

    const { board_id, posicao } = columnResult.rows[0];

    // Remove todas as tarefas da coluna primeiro
    await client.query('DELETE FROM tasks WHERE coluna_id = $1', [id]);

    // Remove a coluna
    await client.query('DELETE FROM columns WHERE id = $1', [id]);

    // Reorganiza posições das colunas restantes (remove gaps)
    await client.query(`
      UPDATE columns
      SET posicao = posicao - 1
      WHERE board_id = $1 AND posicao > $2
    `, [board_id, posicao]);

    await client.query('COMMIT');
    return true;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Verifica se uma coluna pertence a um usuário específico
 * @param {number} columnId - ID da coluna
 * @param {number} userId - ID do usuário
 * @returns {boolean} True se o usuário é proprietário
 */
const isOwner = async (columnId, userId) => {
  const query = `
    SELECT c.id
    FROM columns c
    INNER JOIN boards b ON c.board_id = b.id
    WHERE c.id = $1 AND b.usuario_id = $2
  `;
  const result = await pool.query(query, [columnId, userId]);
  return result.rows.length > 0;
};

module.exports = {
  findByBoardId,
  findById,
  create,
  update,
  remove,
  isOwner
};