const http = require('http');

/**
 * Script de teste para verificar se a rota PUT /kanban/tasks/:id está funcionando
 */

async function testEditRoute() {
  try {
    console.log(' Testando rota de edição de tarefa...');
    
    // Dados de teste para editar uma tarefa
    const taskData = {
      titulo: 'Tarefa Editada via HTTP',
      descricao: 'Descrição editada via teste HTTP',
      prioridade: 'alta'
    };
    
    const postData = JSON.stringify(taskData);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/kanban/tasks/1', // Testando com ID 1
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Cookie': 'connect.sid=test' // Simula uma sessão (pode precisar de uma sessão real)
      }
    };
    
    const req = http.request(options, (res) => {
      console.log(` Status da resposta: ${res.statusCode}`);
      console.log(` Headers:`, res.headers);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(' Resposta do servidor:');
        try {
          const response = JSON.parse(data);
          console.log(response);
          
          if (response.success) {
            console.log(' Edição funcionou corretamente!');
          } else {
            console.log(' Erro na edição:', response.error);
          }
        } catch (e) {
          console.log(' Resposta (texto):', data);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(' Erro na requisição:', e.message);
    });
    
    // Envia os dados
    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error(' Erro no teste:', error.message);
  }
}

// Executa o teste
testEditRoute();

// Aguarda um pouco antes de finalizar
setTimeout(() => {
  console.log(' Teste finalizado');
  process.exit(0);
}, 3000);
