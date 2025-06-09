const express = require('express');
const router = express.Router();
const BoardsController = require('../controllers/BoardsController');

function auth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

router.get('/boards', auth, BoardsController.getBoards);
router.post('/boards', auth, BoardsController.createBoard);
router.post('/logout', BoardsController.logout);

module.exports = router;