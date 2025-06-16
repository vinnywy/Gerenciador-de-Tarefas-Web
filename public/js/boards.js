/**
 * JavaScript para funcionalidades interativas da página de boards
 * Implementa modais, menus de contexto e operações AJAX
 */

// Variáveis globais
let currentBoardId = null;
let isEditMode = false;

/**
 * Abre o modal para criar um novo board
 */
function openCreateModal() {
  const modal = document.getElementById('boardModal');
  const overlay = document.getElementById('overlay');
  const modalTitle = document.getElementById('modalTitle');
  const submitBtn = document.getElementById('submitBtn');
  const form = document.getElementById('boardForm');
  
  // Configura o modal para criação
  modalTitle.textContent = 'Criar Novo Board';
  submitBtn.textContent = 'Criar Board';
  isEditMode = false;
  currentBoardId = null;
  
  // Limpa o formulário
  form.reset();
  
  // Exibe o modal
  modal.style.display = 'flex';
  overlay.style.display = 'block';
  
  // Foca no campo nome
  document.getElementById('boardName').focus();
}

/**
 * Abre o modal para editar um board existente
 * @param {number} boardId - ID do board a ser editado
 */
function openEditModal(boardId) {
  const modal = document.getElementById('boardModal');
  const overlay = document.getElementById('overlay');
  const modalTitle = document.getElementById('modalTitle');
  const submitBtn = document.getElementById('submitBtn');
  
  // Configura o modal para edição
  modalTitle.textContent = 'Editar Board';
  submitBtn.textContent = 'Salvar Alterações';
  isEditMode = true;
  currentBoardId = boardId;
  
  // Busca os dados do board
  fetch(`/boards/${boardId}/details`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('boardName').value = data.board.nome;
        document.getElementById('boardDescription').value = data.board.descricao || '';
        
        // Exibe o modal
        modal.style.display = 'flex';
        overlay.style.display = 'block';
        
        // Foca no campo nome
        document.getElementById('boardName').focus();
      } else {
        showNotification('Erro ao carregar dados do board', 'error');
      }
    })
    .catch(error => {
      console.error('Erro ao buscar detalhes do board:', error);
      showNotification('Erro ao carregar dados do board', 'error');
    });
}

/**
 * Fecha o modal
 */
function closeModal() {
  const modal = document.getElementById('boardModal');
  const overlay = document.getElementById('overlay');
  const contextMenu = document.getElementById('contextMenu');
  
  modal.style.display = 'none';
  overlay.style.display = 'none';
  contextMenu.style.display = 'none';
  
  // Limpa variáveis
  currentBoardId = null;
  isEditMode = false;
}

/**
 * Redireciona para a página do board (kanban)
 * @param {number} boardId - ID do board
 */
function goToBoard(boardId) {
  window.location.href = `/kanban/${boardId}`;
}

/**
 * Abre o menu de contexto para um board
 * @param {Event} event - Evento do clique
 * @param {number} boardId - ID do board
 */
function openBoardMenu(event, boardId) {
  event.stopPropagation();
  
  const contextMenu = document.getElementById('contextMenu');
  currentBoardId = boardId;
  
  // Posiciona o menu próximo ao cursor
  contextMenu.style.left = `${event.pageX}px`;
  contextMenu.style.top = `${event.pageY}px`;
  contextMenu.style.display = 'block';
  
  // Fecha o menu ao clicar fora
  document.addEventListener('click', closeContextMenu, { once: true });
}

/**
 * Fecha o menu de contexto
 */
function closeContextMenu() {
  const contextMenu = document.getElementById('contextMenu');
  contextMenu.style.display = 'none';
}

/**
 * Exibe detalhes do board em um alert (pode ser melhorado com modal)
 */
function viewBoardDetails() {
  if (!currentBoardId) return;
  
  fetch(`/boards/${currentBoardId}/details`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const board = data.board;
        const details = `
Nome: ${board.nome}
Descrição: ${board.descricao || 'Sem descrição'}
Criado em: ${new Date(board.criado_em).toLocaleDateString('pt-BR')}
Colunas: ${board.total_colunas}
Tarefas: ${board.total_tarefas}
        `.trim();
        
        alert(details);
      } else {
        showNotification('Erro ao carregar detalhes do board', 'error');
      }
    })
    .catch(error => {
      console.error('Erro ao buscar detalhes:', error);
      showNotification('Erro ao carregar detalhes do board', 'error');
    });
  
  closeContextMenu();
}

/**
 * Abre o modal de edição para o board atual
 */
function editBoard() {
  if (!currentBoardId) return;
  
  closeContextMenu();
  openEditModal(currentBoardId);
}

/**
 * Exclui o board atual após confirmação
 */
function deleteBoard() {
  if (!currentBoardId) return;
  
  const confirmation = confirm('Tem certeza que deseja excluir este board? Esta ação não pode ser desfeita.');
  
  if (confirmation) {
    fetch(`/boards/${currentBoardId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showNotification('Board excluído com sucesso', 'success');
        // Remove o card do board da página
        const boardCard = document.querySelector(`[data-board-id="${currentBoardId}"]`);
        if (boardCard) {
          boardCard.remove();
        }
        // Atualiza o contador
        updateBoardCount();
      } else {
        showNotification(data.error || 'Erro ao excluir board', 'error');
      }
    })
    .catch(error => {
      console.error('Erro ao excluir board:', error);
      showNotification('Erro ao excluir board', 'error');
    });
  }
  
  closeContextMenu();
}

/**
 * Exibe uma notificação temporária
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da notificação ('success' ou 'error')
 */
function showNotification(message, type = 'info') {
  // Remove notificações existentes
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(n => n.remove());
  
  // Cria nova notificação
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
    ${message}
  `;
  
  // Adiciona estilos
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 1002;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Remove após 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Atualiza o contador de boards na página
 */
function updateBoardCount() {
  const boardCards = document.querySelectorAll('.board-card[data-board-id]');
  const countElement = document.querySelector('.section-title span');
  const count = boardCards.length;
  
  if (countElement) {
    countElement.textContent = `(${count} ${count === 1 ? 'board' : 'boards'})`;
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Submissão do formulário de board
  const boardForm = document.getElementById('boardForm');
  if (boardForm) {
    boardForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = {
        nome: formData.get('nome'),
        descricao: formData.get('descricao')
      };
      
      const url = isEditMode ? `/boards/${currentBoardId}` : '/boards';
      const method = isEditMode ? 'PUT' : 'POST';
      
      // Desabilita o botão de submit
      const submitBtn = document.getElementById('submitBtn');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = isEditMode ? 'Salvando...' : 'Criando...';
      
      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          showNotification(data.message || (isEditMode ? 'Board atualizado com sucesso' : 'Board criado com sucesso'), 'success');
          closeModal();
          // Recarrega a página para mostrar as alterações
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showNotification(data.error || 'Erro ao processar solicitação', 'error');
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao processar solicitação', 'error');
      })
      .finally(() => {
        // Reabilita o botão
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
    });
  }
  
  // Fecha modal com ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  
  // Previne fechamento do modal ao clicar no conteúdo
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
});
