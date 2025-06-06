const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const loginRoutes = require('./routes/login');
const boardsRoutes = require('./routes/boards');
// ... outros requires

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuração da sessão
app.use(
  session({
    secret: 'kanban_secret', // troque por uma string forte em produção
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true se HTTPS
  })
);

// Rotas
app.use('/', loginRoutes);
app.use('/', boardsRoutes);
// app.use('/kanban', kanbanRoutes); // para o futuro

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});