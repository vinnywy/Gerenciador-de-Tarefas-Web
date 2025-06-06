const boardModel = require('../models/boardModel');

exports.getBoardsByUser = async (req, res) => {
  try {
    const boards = await boardModel.getBoardsByUser(req.params.userId);
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBoard = async (req, res) => {
  const { nome, descricao, usuario_id } = req.body;
  try {
    const novoBoard = await boardModel.createBoard(nome, descricao, usuario_id);
    res.status(201).json(novoBoard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};