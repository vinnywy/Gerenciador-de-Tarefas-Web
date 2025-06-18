const pool = require('../config/database');


/**
 * Busca um usuário pelo email
  @param {string} email - Email do usuário a ser buscado
  @returns {Object|null} - Objeto do usuário ou null se não encontrado
 */
const findByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    throw new Error('Erro interno do servidor');
  }
};

/**
 * Busca um usuário pelo ID
 * @param {number} id - ID do usuário
 * @returns {Object|null} - Objeto do usuário ou null se não encontrado
 */
const findById = async (id) => {
  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    throw new Error('Erro interno do servidor');
  }
};

/**
  Lista todos os usuários do sistema
  @returns {Array} - Array com todos os usuários
 */
const findAll = async () => {
  try {
    const query = 'SELECT id, name, email, create_at FROM users ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    throw new Error('Erro interno do servidor');
  }
};

/**
 * Verifica se um email já existe no banco de dados
  @param {string} email - Email a ser verificado
  @returns {boolean} - true se o email existe, false caso contrário
 */
const emailExists = async (email) => {
  try {
    const query = 'SELECT COUNT(*) as count FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error('Erro ao verificar se email existe:', error);
    throw new Error('Erro interno do servidor');
  }
};

module.exports = {
  findByEmail,
  findById,
  findAll,
  emailExists
};