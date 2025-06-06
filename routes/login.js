const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');

router.get('/login', LoginController.loginPage);
router.post('/login', LoginController.login);

module.exports = router; // TEM QUE EXPORTAR SÓ O ROUTER!