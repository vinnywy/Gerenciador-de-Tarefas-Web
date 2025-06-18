const User = require('../models/User');

/**
  Renderiza a página de login
  @param {Object} req - Objeto de requisição do Express
  @param {Object} res - Objeto de resposta do Express
 */
exports.loginPage = (req, res) => {
  // Se o usuário já está logado, redireciona para boards
  if (req.session.user) {
    return res.redirect('/boards');
  }

  // Renderiza a página de login sem erro
  res.render('login', {
    error: null,
    title: 'Login - Kanban Board'
  });
};

/**
  Processa o login do usuário
  @param {Object} req - Objeto de requisição do Express
  @param {Object} res - Objeto de resposta do Express
 */
exports.login = async (req, res) => {
  const { email } = req.body;

  try {
    // Validação básica do email
    if (!email || !email.trim()) {
      return res.render('login', {
        error: 'Por favor, informe um email válido.',
        title: 'Login - Kanban Board'
      });
    }

    // Normaliza o email (remove espaços e converte para minúsculo)
    const normalizedEmail = email.trim().toLowerCase();

    // Busca o usuário no banco de dados
    const user = await User.findByEmail(normalizedEmail);

    if (user) {
      // Cria a sessão do usuário
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        create_at: user.create_at
      };

      console.log(`Login realizado com sucesso para: ${user.name} (${user.email})`);
      return res.redirect('/boards');
    } else {
      // Usuário não encontrado
      console.log(`Tentativa de login com email não cadastrado: ${normalizedEmail}`);
      return res.render('login', {
        error: 'Email não encontrado. Verifique se o email está correto.',
        title: 'Login - Kanban Board'
      });
    }
  } catch (error) {
    console.error('Erro durante o processo de login:', error);
    return res.render('login', {
      error: 'Erro interno do servidor. Tente novamente em alguns instantes.',
      title: 'Login - Kanban Board'
    });
  }
};

/**
  Realiza o logout do usuário
  @param {Object} req - Objeto de requisição do Express
  @param {Object} res - Objeto de resposta do Express
 */
exports.logout = (req, res) => {
  // Destrói a sessão do usuário
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
      return res.redirect('/boards');
    }

    console.log('Logout realizado com sucesso');
    res.redirect('/login');
  });
};