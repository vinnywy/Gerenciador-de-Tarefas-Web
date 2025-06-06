// controllers/LoginController.js
const User = require('../models/User');

exports.loginPage = (req, res) => {
  res.render('login', { error: null });
};

exports.login = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (user) {
      // Usuário existe, redireciona para boards
      return res.redirect('/boards');
    } else {
      // Usuário não existe, exibe erro
      return res.render('login', { error: 'Usuário não existe' });
    }
  } catch (err) {
    return res.render('login', { error: 'Erro ao tentar logar. Tente novamente.' });
  }
};