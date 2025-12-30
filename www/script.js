window.onload = function() { loadTasks(); };

// --- MODAL ---
function openModal() {
    document.getElementById('modal-overlay').classList.remove('hidden');
    // Set default date to today
    document.getElementById('date-input').valueAsDate = new Date();
}
function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('task-input').value = '';
}

// --- ADD TASK ---
function addTask() {
    const text = document.getElementById('task-input').value.trim();
    const date = document.getElementById('date-input').value;
    const priority = document.getElementById('priority-input').value;

    if (text) {
        createTaskElement(text, date, priority, false);
        saveTasks();
        closeModal();
    }
}

// --- RENDER TASK ---
function createTaskElement(text, date, priority, isDone) {
    const list = document.getElementById('task-list');
    const li = document.createElement('li');

    li.innerHTML = `
        <div class="task-info">
            <div class="task-main">
                <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTask(this)">
                <span style="text-decoration: ${isDone ? 'line-through' : 'none'}">${text}</span>
            </div>
            <div class="task-meta">
                <span class="badge badge-${priority}">${priority}</span>
                <span>📅 ${date}</span>
            </div>
        </div>
        <button onclick="deleteTask(this)" style="color:#ff3b30; background:none; border:none; font-size:20px;">×</button>
    `;
    list.appendChild(li);
    updateProgress();
}

// --- UTILS ---
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

function updateProgress() {
    const all = document.querySelectorAll('input[type="checkbox"]');
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');
    const percent = all.length ? Math.round((checked.length / all.length) * 100) : 0;
    
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('progress-text').innerText = percent + '% Completed';
}

// --- STORAGE ---
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-main span').innerText,
            date: li.querySelector('.task-meta span:last-child').innerText.replace('📅 ', ''),
            priority: li.querySelector('.badge').innerText,
            done: li.querySelector('input').checked
        });
    });
    localStorage.setItem('lakhya_pro_data', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('lakhya_pro_data');
    if (saved) {
        JSON.parse(saved).forEach(t => createTaskElement(t.text, t.date, t.priority, t.done));
    }
}