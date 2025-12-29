// Load Tasks on Start
window.onload = function() {
    loadTasks();
};

// --- MODAL FUNCTIONS ---
function openModal() {
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.getElementById('new-task-input').focus();
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('new-task-input').value = '';
}

function addTaskFromModal() {
    const input = document.getElementById('new-task-input');
    const taskText = input.value.trim();
    if (taskText) {
        addTaskToDOM(taskText, false);
        saveTasks();
        closeModal();
    }
}

// --- TASK LOGIC ---
function addTaskToDOM(text, isDone) {
    const list = document.getElementById('task-list');
    const li = document.createElement('li');

    li.innerHTML = `
        <div class="task-left">
            <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTask(this)">
            <span style="text-decoration: ${isDone ? 'line-through' : 'none'}">${text}</span>
        </div>
        <button class="delete-btn" onclick="deleteTask(this)">×</button>
    `;
    list.appendChild(li);
    updateProgress();
}

function toggleTask(checkbox) {
    const span = checkbox.nextElementSibling;
    span.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
    saveTasks();
    updateProgress();
}

function deleteTask(btn) {
    btn.parentElement.remove();
    saveTasks();
    updateProgress();
}

// --- STORAGE & PROGRESS ---
function updateProgress() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const total = checkboxes.length;
    let checked = 0;
    checkboxes.forEach(box => { if(box.checked) checked++; });

    const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
    
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('progress-text').innerText = percent + '% Completed';
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').innerText,
            done: li.querySelector('input').checked
        });
    });
    localStorage.setItem('lakhya_offline_tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('lakhya_offline_tasks');
    if (saved) {
        JSON.parse(saved).forEach(t => addTaskToDOM(t.text, t.done));
    }
}