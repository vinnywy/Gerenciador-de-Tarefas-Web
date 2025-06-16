const express = require('express');
const router = express.Router();
const KanbanController = require('../controllers/KanbanController');

/**
 * Middleware de autenticação
 * Verifica se o usuário está logado
 */
function auth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

// Rotas do Kanban

// Visualização do board
router.get('/:boardId', auth, KanbanController.getKanban);

// Gerenciamento de colunas
router.post('/:boardId/columns', auth, KanbanController.createColumn);
router.put('/columns/:columnId', auth, KanbanController.editColumn);
router.delete('/columns/:columnId', auth, KanbanController.deleteColumn);

// Gerenciamento de tarefas
router.post('/tasks', auth, KanbanController.createTask);
router.get('/tasks/:taskId', auth, KanbanController.getTaskDetails);
router.put('/tasks/:taskId', auth, KanbanController.editTask);
router.delete('/tasks/:taskId', auth, KanbanController.deleteTask);
router.put('/tasks/:taskId/move', auth, KanbanController.moveTask);

// Rotas de compatibilidade (para manter funcionamento com código existente)
router.post('/columns/:columnId/edit', auth, KanbanController.editColumn);
router.post('/tasks/:taskId/edit', auth, KanbanController.editTask);

module.exports = router;