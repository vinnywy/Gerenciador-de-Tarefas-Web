const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const loginRoutes = require('./routes/login');
const boardsRoutes = require('./routes/boards');
const kanbanRoutes = require('./routes/kanban');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Para requisições fetch API
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'kanban_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Rotas
app.use('/', loginRoutes);
app.use('/', boardsRoutes);
app.use('/kanban', kanbanRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});