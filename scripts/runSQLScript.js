const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

/**
 * Script para executar o arquivo SQL de inicialização do banco de dados
 * Cria as tabelas e insere dados de teste
 */

async function checkTablesExist() {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'boards', 'columns', 'tasks', 'comments')
    `);
    return result.rows.map(row => row.table_name);
  } catch (error) {
    return [];
  }
}

async function runSQLScript() {
  try {
    console.log('🚀 Iniciando configuração do banco de dados...\n');

    // Verifica se as tabelas já existem
    const existingTables = await checkTablesExist();

    if (existingTables.length > 0) {
      console.log('✅ Banco de dados já está configurado!');
      console.log('📊 Tabelas existentes:');
      existingTables.forEach(table => console.log(`   - ${table}`));
      console.log('\n🚀 Você pode iniciar a aplicação com: npm run dev');
      console.log('🌐 Acesse: http://localhost:3000');
      return;
    }

    // Lê o arquivo SQL
    const sqlPath = path.join(__dirname, 'init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Executando script de inicialização...');

    // Executa o script SQL
    await pool.query(sqlContent);

    console.log('✅ Banco de dados configurado com sucesso!');
    console.log('\n📊 Estrutura criada:');
    console.log('   - Tabelas: users, boards, columns, tasks, comments');
    console.log('   - 4 usuários de teste');
    console.log('   - 2 boards de exemplo');
    console.log('   - Colunas e tarefas de demonstração');

    console.log('\n🔐 Emails para login:');
    console.log('   - ana.souza@example.com');
    console.log('   - carlos.lima@example.com');
    console.log('   - bia.ramos@example.com');
    console.log('   - daniel.rocha@example.com');

    console.log('\n🎉 Configuração concluída!');
    console.log('🚀 Inicie a aplicação com: npm run dev');

  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error.message);

    if (error.message.includes('already exists')) {
      console.log('\n✅ As tabelas já existem - banco já configurado!');
      console.log('🚀 Inicie a aplicação com: npm run dev');
    } else {
      console.log('\n💡 Verifique:');
      console.log('   - PostgreSQL está rodando?');
      console.log('   - Configurações no arquivo .env estão corretas?');
      console.log('   - Banco "kanban_db" existe?');
    }

    process.exit(1);
  } finally {
    // Fecha a conexão com o banco
    await pool.end();
  }
}

// Executar o script se chamado diretamente
if (require.main === module) {
  runSQLScript();
}

module.exports = runSQLScript;