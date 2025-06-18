const Board = require('../models/Board');

/**
  Renderiza a página de boards do usuário
  @param {Object} req - Objeto de requisição do Express
  @param {Object} res - Objeto de resposta do Express
 */
exports.getBoards = async (req, res) => {
  // O middleware de autenticação já garante que req.user existe
  const user = req.user;

  try {
    // Busca todos os boards do usuário logado
    const boards = await Board.findByUserId(user.id);

    console.log(`Carregando boards para usuário: ${user.name} (${boards.length} boards)`);

    res.render('boards', {
      user,
      boards,
      error: null,
      success: null,
      title: 'Meus Boards - Kanban'
    });
  } catch (error) {
    console.error('Erro ao buscar boards:', error);

    res.render('boards', {
      user,
      boards: [],
      error: 'Erro ao carregar seus boards. Tente novamente.',
      success: null,
      title: 'Meus Boards - Kanban'
    });
  }
};

/**
  Cria um novo board para o usuário
  @param {Object} req - Objeto de requisição do Express
  @param {Object} res - Objeto de resposta do Express
 */
exports.createBoard = async (req, res) => {
  const { nome, descricao } = req.body;
  const user = req.user;

  try {
    // Validação básica
    if (!nome || !nome.trim()) {
      // Verifica se é uma requisição AJAX
      if (req.headers['content-type'] === 'application/json') {
        return res.status(400).json({
          success: false,
          error: 'Nome do board é obrigatório.'
        });
      }

      const boards = await Board.findByUserId(user.id);
      return res.render('boards', {
        user,
        boards,
        error: 'Nome do board é obrigatório.',
        title: 'Meus Boards - Kanban'
      });
    }

    // Cria o novo board
    const newBoard = await Board.create({
      nome: nome.trim(),
      descricao: descricao ? descricao.trim() : null,
      usuario_id: user.id
    });

    console.log(`Novo board criado: "${nome}" por ${user.name}`);

    // Verifica se é uma requisição AJAX
    if (req.headers['content-type'] === 'application/json') {
      return res.json({
        success: true,
        message: 'Board criado com sucesso',
        board: newBoard
      });
    }

    return res.redirect('/boards');

  } catch (error) {
    console.error('Erro ao criar board:', error);

    // Verifica se é uma requisição AJAX
    if (req.headers['content-type'] === 'application/json') {
      return res.status(500).json({
        success: false,
        error: 'Erro ao criar board. Tente novamente.'
      });
    }

    try {
      const boards = await Board.findByUserId(user.id);
      res.render('boards', {
        user,
        boards,
        error: 'Erro ao criar board. Tente novamente.',
        title: 'Meus Boards - Kanban'
      });
    } catch (fetchError) {
      console.error('Erro ao buscar boards após falha na criação:', fetchError);
      res.render('boards', {
        user,
        boards: [],
        error: 'Erro ao criar board. Tente novamente.',
        success: null,
        title: 'Meus Boards - Kanban'
      });
    }
  }
};

/**
  Exibe detalhes de um board específico (modal/popup)
  @param {Object} req - Objeto de requisição do Express
  @param {Object} res - Objeto de resposta do Express
 */
exports.getBoardDetails = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    // Busca o board específico
    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        error: 'Board não encontrado'
      });
    }

    // Verifica se o usuário é proprietário do board
    if (board.usuario_id !== user.id) {
      return res.status(403).json({
        error: 'Você não tem permissão para acessar este board'
      });
    }

    res.json({
      success: true,
      board: {
        id: board.id,
        nome: board.nome,
        descricao: board.descricao,
        criado_em: board.criado_em,
        total_colunas: board.total_colunas || 0,
        total_tarefas: board.total_tarefas || 0
      }
    });

  } catch (error) {
    console.error('Erro ao buscar detalhes do board:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
  Atualiza um board existente
  @param {Object} req - Objeto de requisição do Express
  @param {Object} res - Objeto de resposta do Express
 */
exports.updateBoard = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  const user = req.user;

  try {
    // Verifica se o board existe e se o usuário é proprietário
    const isOwner = await Board.isOwner(id, user.id);
    if (!isOwner) {
      return res.status(403).json({
        error: 'Você não tem permissão para editar este board'
      });
    }

    // Validação básica
    if (!nome || !nome.trim()) {
      return res.status(400).json({
        error: 'Nome do board é obrigatório'
      });
    }

    // Atualiza o board
    const updatedBoard = await Board.update(id, {
      nome: nome.trim(),
      descricao: descricao ? descricao.trim() : null
    });

    if (!updatedBoard) {
      return res.status(404).json({
        error: 'Board não encontrado'
      });
    }

    console.log(`Board atualizado: "${nome}" por ${user.name}`);
    res.json({
      success: true,
      message: 'Board atualizado com sucesso',
      board: updatedBoard
    });

  } catch (error) {
    console.error('Erro ao atualizar board:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
  Remove um board
  @param {Object} req - Objeto de requisição do Express
  @param {Object} res - Objeto de resposta do Express
 */
exports.deleteBoard = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    // Verifica se o board existe e se o usuário é proprietário
    const isOwner = await Board.isOwner(id, user.id);
    if (!isOwner) {
      return res.status(403).json({
        error: 'Você não tem permissão para excluir este board'
      });
    }

    // Remove o board
    const deleted = await Board.remove(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Board não encontrado'
      });
    }

    console.log(`Board removido por ${user.name}`);
    res.json({
      success: true,
      message: 'Board removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover board:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};