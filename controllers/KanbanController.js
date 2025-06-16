const Board = require('../models/Board');
const Column = require('../models/Column');
const Task = require('../models/Task');
const pool = require('../config/database');

/**
 * Controller para gerenciamento do Kanban
 * Implementa todas as operações CRUD para colunas e tarefas
 */

/**
 * Renderiza a página Kanban de um board específico
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getKanban = async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const boardId = req.params.boardId;

  try {
    // Verifica se o board existe e pertence ao usuário
    const board = (await pool.query('SELECT * FROM boards WHERE id = $1 AND usuario_id = $2',
      [boardId, req.session.user.id])).rows[0];

    if (!board) {
      return res.redirect('/boards');
    }

    // Busca todas as colunas do board
    const columns = await Column.findByBoardId(boardId);

    // Para cada coluna, busca suas tarefas
    for (let col of columns) {
      col.tasks = await Task.findByColumnId(col.id);
    }

    res.render('kanban', {
      user: req.session.user,
      board,
      columns,
      error: null
    });

  } catch (error) {
    console.error('Erro ao carregar Kanban:', error);
    res.render('kanban', {
      user: req.session.user,
      board: null,
      columns: [],
      error: 'Erro ao carregar o Kanban'
    });
  }
};

/**
 * Cria uma nova coluna no board
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.createColumn = async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const boardId = req.params.boardId;
  const { titulo } = req.body;

  try {
    // Verifica se o board pertence ao usuário
    const boardCheck = await pool.query('SELECT id FROM boards WHERE id = $1 AND usuario_id = $2',
      [boardId, req.session.user.id]);

    if (boardCheck.rows.length === 0) {
      return res.redirect('/boards');
    }

    // Calcula a próxima posição
    const columns = await Column.findByBoardId(boardId);
    const posicao = columns.length + 1;

    await Column.create({ titulo, posicao, board_id: boardId });
    res.redirect(`/kanban/${boardId}`);

  } catch (error) {
    console.error('Erro ao criar coluna:', error);
    res.redirect(`/kanban/${boardId}`);
  }
};

/**
 * Atualiza o título de uma coluna
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.editColumn = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Não autorizado' });

  const { columnId } = req.params;
  const { titulo } = req.body;

  try {
    // Verifica se a coluna pertence ao usuário
    const isOwner = await Column.isOwner(columnId, req.session.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const updated = await Column.update({ id: columnId, titulo });
    res.json({ success: true, column: updated });

  } catch (error) {
    console.error('Erro ao editar coluna:', error);
    res.status(500).json({ error: 'Erro ao editar coluna' });
  }
};

/**
 * Remove uma coluna e todas as suas tarefas
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.deleteColumn = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Não autorizado' });

  const { columnId } = req.params;

  try {
    // Verifica se a coluna pertence ao usuário
    const isOwner = await Column.isOwner(columnId, req.session.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const deleted = await Column.remove(columnId);
    if (deleted) {
      res.json({ success: true, message: 'Coluna removida com sucesso' });
    } else {
      res.status(404).json({ error: 'Coluna não encontrada' });
    }

  } catch (error) {
    console.error('Erro ao deletar coluna:', error);
    res.status(500).json({ error: 'Erro ao deletar coluna' });
  }
};

/**
 * Cria uma nova tarefa
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.createTask = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Não autorizado' });

  const { coluna_id, titulo, descricao, prioridade } = req.body;

  try {
    // Verifica se a coluna pertence ao usuário
    const isOwner = await Column.isOwner(coluna_id, req.session.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Calcula a próxima posição
    const tasks = await Task.findByColumnId(coluna_id);
    const posicao = tasks.length + 1;
    const responsavel_id = req.session.user.id;

    const nova = await Task.create({
      titulo,
      descricao,
      prioridade,
      coluna_id,
      responsavel_id,
      data_limite: null,
      posicao
    });

    res.json({ success: true, task: nova });

  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
};

/**
 * Busca detalhes de uma tarefa para edição
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getTaskDetails = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Não autorizado' });

  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Verifica se a tarefa pertence ao usuário
    const isOwner = await Column.isOwner(task.coluna_id, req.session.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(task);

  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    res.status(500).json({ error: 'Erro ao buscar tarefa' });
  }
};

/**
 * Atualiza uma tarefa existente
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.editTask = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Não autorizado' });

  const { taskId } = req.params;
  const { titulo, descricao, prioridade } = req.body;

  try {
    // Busca a tarefa para verificar propriedade
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Verifica se a tarefa pertence ao usuário
    const isOwner = await Column.isOwner(task.coluna_id, req.session.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const updated = await Task.update({ id: taskId, titulo, descricao, prioridade });
    res.json({ success: true, task: updated });

  } catch (error) {
    console.error('Erro ao editar tarefa:', error);
    res.status(500).json({ error: 'Erro ao editar tarefa' });
  }
};

/**
 * Remove uma tarefa
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.deleteTask = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Não autorizado' });

  const { taskId } = req.params;

  try {
    // Busca a tarefa para verificar propriedade
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Verifica se a tarefa pertence ao usuário
    const isOwner = await Column.isOwner(task.coluna_id, req.session.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const deleted = await Task.remove(taskId);
    if (deleted) {
      res.json({ success: true, message: 'Tarefa removida com sucesso' });
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }

  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
};

/**
 * Move uma tarefa para outra coluna ou posição
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.moveTask = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Não autorizado' });

  const { taskId } = req.params;
  const { newColumnId, newPosition } = req.body;

  try {
    // Busca a tarefa para verificar propriedade
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Verifica se ambas as colunas pertencem ao usuário
    const isOwnerOld = await Column.isOwner(task.coluna_id, req.session.user.id);
    const isOwnerNew = await Column.isOwner(newColumnId, req.session.user.id);

    if (!isOwnerOld || !isOwnerNew) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const movedTask = await Task.moveToColumn(taskId, newColumnId, newPosition);
    res.json({ success: true, task: movedTask });

  } catch (error) {
    console.error('Erro ao mover tarefa:', error);
    res.status(500).json({ error: 'Erro ao mover tarefa' });
  }
};