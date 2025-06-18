const Task = require('../models/Task');
const pool = require('../config/database');

/**
 * Script de teste para verificar se a edição de tarefas está funcionando
 */

async function testEditTask() {
  try {
    console.log(' Iniciando teste de edição de tarefa...');
    
    // Busca uma tarefa existente
    console.log(' Buscando tarefas existentes...');
    const existingTasks = await pool.query('SELECT * FROM tasks LIMIT 1');
    
    if (existingTasks.rows.length === 0) {
      console.log(' Nenhuma tarefa encontrada no banco. Criando uma tarefa de teste...');
      
      // Busca uma coluna existente
      const columns = await pool.query('SELECT * FROM columns LIMIT 1');
      if (columns.rows.length === 0) {
        console.log(' Nenhuma coluna encontrada. Execute o script de inicialização primeiro.');
        return;
      }
      
      // Cria uma tarefa de teste
      const newTask = await Task.create({
        titulo: 'Tarefa de Teste',
        descricao: 'Descrição de teste',
        prioridade: 'média',
        coluna_id: columns.rows[0].id,
        responsavel_id: 1,
        data_limite: null,
        posicao: 1
      });
      
      console.log(' Tarefa de teste criada:', newTask);
      
      // testa a edição
      console.log(' Testando edição da tarefa...');
      const updatedTask = await Task.update({
        id: newTask.id,
        titulo: 'Tarefa de Teste Editada',
        descricao: 'Descrição editada',
        prioridade: 'alta'
      });
      
      console.log(' Tarefa editada com sucesso:', updatedTask);
      
    } else {
      const task = existingTasks.rows[0];
      console.log(' Tarefa encontrada:', task);
      
      // Testa a edição
      console.log(' Testando edição da tarefa...');
      const updatedTask = await Task.update({
        id: task.id,
        titulo: task.titulo + ' (Editado)',
        descricao: (task.descricao || '') + ' - Teste de edição',
        prioridade: task.prioridade === 'alta' ? 'média' : 'alta'
      });
      
      console.log(' Tarefa editada com sucesso:', updatedTask);
    }
    
    console.log(' Teste de edição concluído com sucesso!');
    
  } catch (error) {
    console.error(' Erro no teste:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Fecha a conexão com o banco
    await pool.end();
    console.log(' Conexão com banco fechada');
  }
}

// Executa o teste se o script for chamado diretamente
if (require.main === module) {
  testEditTask();
}

module.exports = testEditTask;
