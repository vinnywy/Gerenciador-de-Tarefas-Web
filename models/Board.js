const pool = require('../config/database');

/**
 * Modelo Board - Responsável pela interação com a tabela boards no banco de dados
 * Segue o padrão MVC para separação de responsabilidades
 */

/**
 * Busca todos os boards de um usuário específico
 * @param {number} usuario_id - ID do usuário
 * @returns {Array} - Array com os boards do usuário
 */
const findByUserId = async (usuario_id) => {
  try {
    const query = `
      SELECT
        b.*,
        u.name as usuario_nome,
        u.email as usuario_email,
        (SELECT COUNT(*) FROM columns c WHERE c.board_id = b.id) as total_colunas,
        (SELECT COUNT(*) FROM tasks t
         JOIN columns c ON t.coluna_id = c.id
         WHERE c.board_id = b.id) as total_tarefas
      FROM boards b
      JOIN users u ON b.usuario_id = u.id
      WHERE b.usuario_id = $1
      ORDER BY b.criado_em DESC
    `;
    const result = await pool.query(query, [usuario_id]);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar boards do usuário:', error);
    throw new Error('Erro interno do servidor');
  }
};

/**
 * Busca um board específico pelo ID
 * @param {number} id - ID do board
 * @returns {Object|null} - Objeto do board ou null se não encontrado
 */
const findById = async (id) => {
  try {
    const query = `
      SELECT
        b.*,
        u.name as usuario_nome,
        u.email as usuario_email
      FROM boards b
      JOIN users u ON b.usuario_id = u.id
      WHERE b.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar board por ID:', error);
    throw new Error('Erro interno do servidor');
  }
};

/**
 * Cria um novo board
 * @param {Object} boardData - Dados do board
 * @param {string} boardData.nome - Nome do board
 * @param {string} boardData.descricao - Descrição do board
 * @param {number} boardData.usuario_id - ID do usuário proprietário
 * @returns {Object} - Board criado
 */
const create = async ({ nome, descricao, usuario_id }) => {
  try {
    const query = `
      INSERT INTO boards (nome, descricao, usuario_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [nome, descricao, usuario_id]);

    // Criar colunas padrão para o novo board
    const boardId = result.rows[0].id;
    await createDefaultColumns(boardId);

    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar board:', error);
    throw new Error('Erro interno do servidor');
  }
};

/**
 * Atualiza um board existente
 * @param {number} id - ID do board
 * @param {Object} updateData - Dados para atualização
 * @returns {Object|null} - Board atualizado ou null se não encontrado
 */
const update = async (id, { nome, descricao }) => {
  try {
    const query = `
      UPDATE boards
      SET nome = $1, descricao = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [nome, descricao, id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao atualizar board:', error);
    throw new Error('Erro interno do servidor');
  }
};

/**
 * Remove um board e todas as suas dependências
 * @param {number} id - ID do board
 * @returns {boolean} - true se removido com sucesso
 */
const remove = async (id) => {
  try {
    const query = 'DELETE FROM boards WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Erro ao remover board:', error);
    throw new Error('Erro interno do servidor');
  }
};

/**
 * Cria colunas padrão para um novo board
 * @param {number} boardId - ID do board
 */
const createDefaultColumns = async (boardId) => {
  try {
    const defaultColumns = [
      { titulo: 'A Fazer', posicao: 1 },
      { titulo: 'Em Progresso', posicao: 2 },
      { titulo: 'Concluído', posicao: 3 }
    ];

    for (const column of defaultColumns) {
      await pool.query(
        'INSERT INTO columns (titulo, posicao, board_id) VALUES ($1, $2, $3)',
        [column.titulo, column.posicao, boardId]
      );
    }
  } catch (error) {
    console.error('Erro ao criar colunas padrão:', error);
    // Não propaga o erro para não interromper a criação do board
  }
};

/**
 * Verifica se um usuário é proprietário de um board
 * @param {number} boardId - ID do board
 * @param {number} userId - ID do usuário
 * @returns {boolean} - true se o usuário é proprietário
 */
const isOwner = async (boardId, userId) => {
  try {
    const query = 'SELECT COUNT(*) as count FROM boards WHERE id = $1 AND usuario_id = $2';
    const result = await pool.query(query, [boardId, userId]);
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error('Erro ao verificar propriedade do board:', error);
    return false;
  }
};

module.exports = {
  findByUserId,
  findById,
  create,
  update,
  remove,
  isOwner
};