/**
 * JavaScript para funcionalidades do Kanban
 * Implementa drag & drop, CRUD de tarefas e colunas
 */

// Variáveis globais
let currentTaskId = null;
let currentColumnId = null;
let isEditMode = false;
let draggedTask = null;

/**
 * Inicialização do Kanban
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 Inicializando Kanban...');
  console.log('📍 URL atual:', window.location.href);
  console.log('📋 Elementos encontrados:', {
    taskCards: document.querySelectorAll('.task-card').length,
    tasksLists: document.querySelectorAll('.tasks-list').length,
    kanbanColumns: document.querySelectorAll('.kanban-column').length
  });
  initializeKanban();
});

/**
 * Inicializa todas as funcionalidades do Kanban
 */
function initializeKanban() {
  // Event listeners globais
  setupGlobalEventListeners();

  // Inicializa drag and drop
  setupDragAndDrop();

  // Configura edição de títulos de colunas
  setupColumnTitleEditing();

  // Configura tooltips
  setupTooltips();

  console.log('✅ Kanban inicializado com sucesso!');
}

/**
 * Reinicializa o drag and drop (útil após adicionar novas tarefas)
 */
function reinitializeDragAndDrop() {
  console.log('🔄 Reinicializando drag and drop...');
  setupDragAndDrop();
  setupTooltips();
}

/**
 * Configura event listeners globais
 */
function setupGlobalEventListeners() {
  // Fecha modais com ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Event delegation para botões e ações
  document.addEventListener('click', function(e) {
    console.log('🖱️ Clique detectado em:', e.target);

    // Botão de menu da coluna
    if (e.target.closest('.column-menu-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.target.closest('.column-menu-btn');
      const columnId = parseInt(btn.dataset.columnId);
      console.log('📋 Abrindo menu da coluna:', columnId);
      openColumnMenu(e, columnId);
      return;
    }

    // Botão de adicionar tarefa
    if (e.target.closest('.add-task-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.target.closest('.add-task-btn');
      const columnId = parseInt(btn.dataset.columnId);
      console.log('➕ Criando nova tarefa na coluna:', columnId);
      openCreateTaskModal(columnId);
      return;
    }

    // Botão de editar tarefa
    if (e.target.closest('.task-action-btn.edit')) {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.target.closest('.task-action-btn.edit');
      const taskId = parseInt(btn.dataset.taskId);
      console.log('✏️ Editando tarefa:', taskId);
      openEditTaskModal(taskId);
      return;
    }

    // Botão de deletar tarefa
    if (e.target.closest('.task-action-btn.delete')) {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.target.closest('.task-action-btn.delete');
      const taskId = parseInt(btn.dataset.taskId);
      console.log('🗑️ Deletando tarefa:', taskId);
      deleteTask(taskId);
      return;
    }

    // Clique na tarefa (para editar) - mas não nos botões de ação
    if (e.target.closest('.task-card') && !e.target.closest('.task-action-btn')) {
      const taskCard = e.target.closest('.task-card');
      const taskId = parseInt(taskCard.dataset.taskId);
      console.log('📋 Clique na tarefa:', taskId);
      // Opcional: abrir modal de edição com duplo clique
      // openEditTaskModal(taskId);
      return;
    }

    // Fechar modal
    if (e.target.id === 'closeTaskModal' || e.target.id === 'cancelTaskModal') {
      e.preventDefault();
      closeTaskModal();
      return;
    }

    // Salvar tarefa
    if (e.target.id === 'saveTask') {
      e.preventDefault();
      saveTask();
      return;
    }

    // Menu de contexto da coluna
    if (e.target.id === 'editColumnTitle') {
      e.preventDefault();
      editColumnTitle();
      return;
    }

    if (e.target.id === 'deleteColumn') {
      e.preventDefault();
      deleteColumn();
      return;
    }

    // Overlay
    if (e.target.id === 'overlay') {
      closeAllModals();
      return;
    }

    // Logo clicável - redireciona para boards
    if (e.target.closest('.clickable-logo') || e.target.closest('#logoContainer')) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🏠 Redirecionando para página de boards...');
      window.location.href = '/boards';
      return;
    }

    // Fecha menus ao clicar fora
    if (!e.target.closest('.context-menu') && !e.target.closest('.column-menu-btn')) {
      closeColumnMenu();
    }
  });
}

/**
 * Configura edição de títulos de colunas
 */
function setupColumnTitleEditing() {
  document.querySelectorAll('.column-title').forEach(input => {
    // Remove event listeners antigos
    input.removeEventListener('blur', handleColumnTitleBlur);
    input.removeEventListener('keydown', handleColumnTitleKeydown);

    // Adiciona novos event listeners
    input.addEventListener('blur', handleColumnTitleBlur);
    input.addEventListener('keydown', handleColumnTitleKeydown);
  });
}

/**
 * Manipula blur no título da coluna
 */
function handleColumnTitleBlur(e) {
  const columnId = parseInt(e.target.dataset.columnId);
  const newTitle = e.target.value.trim();

  if (newTitle && newTitle !== e.target.defaultValue) {
    updateColumnTitle(columnId, newTitle);
    e.target.defaultValue = newTitle;
  }
}

/**
 * Manipula teclas no título da coluna
 */
function handleColumnTitleKeydown(e) {
  if (e.key === 'Enter') {
    e.target.blur();
  } else if (e.key === 'Escape') {
    e.target.value = e.target.defaultValue;
    e.target.blur();
  }
}

/**
 * Configura funcionalidades de drag and drop
 */
function setupDragAndDrop() {
  console.log('🔧 Configurando drag and drop...');

  // Remove event listeners antigos para evitar duplicação
  document.querySelectorAll('.task-card').forEach(task => {
    task.removeEventListener('dragstart', handleDragStart);
    task.removeEventListener('dragend', handleDragEnd);
  });

  document.querySelectorAll('.tasks-list').forEach(column => {
    column.removeEventListener('dragover', handleDragOver);
    column.removeEventListener('drop', handleDrop);
    column.removeEventListener('dragleave', handleDragLeave);
  });

  // Adiciona event listeners para todas as tarefas
  const tasks = document.querySelectorAll('.task-card');
  console.log(`📋 Encontradas ${tasks.length} tarefas para configurar drag`);

  tasks.forEach((task, index) => {
    // Garante que o atributo draggable está definido
    task.setAttribute('draggable', 'true');

    console.log(`🎯 Configurando tarefa ${index + 1}:`, {
      taskId: task.dataset.taskId,
      columnId: task.dataset.columnId,
      draggable: task.draggable
    });

    task.addEventListener('dragstart', handleDragStart);
    task.addEventListener('dragend', handleDragEnd);

    // Previne drag nos botões de ação
    const actionButtons = task.querySelectorAll('.task-action-btn');
    actionButtons.forEach(btn => {
      btn.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        // Temporariamente desabilita o drag
        task.setAttribute('draggable', 'false');
        setTimeout(() => {
          task.setAttribute('draggable', 'true');
        }, 100);
      });
    });
  });

  // Adiciona event listeners para todas as colunas
  const columns = document.querySelectorAll('.tasks-list');
  console.log(`📂 Encontradas ${columns.length} colunas para configurar drop`);

  columns.forEach((column, index) => {
    console.log(`📂 Configurando coluna ${index + 1}:`, {
      columnId: column.dataset.columnId
    });

    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('drop', handleDrop);
    column.addEventListener('dragleave', handleDragLeave);
    column.addEventListener('dragenter', handleDragEnter);
  });

  console.log('✅ Drag and drop configurado!');
}

/**
 * Configura tooltips para botões
 */
function setupTooltips() {
  // Adiciona títulos aos botões para tooltips nativos
  document.querySelectorAll('.task-action-btn').forEach(btn => {
    if (btn.classList.contains('edit')) {
      btn.title = 'Editar tarefa';
    } else if (btn.classList.contains('delete')) {
      btn.title = 'Excluir tarefa';
    }
  });
  
  document.querySelectorAll('.column-menu-btn').forEach(btn => {
    btn.title = 'Opções da coluna';
  });
}

/**
 * Manipula o início do drag
 */
function handleDragStart(e) {
  console.log('🎯 handleDragStart chamado:', {
    target: e.target,
    tagName: e.target.tagName,
    className: e.target.className
  });

  // Garante que estamos arrastando o card correto
  const taskCard = e.target.closest('.task-card');
  if (!taskCard) {
    console.log('❌ Não foi possível encontrar .task-card');
    return;
  }

  console.log('📋 Task card encontrado:', {
    taskId: taskCard.dataset.taskId,
    columnId: taskCard.dataset.columnId,
    draggable: taskCard.draggable
  });

  draggedTask = taskCard;
  taskCard.classList.add('dragging');

  // Armazena dados da tarefa
  const taskData = {
    taskId: taskCard.dataset.taskId,
    sourceColumnId: taskCard.dataset.columnId
  };

  e.dataTransfer.setData('application/json', JSON.stringify(taskData));
  e.dataTransfer.setData('text/plain', taskData.taskId); // Fallback
  e.dataTransfer.effectAllowed = 'move';

  console.log('🎯 Drag iniciado com sucesso:', taskData);
}

/**
 * Manipula o fim do drag
 */
function handleDragEnd(e) {
  const taskCard = e.target.closest('.task-card');
  if (taskCard) {
    taskCard.classList.remove('dragging');
  }

  // Remove classes de drag-over de todas as colunas
  document.querySelectorAll('.tasks-list').forEach(column => {
    column.classList.remove('drag-over');
  });

  draggedTask = null;
  console.log('✅ Drag finalizado');
}

/**
 * Manipula o drag enter
 */
function handleDragEnter(e) {
  e.preventDefault();
  if (draggedTask && e.currentTarget.classList.contains('tasks-list')) {
    e.currentTarget.classList.add('drag-over');
  }
}

/**
 * Manipula o drag over
 */
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();

  if (draggedTask) {
    e.dataTransfer.dropEffect = 'move';

    if (!e.currentTarget.classList.contains('drag-over')) {
      e.currentTarget.classList.add('drag-over');
    }
  }
}

/**
 * Manipula o drag leave
 */
function handleDragLeave(e) {
  // Só remove a classe se realmente saiu da área e não entrou em um filho
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX;
  const y = e.clientY;

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    e.currentTarget.classList.remove('drag-over');
  }
}

/**
 * Manipula o drop
 */
function handleDrop(e) {
  console.log('🎯 handleDrop chamado:', {
    target: e.target,
    currentTarget: e.currentTarget,
    columnId: e.currentTarget.dataset.columnId
  });

  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.remove('drag-over');

  if (!draggedTask) {
    console.log('❌ Nenhuma tarefa sendo arrastada');
    return;
  }

  console.log('📋 Tarefa arrastada:', {
    taskId: draggedTask.dataset.taskId,
    sourceColumnId: draggedTask.dataset.columnId
  });

  try {
    // Tenta obter dados do JSON primeiro, depois fallback para text/plain
    let data;
    try {
      data = JSON.parse(e.dataTransfer.getData('application/json'));
    } catch (jsonError) {
      // Fallback para text/plain
      const taskId = e.dataTransfer.getData('text/plain');
      data = {
        taskId: taskId,
        sourceColumnId: draggedTask.dataset.columnId
      };
    }

    const newColumnId = parseInt(e.currentTarget.dataset.columnId);
    const taskId = parseInt(data.taskId);
    const sourceColumnId = parseInt(data.sourceColumnId);

    console.log('🎯 Drop detectado:', { taskId, sourceColumnId, newColumnId });

    // Validação dos dados
    if (!taskId || !newColumnId || isNaN(taskId) || isNaN(newColumnId)) {
      console.error('❌ Dados inválidos para drop:', { taskId, newColumnId });
      showNotification('Erro: dados inválidos para mover tarefa', 'error');
      return;
    }

    // Se não mudou de coluna, não faz nada
    if (newColumnId === sourceColumnId) {
      console.log('ℹ️ Tarefa não mudou de coluna');
      return;
    }

    // Move a tarefa
    moveTaskToColumn(taskId, newColumnId);

  } catch (error) {
    console.error('❌ Erro no drop:', error);
    showNotification('Erro ao mover tarefa', 'error');
  }
}

/**
 * Move uma tarefa para outra coluna
 */
function moveTaskToColumn(taskId, newColumnId) {
  console.log('🔄 Movendo tarefa:', { taskId, newColumnId });

  // Validação dos parâmetros
  if (!taskId || !newColumnId || isNaN(taskId) || isNaN(newColumnId)) {
    console.error('❌ Parâmetros inválidos:', { taskId, newColumnId });
    showNotification('Erro: parâmetros inválidos', 'error');
    return;
  }

  // Calcula nova posição (no final da lista)
  const targetColumn = document.querySelector(`[data-column-id="${newColumnId}"] .tasks-list`);
  if (!targetColumn) {
    console.error('❌ Coluna de destino não encontrada:', newColumnId);
    showNotification('Erro: coluna de destino não encontrada', 'error');
    return;
  }

  const tasksInColumn = targetColumn.querySelectorAll('.task-card').length;
  const newPosition = tasksInColumn + 1;

  console.log('📍 Nova posição calculada:', newPosition);

  // Mostra feedback visual imediato
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  if (taskElement) {
    taskElement.style.opacity = '0.7';
    taskElement.style.pointerEvents = 'none';
  }

  fetch(`/kanban/tasks/${taskId}/move`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      newColumnId: newColumnId,
      newPosition: newPosition
    })
  })
  .then(response => {
    console.log('📡 Resposta do servidor:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('📦 Dados recebidos:', data);

    if (data.success) {
      showNotification('Tarefa movida com sucesso', 'success');

      // Atualiza a interface sem recarregar a página
      updateTaskPosition(taskId, newColumnId);
    } else {
      console.error('❌ Erro do servidor:', data.error);
      showNotification(data.error || 'Erro ao mover tarefa', 'error');

      // Restaura o estado visual da tarefa
      if (taskElement) {
        taskElement.style.opacity = '1';
        taskElement.style.pointerEvents = 'auto';
      }
    }
  })
  .catch(error => {
    console.error('❌ Erro na requisição:', error);
    showNotification('Erro ao mover tarefa: ' + error.message, 'error');

    // Restaura o estado visual da tarefa
    if (taskElement) {
      taskElement.style.opacity = '1';
      taskElement.style.pointerEvents = 'auto';
    }
  });
}

/**
 * Atualiza a posição da tarefa na interface
 */
function updateTaskPosition(taskId, newColumnId) {
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  const targetColumn = document.querySelector(`[data-column-id="${newColumnId}"] .tasks-list`);

  if (taskElement && targetColumn) {
    // Restaura o estado visual
    taskElement.style.opacity = '1';
    taskElement.style.pointerEvents = 'auto';

    // Atualiza o data-column-id da tarefa
    taskElement.dataset.columnId = newColumnId;

    // Remove a tarefa da posição atual com animação
    taskElement.style.transform = 'translateX(100px)';
    taskElement.style.opacity = '0';

    setTimeout(() => {
      // Move o elemento para a nova coluna
      targetColumn.appendChild(taskElement);

      // Anima a entrada na nova posição
      taskElement.style.transform = 'translateX(-100px)';

      setTimeout(() => {
        taskElement.style.transition = 'all 0.3s ease';
        taskElement.style.transform = 'translateX(0)';
        taskElement.style.opacity = '1';

        // Adiciona animação de sucesso
        setTimeout(() => {
          taskElement.style.animation = 'pulse 0.5s ease';
          setTimeout(() => {
            taskElement.style.animation = '';
            taskElement.style.transition = '';
          }, 500);
        }, 300);
      }, 50);
    }, 200);
  } else {
    console.error('❌ Elemento da tarefa ou coluna de destino não encontrado:', {
      taskId,
      newColumnId,
      taskElement: !!taskElement,
      targetColumn: !!targetColumn
    });
  }
}

/**
 * Funcionalidades de teclado
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N = Nova tarefa na primeira coluna
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      const firstColumn = document.querySelector('.kanban-column');
      if (firstColumn) {
        const columnId = firstColumn.dataset.columnId;
        openCreateTaskModal(columnId);
      }
    }
    
    // Ctrl/Cmd + Shift + N = Nova coluna
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
      e.preventDefault();
      const newColumnInput = document.querySelector('.new-column-input');
      if (newColumnInput) {
        newColumnInput.focus();
      }
    }
  });
}

/**
 * Auto-save para títulos de colunas
 */
function setupAutoSave() {
  document.querySelectorAll('.column-title').forEach(input => {
    let timeout;
    
    input.addEventListener('input', function() {
      clearTimeout(timeout);
      
      // Debounce de 1 segundo
      timeout = setTimeout(() => {
        const columnId = this.dataset.columnId;
        const newTitle = this.value.trim();
        
        if (newTitle) {
          updateColumnTitle(columnId, newTitle);
        }
      }, 1000);
    });
  });
}

/**
 * Funcionalidades de acessibilidade
 */
function setupAccessibility() {
  // Adiciona suporte a navegação por teclado
  document.querySelectorAll('.task-card').forEach(task => {
    task.setAttribute('tabindex', '0');
    
    task.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const taskId = this.dataset.taskId;
        openEditTaskModal(taskId);
      }
    });
  });
  
  // Adiciona labels para screen readers
  document.querySelectorAll('.column-title').forEach(input => {
    input.setAttribute('aria-label', 'Título da coluna');
  });
}

/**
 * Inicializa funcionalidades avançadas
 */
function initializeAdvancedFeatures() {
  setupKeyboardShortcuts();
  setupAutoSave();
  setupAccessibility();
}

// Inicializa funcionalidades avançadas quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeAdvancedFeatures);

/**
 * Funções principais do Kanban
 * Estas funções são chamadas pelos event listeners
 */

/**
 * Atualiza o título de uma coluna
 */
function updateColumnTitle(columnId, newTitle) {
  if (!newTitle.trim()) {
    console.log('❌ Título vazio, não atualizando');
    return;
  }

  console.log('🔄 Atualizando título da coluna:', { columnId, newTitle });

  fetch(`/kanban/columns/${columnId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo: newTitle })
  })
  .then(response => {
    console.log('📡 Resposta do servidor (coluna):', response.status);
    return response.json();
  })
  .then(data => {
    console.log('📦 Dados recebidos (coluna):', data);

    if (data.success) {
      showNotification('Título da coluna atualizado', 'success');
    } else {
      console.error('❌ Erro do servidor:', data.error);
      showNotification(data.error || 'Erro ao atualizar título da coluna', 'error');
    }
  })
  .catch(error => {
    console.error('❌ Erro na requisição:', error);
    showNotification('Erro ao atualizar título da coluna', 'error');
  });
}

/**
 * Abre o menu de contexto da coluna
 */
function openColumnMenu(event, columnId) {
  event.stopPropagation();

  const menu = document.getElementById('columnContextMenu');
  currentColumnId = columnId;

  // Posiciona o menu
  menu.style.left = `${event.pageX}px`;
  menu.style.top = `${event.pageY}px`;
  menu.style.display = 'block';
}

/**
 * Fecha o menu de contexto da coluna
 */
function closeColumnMenu() {
  document.getElementById('columnContextMenu').style.display = 'none';
}

/**
 * Edita o título da coluna atual
 */
function editColumnTitle() {
  const input = document.querySelector(`[data-column-id="${currentColumnId}"]`);
  if (input) {
    input.focus();
    input.select();
  }
  closeColumnMenu();
}

/**
 * Exclui a coluna atual
 */
function deleteColumn() {
  if (!currentColumnId) return;

  const confirmation = confirm('Tem certeza que deseja excluir esta coluna? Todas as tarefas serão perdidas.');

  if (confirmation) {
    fetch(`/kanban/columns/${currentColumnId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showNotification('Coluna excluída com sucesso', 'success');
        setTimeout(() => location.reload(), 1000);
      } else {
        showNotification(data.error || 'Erro ao excluir coluna', 'error');
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      showNotification('Erro ao excluir coluna', 'error');
    });
  }

  closeColumnMenu();
}

/**
 * Abre o modal para criar nova tarefa
 */
function openCreateTaskModal(columnId) {
  console.log('➕ Abrindo modal para criar tarefa na coluna:', columnId);

  currentColumnId = columnId;
  currentTaskId = null;
  isEditMode = false;

  // Configura o modal
  document.getElementById('taskModalTitle').textContent = 'Nova Tarefa';
  document.getElementById('taskId').value = '';
  document.getElementById('columnId').value = columnId;
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskPriority').value = 'média';

  // Exibe o modal
  document.getElementById('taskModal').style.display = 'flex';
  document.getElementById('overlay').style.display = 'block';

  // Foca no campo título
  setTimeout(() => {
    document.getElementById('taskTitle').focus();
  }, 100);
}

/**
 * Abre o modal para editar tarefa existente
 */
function openEditTaskModal(taskId) {
  console.log('✏️ Abrindo modal para editar tarefa:', taskId);

  currentTaskId = taskId;
  isEditMode = true;

  // Busca os dados da tarefa
  fetch(`/kanban/tasks/${taskId}`)
    .then(response => {
      console.log('📡 Resposta do servidor (buscar tarefa):', response.status);
      return response.json();
    })
    .then(task => {
      console.log('📦 Dados da tarefa:', task);

      currentColumnId = task.coluna_id;

      // Configura o modal
      document.getElementById('taskModalTitle').textContent = 'Editar Tarefa';
      document.getElementById('taskId').value = task.id;
      document.getElementById('columnId').value = task.coluna_id;
      document.getElementById('taskTitle').value = task.titulo;
      document.getElementById('taskDescription').value = task.descricao || '';
      document.getElementById('taskPriority').value = task.prioridade;

      // Exibe o modal
      document.getElementById('taskModal').style.display = 'flex';
      document.getElementById('overlay').style.display = 'block';

      // Foca no campo título
      setTimeout(() => {
        document.getElementById('taskTitle').focus();
      }, 100);
    })
    .catch(error => {
      console.error('❌ Erro ao carregar tarefa:', error);
      showNotification('Erro ao carregar dados da tarefa', 'error');
    });
}

/**
 * Fecha o modal de tarefa
 */
function closeTaskModal() {
  document.getElementById('taskModal').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';

  // Limpa variáveis
  currentTaskId = null;
  currentColumnId = null;
  isEditMode = false;
}

/**
 * Salva a tarefa (criar ou editar)
 */
function saveTask() {
  console.log('💾 Salvando tarefa...', { isEditMode, currentTaskId, currentColumnId });

  const taskData = {
    titulo: document.getElementById('taskTitle').value.trim(),
    descricao: document.getElementById('taskDescription').value.trim(),
    prioridade: document.getElementById('taskPriority').value,
    coluna_id: currentColumnId
  };

  console.log('📝 Dados da tarefa:', taskData);

  // Validação
  if (!taskData.titulo) {
    showNotification('O título da tarefa é obrigatório', 'error');
    document.getElementById('taskTitle').focus();
    return;
  }

  const url = isEditMode ? `/kanban/tasks/${currentTaskId}` : '/kanban/tasks';
  const method = isEditMode ? 'PUT' : 'POST';

  console.log('🌐 Fazendo requisição:', { url, method });

  // Desabilita o botão para evitar cliques duplos
  const saveBtn = document.getElementById('saveTask');
  const originalText = saveBtn.textContent;
  saveBtn.disabled = true;
  saveBtn.textContent = 'Salvando...';

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  })
  .then(response => {
    console.log('📡 Resposta do servidor (salvar):', response.status);
    return response.json();
  })
  .then(data => {
    console.log('📦 Dados recebidos (salvar):', data);

    if (data.success) {
      showNotification(isEditMode ? 'Tarefa atualizada com sucesso' : 'Tarefa criada com sucesso', 'success');
      closeTaskModal();
      setTimeout(() => location.reload(), 1000);
    } else {
      console.error('❌ Erro do servidor:', data.error);
      showNotification(data.error || 'Erro ao salvar tarefa', 'error');
    }
  })
  .catch(error => {
    console.error('❌ Erro na requisição:', error);
    showNotification('Erro ao salvar tarefa', 'error');
  })
  .finally(() => {
    // Reabilita o botão
    saveBtn.disabled = false;
    saveBtn.textContent = originalText;
  });
}

/**
 * Exclui uma tarefa
 */
function deleteTask(taskId) {
  console.log('🗑️ Solicitando exclusão da tarefa:', taskId);

  const confirmation = confirm('Tem certeza que deseja excluir esta tarefa?');

  if (confirmation) {
    console.log('✅ Confirmação recebida, excluindo tarefa');

    fetch(`/kanban/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      console.log('📡 Resposta do servidor (deletar):', response.status);
      return response.json();
    })
    .then(data => {
      console.log('📦 Dados recebidos (deletar):', data);

      if (data.success) {
        showNotification('Tarefa excluída com sucesso', 'success');

        // Remove o elemento da interface
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
          taskElement.style.animation = 'fadeOut 0.3s ease';
          setTimeout(() => {
            taskElement.remove();
          }, 300);
        }
      } else {
        console.error('❌ Erro do servidor:', data.error);
        showNotification(data.error || 'Erro ao excluir tarefa', 'error');
      }
    })
    .catch(error => {
      console.error('❌ Erro na requisição:', error);
      showNotification('Erro ao excluir tarefa', 'error');
    });
  } else {
    console.log('❌ Exclusão cancelada pelo usuário');
  }
}

/**
 * Fecha todos os modais
 */
function closeAllModals() {
  closeTaskModal();
  closeColumnMenu();
}

/**
 * Exibe uma notificação temporária
 */
function showNotification(message, type = 'info') {
  // Remove notificações existentes
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(n => n.remove());

  // Cria nova notificação
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;

  const icon = type === 'success' ? 'check-circle' :
               type === 'error' ? 'exclamation-triangle' : 'info-circle';

  notification.innerHTML = `
    <i class="fas fa-${icon}"></i>
    ${message}
  `;

  document.body.appendChild(notification);

  // Remove após 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
