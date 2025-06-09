const Board = require('../models/Board');
const Column = require('../models/Column');
const Task = require('../models/Task');
const pool = require('../config/database');

// Renderiza a página Kanban de um board
exports.getKanban = async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const boardId = req.params.boardId;
  try {
    // Busca board, colunas e tasks em cada coluna
    const board = (await pool.query('SELECT * FROM boards WHERE id = $1', [boardId])).rows[0];
    if (!board) return res.redirect('/boards');
    const columns = await Column.findByBoardId(boardId);

    // Para cada coluna, pega as tasks
    for (let col of columns) {
      col.tasks = await Task.findByColumnId(col.id);
    }

    res.render('kanban', {
      user: req.session.user,
      board,
      columns,
      error: null
    });
  } catch (e) {
    res.render('kanban', {
      user: req.session.user,
      board: null,
      columns: [],
      error: 'Erro ao carregar o Kanban'
    });
  }
};

// Criar coluna
exports.createColumn = async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const boardId = req.params.boardId;
  const { titulo } = req.body;
  try {
    // A posição é o próximo número de colunas + 1
    const columns = await Column.findByBoardId(boardId);
    const posicao = columns.length + 1;
    await Column.create({ titulo, posicao, board_id: boardId });
    res.redirect(`/kanban/${boardId}`);
  } catch (e) {
    res.redirect(`/kanban/${boardId}`);
  }
};

// Editar título da coluna
exports.editColumn = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Não autorizado' });
  const { columnId } = req.params;
  const { titulo } = req.body;
  try {
    const updated = await Column.update({ id: columnId, titulo });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao editar coluna' });
  }
};

// Criar task
exports.createTask = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Não autorizado' });
  const { coluna_id } = req.body;
  const { titulo, descricao, prioridade } = req.body;
  try {
    // A posição é o próximo número de tasks + 1
    const tasks = await Task.findByColumnId(coluna_id);
    const posicao = tasks.length + 1;
    const responsavel_id = req.session.user.id;
    const nova = await Task.create({ titulo, descricao, prioridade, coluna_id, responsavel_id, data_limite: null, posicao });
    res.json(nova);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
};

// Editar task
exports.editTask = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Não autorizado' });
  const { taskId } = req.params;
  const { titulo, descricao, prioridade } = req.body;
  try {
    const updated = await Task.update({ id: taskId, titulo, descricao, prioridade });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao editar tarefa' });
  }
};