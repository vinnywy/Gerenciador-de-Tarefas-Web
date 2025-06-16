const http = require('http');

async function testMoveTask() {
  try {
    console.log('🧪 Testando rota de mover tarefa...');
    
    // Simula uma requisição para mover tarefa
    const testData = {
      newColumnId: 5,
      newPosition: 1
    };
    
    console.log('📡 Dados de teste:', testData);
    console.log('🌐 URL de teste: http://localhost:3000/kanban/tasks/4/move');
    
    // Teste simples para verificar se o servidor está respondendo
    const postData = JSON.stringify(testData);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/kanban/tasks/4/move',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      console.log('📡 Status da resposta:', res.statusCode);
      console.log('📡 Headers da resposta:', res.headers);

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('📦 Resposta do servidor:', data);

        if (res.statusCode === 401) {
          console.log('✅ Servidor está funcionando (erro 401 esperado - não autenticado)');
        } else if (res.statusCode === 500) {
          console.log('❌ Erro 500 - problema no servidor');
          console.log('📋 Resposta completa:', data);
        } else {
          console.log('ℹ️ Status inesperado:', res.statusCode);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Erro na requisição:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Servidor não está rodando na porta 3000');
      }
    });

    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Servidor não está rodando na porta 3000');
    }
  }
}

testMoveTask();
