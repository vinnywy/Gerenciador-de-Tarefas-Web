const pool = require('../config/database');

/**
 * Model para gerenciamento de tarefas (tasks)
 * Implementa operações CRUD e movimentação entre colunas
 */

/**
 * Busca todas as tarefas de uma coluna específica
 * @param {number} coluna_id - ID da coluna
 * @returns {Array} Lista de tarefas ordenadas por posição
 */
const findByColumnId = async (coluna_id) => {
  const query = 'SELECT * FROM tasks WHERE coluna_id = $1 ORDER BY posicao';
  const result = await pool.query(query, [coluna_id]);
  return result.rows;
};

/**
 * Busca uma tarefa específica por ID
 * @param {number} id - ID da tarefa
 * @returns {Object|null} Dados da tarefa ou null se não encontrada
 */
const findById = async (id) => {
  const query = 'SELECT * FROM tasks WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

/**
 * Cria uma nova tarefa
 * @param {Object} taskData - Dados da tarefa
 * @returns {Object} Tarefa criada
 */
const create = async ({ titulo, descricao, prioridade, coluna_id, responsavel_id, data_limite, posicao }) => {
  const query = `
    INSERT INTO tasks (titulo, descricao, prioridade, coluna_id, responsavel_id, data_limite, posicao)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  const result = await pool.query(query, [titulo, descricao, prioridade, coluna_id, responsavel_id, data_limite, posicao]);
  return result.rows[0];
};

/**
 * Atualiza uma tarefa existente
 * @param {Object} taskData - Dados para atualização
 * @returns {Object} Tarefa atualizada
 */
const update = async ({ id, titulo, descricao, prioridade }) => {
  const query = `
    UPDATE tasks SET titulo = $1, descricao = $2, prioridade = $3, atualizado_em = CURRENT_TIMESTAMP
    WHERE id = $4 RETURNING *`;
  const result = await pool.query(query, [titulo, descricao, prioridade, id]);
  return result.rows[0];
};

/**
 * Move uma tarefa para outra coluna
 * @param {number} taskId - ID da tarefa
 * @param {number} newColumnId - ID da nova coluna
 * @param {number} newPosition - Nova posição na coluna
 * @returns {Object} Tarefa atualizada
 */
const moveToColumn = async (taskId, newColumnId, newPosition) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Busca a tarefa atual
    const currentTask = await client.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    if (currentTask.rows.length === 0) {
      throw new Error('Tarefa não encontrada');
    }

    const task = currentTask.rows[0];
    const oldColumnId = task.coluna_id;

    // Se mudou de coluna, reorganiza as posições
    if (oldColumnId !== newColumnId) {
      // Reorganiza posições na coluna antiga (remove gaps)
      await client.query(`
        UPDATE tasks
        SET posicao = posicao - 1
        WHERE coluna_id = $1 AND posicao > $2
      `, [oldColumnId, task.posicao]);

      // Abre espaço na nova coluna
      await client.query(`
        UPDATE tasks
        SET posicao = posicao + 1
        WHERE coluna_id = $1 AND posicao >= $2
      `, [newColumnId, newPosition]);
    } else {
      // Movimentação dentro da mesma coluna
      if (newPosition > task.posicao) {
        // Movendo para baixo
        await client.query(`
          UPDATE tasks
          SET posicao = posicao - 1
          WHERE coluna_id = $1 AND posicao > $2 AND posicao <= $3
        `, [oldColumnId, task.posicao, newPosition]);
      } else if (newPosition < task.posicao) {
        // Movendo para cima
        await client.query(`
          UPDATE tasks
          SET posicao = posicao + 1
          WHERE coluna_id = $1 AND posicao >= $2 AND posicao < $3
        `, [oldColumnId, newPosition, task.posicao]);
      }
    }

    // Atualiza a tarefa com nova coluna e posição
    const result = await client.query(`
      UPDATE tasks
      SET coluna_id = $1, posicao = $2, atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $3 RETURNING *
    `, [newColumnId, newPosition, taskId]);

    await client.query('COMMIT');
    return result.rows[0];

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Remove uma tarefa
 * @param {number} id - ID da tarefa
 * @returns {boolean} True se removida com sucesso
 */
const remove = async (id) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Busca a tarefa para obter coluna e posição
    const taskResult = await client.query('SELECT coluna_id, posicao FROM tasks WHERE id = $1', [id]);
    if (taskResult.rows.length === 0) {
      return false;
    }

    const { coluna_id, posicao } = taskResult.rows[0];

    // Remove a tarefa
    await client.query('DELETE FROM tasks WHERE id = $1', [id]);

    // Reorganiza posições na coluna (remove gaps)
    await client.query(`
      UPDATE tasks
      SET posicao = posicao - 1
      WHERE coluna_id = $1 AND posicao > $2
    `, [coluna_id, posicao]);

    await client.query('COMMIT');
    return true;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  findByColumnId,
  findById,
  create,
  update,
  moveToColumn,
  remove
};