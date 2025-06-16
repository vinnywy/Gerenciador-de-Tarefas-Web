// Script de debug para ser executado no console do navegador na página do kanban

console.log('🔍 Iniciando debug do Kanban...');

// Função para verificar elementos
function debugElements() {
  console.log('📋 Verificando elementos do DOM...');
  
  const taskCards = document.querySelectorAll('.task-card');
  const tasksLists = document.querySelectorAll('.tasks-list');
  const kanbanColumns = document.querySelectorAll('.kanban-column');
  
  console.log('Elementos encontrados:', {
    taskCards: taskCards.length,
    tasksLists: tasksLists.length,
    kanbanColumns: kanbanColumns.length
  });
  
  // Verifica cada task card
  taskCards.forEach((task, index) => {
    console.log(`Tarefa ${index + 1}:`, {
      taskId: task.dataset.taskId,
      columnId: task.dataset.columnId,
      draggable: task.draggable,
      hasClass: task.classList.contains('task-card'),
      innerHTML: task.innerHTML.substring(0, 100) + '...'
    });
  });
  
  // Verifica cada tasks list
  tasksLists.forEach((list, index) => {
    console.log(`Lista ${index + 1}:`, {
      columnId: list.dataset.columnId,
      hasClass: list.classList.contains('tasks-list'),
      childrenCount: list.children.length
    });
  });
}

// Função para testar event listeners
function testEventListeners() {
  console.log('🧪 Testando event listeners...');
  
  const taskCards = document.querySelectorAll('.task-card');
  
  if (taskCards.length > 0) {
    const firstTask = taskCards[0];
    console.log('Testando primeira tarefa:', firstTask.dataset.taskId);
    
    // Simula eventos de drag
    const dragStartEvent = new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer()
    });
    
    const dragEndEvent = new DragEvent('dragend', {
      bubbles: true,
      cancelable: true
    });
    
    console.log('Disparando evento dragstart...');
    firstTask.dispatchEvent(dragStartEvent);
    
    setTimeout(() => {
      console.log('Disparando evento dragend...');
      firstTask.dispatchEvent(dragEndEvent);
    }, 1000);
  } else {
    console.log('❌ Nenhuma tarefa encontrada para testar');
  }
}

// Função para verificar variáveis globais
function checkGlobalVariables() {
  console.log('🌐 Verificando variáveis globais...');
  
  console.log('Variáveis disponíveis:', {
    draggedTask: typeof draggedTask !== 'undefined' ? draggedTask : 'undefined',
    currentTaskId: typeof currentTaskId !== 'undefined' ? currentTaskId : 'undefined',
    currentColumnId: typeof currentColumnId !== 'undefined' ? currentColumnId : 'undefined',
    isEditMode: typeof isEditMode !== 'undefined' ? isEditMode : 'undefined'
  });
}

// Função para verificar funções
function checkFunctions() {
  console.log('🔧 Verificando funções...');
  
  const functions = [
    'handleDragStart',
    'handleDragEnd', 
    'handleDragOver',
    'handleDrop',
    'moveTaskToColumn',
    'setupDragAndDrop'
  ];
  
  functions.forEach(funcName => {
    console.log(`${funcName}:`, typeof window[funcName] !== 'undefined' ? '✅ Disponível' : '❌ Não encontrada');
  });
}

// Função para adicionar listeners de debug
function addDebugListeners() {
  console.log('🎯 Adicionando listeners de debug...');
  
  document.addEventListener('dragstart', function(e) {
    console.log('🎯 DEBUG: dragstart detectado', {
      target: e.target,
      tagName: e.target.tagName,
      className: e.target.className,
      taskId: e.target.dataset?.taskId,
      columnId: e.target.dataset?.columnId
    });
  });
  
  document.addEventListener('dragend', function(e) {
    console.log('✅ DEBUG: dragend detectado', {
      target: e.target,
      tagName: e.target.tagName
    });
  });
  
  document.addEventListener('dragover', function(e) {
    if (e.target.classList.contains('tasks-list')) {
      console.log('🎯 DEBUG: dragover em tasks-list', {
        columnId: e.target.dataset.columnId
      });
    }
  });
  
  document.addEventListener('drop', function(e) {
    if (e.target.classList.contains('tasks-list')) {
      console.log('🎯 DEBUG: drop em tasks-list', {
        columnId: e.target.dataset.columnId,
        dataTransfer: e.dataTransfer.getData('application/json')
      });
    }
  });
  
  console.log('✅ Listeners de debug adicionados');
}

// Função principal de debug
function runDebug() {
  console.log('🚀 Executando debug completo...');
  
  debugElements();
  checkGlobalVariables();
  checkFunctions();
  addDebugListeners();
  
  console.log('📋 Para testar manualmente:');
  console.log('1. Execute: testEventListeners()');
  console.log('2. Tente arrastar uma tarefa manualmente');
  console.log('3. Observe os logs no console');
  
  console.log('✅ Debug concluído!');
}

// Executa o debug
runDebug();

// Exporta funções para uso manual
window.debugKanban = {
  debugElements,
  testEventListeners,
  checkGlobalVariables,
  checkFunctions,
  addDebugListeners,
  runDebug
};
