const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');

/**
 * Rotas de autenticação - Seguindo o padrão MVC
 * Responsável por definir as rotas relacionadas ao login/logout
 */

// Rota raiz - redireciona para login se não estiver autenticado, senão para boards
router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/boards');
  }
  return res.redirect('/login');
});

// Rota para exibir a página de login
router.get('/login', LoginController.loginPage);

// Rota para processar o login
router.post('/login', LoginController.login);

// Rota para logout
router.post('/logout', LoginController.logout);

module.exports = router;