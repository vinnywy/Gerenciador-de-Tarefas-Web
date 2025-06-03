const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
router.get ("/", homeController.index);
module.exports = router ;

const TarefaController = require('../controllers/TarefaController');

// Rotas para o CRUD de tarefas
router.post('/tarefas', TarefaController.criarTarefa);
router.get('/tarefas', TarefaController.listarTarefas);
router.put('/tarefas/:id', TarefaController.editarTarefa);
router.delete('/tarefas/:id', TarefaController.excluirTarefa);

module.exports = router;