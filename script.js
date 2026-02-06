// Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const completedCount = document.getElementById('completedCount');

// Add task
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    
    createTaskElement(text, false);
    taskInput.value = '';
    updateStats();
    saveTasks();
}

// Create task element
function createTaskElement(text, completed) {
    const li = document.createElement('li');
    li.className = 'task-item' + (completed ? ' completed' : '');
    li.innerHTML = `
        <span class="task-text">${text}</span>
        <button class="delete-btn">✕</button>
    `;
    taskList.appendChild(li);
    checkEmpty();
}

// Update statistics
function updateStats() {
    const total = document.querySelectorAll('.task-item').length;
    const done = document.querySelectorAll('.task-item.completed').length;
    taskCount.textContent = total + ' task' + (total !== 1 ? 's' : '');
    completedCount.textContent = done + ' completed';
}

// Check if list is empty
function checkEmpty() {
    const empty = document.querySelector('.empty-state');
    if (taskList.children.length === 0 || 
        (taskList.children.length === 1 && empty)) {
        if (!empty) {
            taskList.innerHTML = `
                <div class="empty-state">
                    <span>✨</span>
                    <p>No tasks yet. Add one above!</p>
                </div>
            `;
        }
    } else if (empty) {
        empty.remove();
    }
}

// Event: Add button
addBtn.addEventListener('click', addTask);

// Event: Enter key
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});

// Event: Task interactions
taskList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        e.target.parentElement.remove();
        checkEmpty();
        updateStats();
        saveTasks();
    }
    if (e.target.classList.contains('task-text')) {
        e.target.parentElement.classList.toggle('completed');
        updateStats();
        saveTasks();
    }
});

// Save to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(function(item) {
        tasks.push({
            text: item.querySelector('.task-text').textContent,
            completed: item.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load from localStorage
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        JSON.parse(saved).forEach(function(task) {
            createTaskElement(task.text, task.completed);
        });
    }
    checkEmpty();
    updateStats();
}

// Initialize
loadTasks();
