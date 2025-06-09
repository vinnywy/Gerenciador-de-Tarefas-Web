const express = require('express');
const router = express.Router();
const KanbanController = require('../controllers/KanbanController');

function auth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

router.get('/:boardId', auth, KanbanController.getKanban);
router.post('/:boardId/columns', auth, KanbanController.createColumn);
router.post('/columns/:columnId/edit', auth, KanbanController.editColumn);
router.post('/tasks', auth, KanbanController.createTask);
router.post('/tasks/:taskId/edit', auth, KanbanController.editTask);

module.exports = router;