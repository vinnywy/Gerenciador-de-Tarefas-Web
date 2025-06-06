// controllers/LoginController.js

exports.loginPage = (req, res) => {
  res.render('login', { error: null });
};

/*
exports.login = async (req, res) => {
  const { email } = req.body;
  // Em vez de buscar no banco, apenas simule um usuário autenticado
  req.session.user = {
    id: 1, // pode ser qualquer valor
    name: 'Usuário Demo',
    email: email
  };
  return res.redirect('/boards');
};
*/

exports.login = async (req, res) => {
  const { email } = req.body;
  let name = 'Usuário Demo';
  if (email === 'ana.souza@example.com') name = 'Ana Souza';
  // Você pode adicionar outros emails/nome aqui se quiser
  req.session.user = { id: 1, name, email };
  return res.redirect('/boards');
};
/*
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
      // Salva usuário na sessão
      req.session.user = user;
      return res.redirect('/boards');
    } else {
      return res.render('login', { error: 'Usuário não existe' });
    }
  } catch (err) {
    return res.render('login', { error: 'Erro ao tentar logar. Tente novamente.' });
  }
}; 
*/