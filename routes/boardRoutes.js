const express = require('express');
const router = express.Router();
const BoardController = require('../controllers/BoardController');

router.get('/user/:userId', BoardController.getBoardsByUser);
router.post('/', BoardController.createBoard);

module.exports = router;