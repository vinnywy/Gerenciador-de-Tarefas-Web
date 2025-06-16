const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
require('dotenv').config(); // Carrega as variáveis de ambiente

const loginRoutes = require('./routes/login');
const boardsRoutes = require('./routes/boards');
const kanbanRoutes = require('./routes/kanban');

/**
 * Configuração do servidor Express
 * Aplicação web para gerenciamento de tarefas estilo Kanban
 * Segue arquitetura MVC
 */

const app = express();

// Middlewares para parsing de dados
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Para requisições fetch API

// Middleware para suportar métodos PUT e DELETE via formulários
app.use(methodOverride('_method'));

// Configuração de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuração de sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'kanban_secret_fallback',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Para desenvolvimento local
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware para logging de requisições (desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

// Configuração das rotas
app.use('/', loginRoutes);
app.use('/', boardsRoutes);
app.use('/kanban', kanbanRoutes);

// Middleware para tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).render('error', {
    error: 'Página não encontrada',
    message: 'A página que você está procurando não existe.',
    title: 'Erro 404'
  });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro interno do servidor:', err);
  res.status(500).render('error', {
    error: 'Erro interno do servidor',
    message: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
    title: 'Erro 500'
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
  console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});