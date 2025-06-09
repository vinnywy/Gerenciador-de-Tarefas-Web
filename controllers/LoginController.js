const User = require('../models/User');

exports.loginPage = (req, res) => {
  res.render('login', { error: null });
};

exports.login = async (req, res) => {
  const { email } = req.body;
  try {
    // Bypass para Ana Souza
    if (email === 'ana.souza@example.com') {
      req.session.user = {
        id: 1,
        name: 'Ana Souza',
        email: 'ana.souza@example.com',
        create_at: new Date()
      };
      return res.redirect('/boards');
    }
    const user = await User.findByEmail(email);
    if (user) {
      req.session.user = user;
      return res.redirect('/boards');
    } else {
      return res.render('login', { error: 'Usuário não existe' });
    }
  } catch (err) {
    return res.render('login', { error: 'Erro ao tentar logar. Tente novamente.' });
  }
};