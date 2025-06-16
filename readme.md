# Inteli - Instituto de Tecnologia e Liderança 

# Projeto individual 

## Organizador de Tarefas

## 👩‍🏫 Professores:

### Orientador(a) 
- <a href="https://www.linkedin.com/in/juliastateri/">Júlia Stateri</a>

### Instrutores
- <a href="https://www.linkedin.com/in/cristiano-benites-ph-d-687647a8/">Cristiano Benites</a>
- <a href="https://www.linkedin.com/in/bruna-mayer/">Bruna Mayer</a> 


## 📜 Descrição

Esta aplicação web foi desenvolvida para ajudar no gerenciamento de tarefas, focando na organização pessoal e no aumento da produtividade. Com ela, usuários podem criar, editar, visualizar e organizar tarefas de forma simples e eficiente.

#### ⚙️ Funcionalidades principais
- Criação de tarefas com prazos e prioridades

- Estados: pendente, em andamento e concluída

- Organização com métodos como Kanban e SCRUM

- Edição, exclusão e categorização de atividades

- O projeto usa HTML, CSS, JavaScript e frameworks modernos, com foco em usabilidade e design centrado no usuário.




## 📁 Estrutura de pastas

├── 📁 assets/ # Assets e recursos do projeto
│ ├── 🖼️ Logo.png # Logo da aplicação
│ └── 🖼️ modelo_logico_bd.png # Modelo do banco de dados
│
├── 📁 config/ # Configurações do sistema
│ └── 📄 database.js # Configuração do PostgreSQL
│
├── 📁 controllers/ # Controladores MVC
│ ├── 📄 BoardsController.js # Lógica dos quadros
│ ├── 📄 KanbanController.js # Lógica do kanban
│ └── 📄 LoginController.js # Lógica de autenticação
│
├── 📁 models/ # Modelos de dados
│ ├── 📄 Board.js # Model dos quadros
│ ├── 📄 Column.js # Model das colunas
│ ├── 📄 Task.js # Model das tarefas
│ └── 📄 User.js # Model dos usuários
│
├── 📁 public/ # Assets públicos (frontend)
│ ├── 📁 css/ # Estilos CSS
│ │ ├── 📄 boards.css # Estilos do dashboard
│ │ ├── 📄 kanban.css # Estilos da interface kanban
│ │ └── 📄 login.css # Estilos da página de login
│ ├── 📁 images/ # Imagens públicas
│ │ └── 🖼️ Logo.png # Logo para o frontend
│ └── 📁 js/ # JavaScript do frontend
│ ├── 📄 boards.js # Lógica do dashboard
│ └── 📄 kanban.js # Drag & drop e interações
│
├── 📁 routes/ # Rotas da aplicação
│ ├── 📄 boards.js # Rotas dos quadros
│ ├── 📄 kanban.js # Rotas do kanban
│ └── 📄 login.js # Rotas de autenticação
│
├── 📁 scripts/ # Scripts de banco de dados
│ ├── 📄 init.sql # Script de inicialização do BD
│ └── 📄 runSQLScript.js # Executor de scripts SQL
│
├── 📁 views/ # Templates EJS
│ ├── 📄 boards.ejs # Página do dashboard
│ ├── 📄 error.ejs # Página de erro
│ ├── 📄 kanban.ejs # Interface kanban
│ └── 📄 login.ejs # Página de login
│
├── 📄 package.json # Dependências e scripts npm
├── 📄 package-lock.json # Lock das versões
├── 📄 readme.md # Documentação do projeto
└── 📄 server.js # Servidor principal Express

### **Descrição Breve das Pastas Principais**

**📁 Backend (MVC)**
- `controllers/` - Lógica de negócio e manipulação de requisições
- `models/` - Interação com banco de dados e validações
- `routes/` - Definição de endpoints e middlewares
- `config/` - Configurações de banco e ambiente

**📁 Frontend**
- `public/css/` - Estilos responsivos para cada página
- `public/js/` - JavaScript para interatividade e AJAX
- `views/` - Templates EJS para renderização server-side
- `public/images/` - Assets visuais da aplicação

**📁 Banco de Dados**
- `scripts/` - Scripts SQL para criação e inicialização

**📁 Configuração**
- `package.json` - Dependências e scripts npm
- `server.js` - Ponto de entrada da aplicação


Dentre os arquivos e pastas presentes na raiz do projeto, definem-se:

- <b>assets</b>: aqui estão pastas que contêm elementos não-estruturados deste repositório, como imagens.

- <b>controllers</b>: Contém os controllers da aplicação. Eles fazem a ponte entre as requisições do usuário e a lógica de negócio, definindo o que acontece quando uma rota é acessada.

- <b>document</b>: aqui está o documento do projeto, o Web Aplication Document (WAD).

- <b>routes</b>: Agrupa e organiza as rotas da aplicação. Centraliza os caminhos e define qual controller será chamado para cada rota.

- <b>routes/index.js</b>: Define as rotas principais e conecta elas aos controllers certos.

- <b>scripts</b>: Scripts JavaScript públicos (geralmente usados no navegador).

- <b>README.md</b>: Arquivo que serve como guia e explicação geral sobre o projeto e o jogo (o mesmo que você está lendo agora).

- <b>tests</b>: Testes unitários e de integração.

# 📄 Arquivos Importantes
- <b>.gitignore</b>: Define quais arquivos devem ser ignorados pelo Git.

- <b>.env.example</b>: Exemplo de arquivo .env com variáveis de ambiente necessárias para rodar o projeto.

- <b>jest.config.js</b>: Configurações do Jest para testes automatizados.

- <b>package.json / package-lock.json</b>: Arquivos que listam dependências e scripts do Node.js.

- <b>readme.md</b>: Documentação principal do projeto.

- <b>server.js</b>: Ponto de entrada da aplicação — inicializa o servidor e carrega as rotas.

- <b>rest.http</b>: (Opcional) Arquivo usado para testar endpoints da API diretamente em editores como o VSCode.

## 🔧 Como executar o código

### 🚀 Instalação e Uso - Sistema Kanban

### 📋 **Pré-requisitos**

#### **Software Necessário**
- **Node.js** (versão 16 ou superior)
- **PostgreSQL** (versão 12 ou superior)
- **npm** (incluído com Node.js)
- **Git** (para clonar o repositório)

#### **Verificar Instalações**
```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar PostgreSQL
psql --version
```

### 🔧 **Instalação**

#### **1. Clonar o Repositório**
```bash
git clone <url-do-repositorio>
cd sistema-kanban
```

#### **2. Instalar Dependências**
```bash
npm install
```

#### **3. Configurar Banco de Dados**

##### **Criar Banco PostgreSQL**
```sql
-- Conectar ao PostgreSQL
psql -U postgres

-- Criar banco de dados
CREATE DATABASE kanban_db;

-- Criar usuário (opcional)
CREATE USER kanban_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE kanban_db TO kanban_user;
```

##### **Configurar Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto:
```bash
# .env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/kanban_db
SESSION_SECRET=seu_secret_muito_seguro_aqui
```

#### **4. Inicializar Banco de Dados**
```bash
# Executar script de inicialização
npm run init-db
```

Este comando criará todas as tabelas e inserirá dados de exemplo.

#### **5. Executar o Sistema**
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

#### **6. Acessar o Sistema**
Abra o navegador e acesse:
```
http://localhost:3000
```

### 👤 **Usuários de Teste**

#### **Emails Pré-cadastrados**
Use qualquer um destes emails para fazer login:

- `ana.souza@example.com` - Ana Souza
- `carlos.lima@example.com` - Carlos Lima  
- `bia.ramos@example.com` - Beatriz Ramos
- `daniel.rocha@example.com` - Daniel Rocha

**Nota**: O sistema usa apenas email para login (sem senha).

### 🎯 **Como Usar o Sistema**

#### **1. 🔐 Login**
1. Acesse `http://localhost:3000`
2. Digite um dos emails de teste
3. Clique em "Entrar"
4. Será redirecionado para a lista de boards

#### **2. 📋 Gerenciar Boards**

##### **Criar Novo Board**
1. Na tela de boards, clique no botão "+" 
2. Preencha nome e descrição
3. Clique "Criar Board"

##### **Editar Board**
1. Clique nos três pontos (⋮) do board
2. Selecione "Editar"
3. Modifique os dados
4. Clique "Salvar"

##### **Excluir Board**
1. Clique nos três pontos (⋮) do board
2. Selecione "Excluir"
3. Confirme a exclusão

##### **Acessar Kanban**
1. Clique no card do board
2. Será redirecionado para o kanban

#### **3. 🎯 Usar o Kanban**

##### **Criar Coluna**
1. No final das colunas, há um formulário
2. Digite o nome da coluna
3. Clique "Adicionar coluna"

##### **Editar Nome da Coluna**
1. Clique no título da coluna
2. Digite o novo nome
3. Pressione Enter ou clique fora para salvar
4. Pressione Escape para cancelar

##### **Excluir Coluna**
1. Clique nos três pontos (⋮) da coluna
2. Selecione "Excluir coluna"
3. Confirme a exclusão (todas as tarefas serão perdidas)

##### **Criar Tarefa**
1. Clique em "Adicionar tarefa" na coluna desejada
2. Preencha o título (obrigatório)
3. Opcionalmente preencha descrição e prioridade
4. Clique "Salvar"

##### **Editar Tarefa**
1. Clique no ícone de lápis (✏️) na tarefa
2. Modifique título, descrição ou prioridade
3. Clique "Salvar"

##### **Excluir Tarefa**
1. Clique no ícone de lixeira (🗑️) na tarefa
2. Confirme a exclusão

##### **Mover Tarefa (Drag & Drop)**
1. Clique e segure uma tarefa
2. Arraste para outra coluna
3. Solte para mover a tarefa
    

## 🗃 Histórico de lançamentos
* 1.1.1 - 09/05/2025
    - Integração do Banco de Dados.
    - Executável com node.js no host local.
    - Implementação de testes unitários e de integração.
* 1.1.2 - 15/06/2025
    - Implementação de Frontend.
    - Correção de Bugs.
    - Integração Frontend e Backend
    - Correção de autentiação.
    - Implementação de drag & drop.