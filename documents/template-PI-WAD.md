# Web Application Document - Projeto Individual - Módulo 2 - Inteli

**_Os trechos em itálico servem apenas como guia para o preenchimento da seção. Por esse motivo, não devem fazer parte da documentação final._**

## Nome do Projeto

#### Autor do projeto

## Sumário

1. [Introdução](#c1)  
2. [Visão Geral da Aplicação Web](#c2)  
3. [Projeto Técnico da Aplicação Web](#c3)  
4. [Desenvolvimento da Aplicação Web](#c4)  
5. [Referências](#c5)  

<br>

## <a name="c1"></a>1. Introdução (Semana 01)

O projeto consiste no desenvolvimento de uma aplicação web voltada para o gerenciamento de tarefas, com o objetivo de promover a organização pessoal e aumentar a produtividade dos usuários. A plataforma permite que os usuários criem, editem, visualizem e organizem suas tarefas diárias de forma prática e eficiente, auxiliando na gestão do tempo e no cumprimento de metas.
Entre as principais funcionalidades, destacam-se a criação de tarefas com prazos definidos, a categorização por prioridade, a marcação de estado (pendente, em andamento, concluída) e a possibilidade de edição e exclusão de atividades, tendo apoio em metodologias de produtividade, como os métodos kamban e SCRUM. Além disso, será implementado um sistema de notificação para lembrar os usuários de tarefas próximas ao vencimento, contribuindo para a organização contínua e a redução da procrastinação.
O desenvolvimento da aplicação utilizará tecnologias modernas como HTML, CSS, JavaScript e frameworks de apoio. O projeto também aplicará princípios de usabilidade e design centrado no usuário, buscando atender às necessidades reais de quem busca melhorar seu desempenho pessoal e profissional.

## <a name="c2"></a>2. Visão Geral da Aplicação Web

### 2.1. Personas (Semana 01)

<div align="center">
    <strong style="font-size: 18px;"><sub></sub></strong><br>
<img src="assets/Persona.png" width="%"
    alt="Persona"><br>
    <sup>Fonte: Desenvolvido pelo autor</sup>
  </div>


### 2.2. User Stories (Semana 01)

<div align="center">
    <strong style="font-size: 18px;"><sub></sub></strong><br>
<img src="assets/US01.png" width="%"
    alt="Persona"><br>
    <sup>Fonte: Desenvolvido pelo autor</sup>
  </div>


| Critério | Análise |
|----------|---------|
| **I - Independente** | Sim. Pode ser desenvolvida sem depender de outras funcionalidades. |
| **N - Negociável**   | Sim. A forma como a tarefa é criada, validada ou exibida pode ser discutida com o time. |
| **V - Valiosa**      | Sim. Entrega valor direto ao usuário ao permitir melhor organização. |
| **E - Estimável**    | Sim. É possível estimar o esforço de desenvolvimento com clareza. |
| **S - Small**        | Sim. Tem escopo bem definido (criar tarefa + notificação). |
| **T - Testável**     | Sim. Pode ser testada funcionalmente e via interface. |

<div align="center">
    <strong style="font-size: 18px;"><sub></sub></strong><br>
<img src="assets/US02.png" width="%"
    alt="Persona"><br>
    <sup>Fonte: Desenvolvido pelo autor</sup>
  </div>

| Critério | Análise |
|----------|---------|
| **I - Independente** | Sim. A categorização pode ser implementada sem outras funcionalidades. |
| **N - Negociável**   | Sim. Pode-se negociar quais categorias usar ou como representar visualmente. |
| **V - Valiosa**      | Sim. Ajuda a organizar melhor diferentes áreas da vida do usuário. |
| **E - Estimável**    | Sim. As tarefas de desenvolvimento são claras e mensuráveis. |
| **S - Small**        | Sim. Pequena e objetiva. |
| **T - Testável**     | Sim. Pode ser testada por filtragem e visualização de categorias. |

<div align="center">
    <strong style="font-size: 18px;"><sub></sub></strong><br>
<img src="assets/US03.png" width="%"
    alt="Persona"><br>
    <sup>Fonte: Desenvolvido pelo autor</sup>
  </div>

| Critério | Análise |
|----------|---------|
| **I - Independente** | Sim. Não depende da criação de novas tarefas ou visualizações. |
| **N - Negociável**   | Sim. A forma como se marca ou representa a conclusão pode ser adaptada. |
| **V - Valiosa**      | Sim. Dá senso de progresso e alívio ao usuário. |
| **E - Estimável**    | Sim. Fácil de estimar tempo e esforço de implementação. |
| **S - Small**        | Sim. Tem escopo bastante reduzido. |
| **T - Testável**     | Sim. Pode ser testada pela alteração de status da tarefa. |

## <a name="c3"></a>3. Projeto da Aplicação Web

### 3.1. Modelagem do banco de dados  (Semana 3)

#### Esquema de Modelo Relacional

<div align="center">
    <strong style="font-size: 18px;"><sub></sub></strong><br>
<img src="assets/modelo_logico_bd.png" width="%"
    alt="Modelo Relacional"><br>
    <sup>Fonte: Desenvolvido pelo autor</sup>
  </div>

#### Modelo físico do Banco de Dados:

##### Criação de Tabelas

```jsx
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
```

##### Popular Tabela

```jsx
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

```

### 3.1.1 BD e Models (Semana 5)
*Descreva aqui os Models implementados no sistema web*

### 3.2. Arquitetura (Semana 5)

*Posicione aqui o diagrama de arquitetura da sua solução de aplicação web. Atualize sempre que necessário.*

**Instruções para criação do diagrama de arquitetura**  
- **Model**: A camada que lida com a lógica de negócios e interage com o banco de dados.
- **View**: A camada responsável pela interface de usuário.
- **Controller**: A camada que recebe as requisições, processa as ações e atualiza o modelo e a visualização.
  
*Adicione as setas e explicações sobre como os dados fluem entre o Model, Controller e View.*

### 3.3. Wireframes (Semana 03)

*Posicione aqui as imagens do wireframe construído para sua solução e, opcionalmente, o link para acesso (mantenha o link sempre público para visualização).*

### 3.4. Guia de estilos (Semana 05)

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução.*


### 3.5. Protótipo de alta fidelidade (Semana 05)

*Posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização).*

### 3.6. WebAPI e endpoints (Semana 05)

*Utilize um link para outra página de documentação contendo a descrição completa de cada endpoint. Ou descreva aqui cada endpoint criado para seu sistema.*  

### 3.7 Interface e Navegação (Semana 07)

*Descreva e ilustre aqui o desenvolvimento do frontend do sistema web, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

---

## <a name="c4"></a>4. Desenvolvimento da Aplicação Web (Semana 8)

### 4.1 Demonstração do Sistema Web (Semana 8)

*VIDEO: Insira o link do vídeo demonstrativo nesta seção*
*Descreva e ilustre aqui o desenvolvimento do sistema web completo, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

### 4.2 Conclusões e Trabalhos Futuros (Semana 8)

*Indique pontos fortes e pontos a melhorar de maneira geral.*
*Relacione também quaisquer outras ideias que você tenha para melhorias futuras.*



## <a name="c5"></a>5. Referências

_Incluir as principais referências de seu projeto, para que seu parceiro possa consultar caso ele se interessar em aprofundar. Um exemplo de referência de livro e de site:_<br>

---
---