export function DailyTaskPlanner() {
  const el = document.getElementById('task-planner-tab');
  el.innerHTML = `
    <h2>Daily Task Planner (Trello-style)</h2>
    <div class="kanban-board">
      <div class="kanban-column" data-status="todo">
        <h3>To Do</h3>
        <div class="task-list" id="todo-list"></div>
      </div>
      <div class="kanban-column" data-status="in-progress">
        <h3>In Progress</h3>
        <div class="task-list" id="in-progress-list"></div>
      </div>
      <div class="kanban-column" data-status="done">
        <h3>Done</h3>
        <div class="task-list" id="done-list"></div>
      </div>
    </div>
    <form id="kanban-task-form">
      <input type="text" id="kanban-task-input" placeholder="New Task" required />
      <button type="submit">Add Task</button>
    </form>
  `;

  const taskState = loadTasks();

  const form = document.getElementById('kanban-task-form');
  const input = document.getElementById('kanban-task-input');
  const lists = {
    todo: document.getElementById('todo-list'),
    'in-progress': document.getElementById('in-progress-list'),
    done: document.getElementById('done-list')
  };

  Object.keys(taskState).forEach(status => {
    taskState[status].forEach(task => {
      const card = createTaskCard(task.id, task.text);
      lists[status].appendChild(card);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = input.value.trim();
    if (taskText) {
      const id = generateId();
      const card = createTaskCard(id, taskText);
      lists.todo.appendChild(card);
      taskState.todo.push({ id, text: taskText });
      saveTasks(taskState);
      input.value = '';
    }
  });

  Object.values(lists).forEach(list => {
    list.addEventListener('dragover', (e) => e.preventDefault());
    list.addEventListener('drop', (e) => {
      e.preventDefault();
      const cardId = e.dataTransfer.getData('text/plain');
      const card = document.getElementById(cardId);
      const oldStatus = getTaskStatus(cardId, taskState);

      if (card && list !== card.parentElement) {
        list.appendChild(card);

      
        const taskText = card.querySelector('.task-text').textContent;
        if (oldStatus) {
          taskState[oldStatus] = taskState[oldStatus].filter(task => task.id !== cardId);
        }
        const newStatus = list.id.replace('-list', '');
        taskState[newStatus].push({ id: cardId, text: taskText });
        saveTasks(taskState);
      }
    });
  });

  function createTaskCard(id, text) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.id = id;

    card.innerHTML = `
      <span class="task-text">${text}</span>
      <button class="delete-task" title="Delete task">&times;</button>
    `;

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.id);
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    card.querySelector('.delete-task').addEventListener('click', () => {
      const status = getTaskStatus(id, taskState);
      if (status) {
        taskState[status] = taskState[status].filter(task => task.id !== id);
        saveTasks(taskState);
        card.remove();
      }
    });

    return card;
  }
}

function generateId() {
  return 'task-' + Math.random().toString(36).substring(2, 9);
}

function getTaskStatus(id, state) {
  return Object.keys(state).find(status =>
    state[status].some(task => task.id === id)
  );
}

function loadTasks() {
  const saved = localStorage.getItem('kanbanTasks');
  return saved
    ? JSON.parse(saved)
    : { todo: [], 'in-progress': [], done: [] };
}

function saveTasks(state) {
  localStorage.setItem('kanbanTasks', JSON.stringify(state));
}
