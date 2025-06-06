const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const loginRoutes = require('./routes/login');
// ... outros requires

const app = express();
// ... configs de cors, etc

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.use('/', loginRoutes);
// app.use('/boards', boardsRoutes); // configure depois

// ... listen

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});