const pool = require('./config/database');

async function testDatabase() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...');
    
    // Teste de conexão
    const client = await pool.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Verifica estrutura da tabela tasks
    console.log('\n📋 Verificando estrutura da tabela tasks...');
    const tableStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'tasks'
      ORDER BY ordinal_position;
    `);
    
    console.log('Colunas da tabela tasks:');
    tableStructure.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Verifica se há tarefas na tabela
    console.log('\n📊 Verificando dados na tabela tasks...');
    const taskCount = await client.query('SELECT COUNT(*) as total FROM tasks');
    console.log(`Total de tarefas: ${taskCount.rows[0].total}`);
    
    // Verifica estrutura da tabela columns
    console.log('\n📋 Verificando estrutura da tabela columns...');
    const columnStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'columns' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);

    console.log('Colunas da tabela columns:');
    columnStructure.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // Verifica se há colunas na tabela
    const columnCount = await client.query('SELECT COUNT(*) as total FROM columns');
    console.log(`Total de colunas: ${columnCount.rows[0].total}`);
    
    // Teste de uma query simples de moveToColumn
    console.log('\n🧪 Testando query de exemplo...');
    const testQuery = await client.query(`
      SELECT t.id, t.titulo, t.coluna_id, c.titulo as coluna_titulo
      FROM tasks t
      JOIN columns c ON t.coluna_id = c.id
      LIMIT 5
    `);
    
    console.log('Tarefas de exemplo:');
    testQuery.rows.forEach(row => {
      console.log(`  - Tarefa ${row.id}: "${row.titulo}" na coluna "${row.coluna_titulo}"`);
    });

    // Teste específico da função moveToColumn
    console.log('\n🧪 Testando função moveToColumn...');
    if (testQuery.rows.length > 0) {
      const taskToMove = testQuery.rows[0];
      console.log(`Tentando mover tarefa ${taskToMove.id} para uma coluna diferente...`);

      // Busca uma coluna diferente
      const otherColumns = await client.query(`
        SELECT id, titulo FROM columns
        WHERE id != $1
        LIMIT 1
      `, [taskToMove.coluna_id]);

      if (otherColumns.rows.length > 0) {
        const targetColumn = otherColumns.rows[0];
        console.log(`Coluna de destino: ${targetColumn.titulo} (ID: ${targetColumn.id})`);

        // Simula a operação moveToColumn (sem executar)
        console.log('Query que seria executada:');
        console.log(`UPDATE tasks SET coluna_id = ${targetColumn.id}, posicao = 1 WHERE id = ${taskToMove.id}`);
        console.log('✅ Simulação da função moveToColumn bem-sucedida!');
      } else {
        console.log('⚠️ Não há colunas suficientes para testar moveToColumn');
      }
    }

    client.release();
    console.log('\n✅ Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste do banco de dados:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await pool.end();
  }
}

testDatabase();
