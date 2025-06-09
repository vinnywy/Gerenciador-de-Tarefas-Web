const Board = require('../models/Board');

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

// Cria novo board
exports.createBoard = async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const { nome, descricao } = req.body;
  const usuario_id = req.session.user.id;
  try {
    await Board.create({ nome, descricao, usuario_id });
    return res.redirect('/boards');
  } catch (e) {
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