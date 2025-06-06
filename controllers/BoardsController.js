// controllers/BoardsController.js
const Board = require('../models/Board');
const pool = require('../config/database');

// Renderiza a view de boards
exports.getBoards = async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const user = req.session.user;
  try {
    const boards = await Board.findByUserId(user.id);
    res.render('boards', {
      user,
      boards,
      error: null
    });
  } catch (e) {
    res.render('boards', {
      user,
      boards: [],
      error: 'Erro ao buscar boards'
    });
  }
};

// Cria novo board e redireciona para kanban (ou para boards, caso queira implementar o kanban depois)
exports.createBoard = async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const { nome, descricao } = req.body;
  const usuario_id = req.session.user.id;
  try {
    const newBoard = await Board.create({ nome, descricao, usuario_id });
    // Você pode redirecionar para a página kanban do board criado:
    // return res.redirect(`/kanban/${newBoard.id}`);
    // Por enquanto, redireciona para boards:
    return res.redirect('/boards');
  } catch (e) {
    // Exibe erro na tela de boards
    const boards = await Board.findByUserId(usuario_id);
    res.render('boards', {
      user: req.session.user,
      boards,
      error: 'Erro ao criar board'
    });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};