-- Usuários (dono dos boards e possíveis responsáveis pelas tarefas)
create table users (
  id SERIAL PRIMARY KEY,
  name text not null,
  email TEXT UNIQUE NOT NULL,
  create_at timestamp default now()
);

-- Quadros Kanban (ex: "Projeto X") pertencem a um usuário
create table boards (
  id SERIAL PRIMARY KEY,
  nome text not null,
  descricao text,
  usuario_id int references users(id) on delete cascade,
  criado_em timestamp default now()
);

-- Colunas do board (ex: "A Fazer", "Fazendo", "Concluído") pertencem a um board
create table columns (
  id SERIAL PRIMARY KEY,
  titulo text not null,
  posicao integer not null,
  board_id int references boards(id) on delete cascade,
  criado_em timestamp default now()
);

-- Tarefas estão dentro de colunas e podem ter um responsável (user)
create table tasks (
  id SERIAL PRIMARY KEY,
  titulo text not null,
  descricao text,
  prioridade text check (prioridade in ('baixa', 'média', 'alta')) default 'média',
  coluna_id int not null references columns(id) on delete cascade,
  responsavel_id int references users(id) on delete set null,
  data_criacao timestamp default now(),
  data_limite date,
  posicao integer
);

-- Comentários pertencem a uma tarefa e têm um autor
create table comments (
  id SERIAL PRIMARY KEY,
  content text not null,
  tarefa_id  int references tasks(id) on delete cascade,
  autor_id int references users(id) on delete set null,
  criado_em timestamp default now()
);


-- Preenchimento do banco de dados

-- Users
INSERT INTO users (name, email) VALUES
  ('Ana Souza', 'ana.souza@example.com'),
  ('Carlos Lima', 'carlos.lima@example.com'),
  ('Beatriz Ramos', 'bia.ramos@example.com'),
  ('Daniel Rocha', 'daniel.rocha@example.com');

-- Boards 
INSERT INTO boards (nome, descricao, usuario_id) VALUES
  ('Projeto App Fitness', 'Aplicativo de treinos personalizados', 1),
  ('TCC Engenharia', 'Gerenciamento do trabalho de conclusão de curso', 2);

-- Columns 
-- Para o board 1
INSERT INTO columns (titulo, posicao, board_id) VALUES
  ('A Fazer', 1, 1),
  ('Em Progresso', 2, 1),
  ('Concluído', 3, 1);

-- Para o board 2
INSERT INTO columns (titulo, posicao, board_id) VALUES
  ('Backlog', 1, 2),
  ('Desenvolvimento', 2, 2),
  ('Revisado', 3, 2);

-- tasks
-- Tarefas do board 1
INSERT INTO tasks (titulo, descricao, prioridade, coluna_id, responsavel_id, data_limite, posicao) VALUES
  ('Criar wireframe', 'Montar layout inicial no Figma', 'alta', 1, 1, '2025-05-15', 1),
  ('Implementar login', 'Tela de login com Supabase Auth', 'média', 2, 2, '2025-05-20', 1),
  ('Testes iniciais', 'Testes com usuários reais', 'baixa', 3, 3, '2025-05-25', 1);

-- Tarefas do board 2
INSERT INTO tasks (titulo, descricao, prioridade, coluna_id, responsavel_id, data_limite, posicao) VALUES
  ('Revisar bibliografia', 'Atualizar referências no TCC', 'média', 4, 2, '2025-05-18', 1),
  ('Implementar backend', 'API em Node.js com Express', 'alta', 5, 4, '2025-05-22', 1),
  ('Preparar apresentação', 'Slides pro dia da banca', 'média', 6, 1, '2025-05-30', 1);

-- comments
INSERT INTO comments (content, tarefa_id, autor_id) VALUES
  ('Já comecei o layout, vou subir no Figma hoje.', 1, 1),
  ('A autenticação está quase pronta.', 2, 2),
  ('Fiz alguns testes com o pessoal da sala.', 3, 3),
  ('Terminei de revisar a bibliografia.', 4, 2),
  ('A API está com as rotas funcionando!', 5, 4),
  ('Vamos usar o mesmo modelo de slide do ano passado?', 6, 1);