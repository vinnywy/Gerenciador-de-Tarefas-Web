const express = require('express');
const router = express.Router();
const BoardsController = require('../controllers/BoardsController');

/**
 * Middleware de autenticação
 * Verifica se o usuário está logado antes de acessar as rotas protegidas
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função para continuar para o próximo middleware
 */
function auth(req, res, next) {
  if (!req.session.user) {
    console.log('Usuário não autenticado tentando acessar rota protegida');
    return res.redirect('/login');
  }

  // Adiciona informações do usuário ao objeto req para uso nos controllers
  req.user = req.session.user;
  next();
}

/**
 * Rotas relacionadas aos boards (quadros Kanban)
 * Todas as rotas requerem autenticação
 */

// Rota para listar boards do usuário
router.get('/boards', auth, BoardsController.getBoards);

// Rota para criar novo board
router.post('/boards', auth, BoardsController.createBoard);

// Rota para obter detalhes de um board específico (AJAX)
router.get('/boards/:id/details', auth, BoardsController.getBoardDetails);

// Rota para atualizar um board (AJAX)
router.put('/boards/:id', auth, BoardsController.updateBoard);

// Rota para excluir um board (AJAX)
router.delete('/boards/:id', auth, BoardsController.deleteBoard);

module.exports = router;