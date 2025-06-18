const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

/**
 * Script para executar migração que adiciona campo atualizado_em na tabela tasks
 */

async function runMigration() {
  try {
    console.log(' Iniciando migração...');
    
    // Lê o arquivo de migração
    const migrationPath = path.join(__dirname, 'migrate_add_atualizado_em.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log(' Arquivo de migração carregado');
    
    // Executa a migração
    await pool.query(migrationSQL);
    
    console.log(' Migração executada com sucesso!');
    console.log(' Campo atualizado_em adicionado à tabela tasks');
    
  } catch (error) {
    console.error(' Erro ao executar migração:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Fecha a conexão com o banco
    await pool.end();
    console.log(' Conexão com banco fechada');
  }
}

// Executa a migração se o script for chamado diretamente
if (require.main === module) {
  runMigration();
}

module.exports = runMigration;
