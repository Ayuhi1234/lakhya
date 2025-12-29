// Load data when app starts
window.onload = function() { loadTasks(); };

// --- MODAL FUNCTIONS ---
function openModal() {
    document.getElementById('modal-overlay').classList.remove('hidden');
    setTimeout(() => document.getElementById('new-task-input').focus(), 100);
}
function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('new-task-input').value = '';
}

// --- TASK LOGIC ---
function addTaskFromModal() {
    const input = document.getElementById('new-task-input');
    const text = input.value.trim();
    if (text) {
        addTaskToDOM(text, false);
        saveTasks();
        closeModal();
    }
}

function addTaskToDOM(text, isDone) {
    const list = document.getElementById('task-list');
    const li = document.createElement('li');
    
    // Create inner HTML
    li.innerHTML = `
        <div class="task-left">
            <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTask(this)">
            <span style="text-decoration: ${isDone ? 'line-through' : 'none'}">${text}</span>
        </div>
        <button onclick="deleteTask(this)" style="color:#ff3b30; background:none; padding:5px; font-size:20px;">×</button>
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
    const all = document.querySelectorAll('input[type="checkbox"]');
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');
    
    let percent = 0;
    if (all.length > 0) {
        percent = Math.round((checked.length / all.length) * 100);
    }
    
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
    localStorage.setItem('lakhya_data', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('lakhya_data');
    if (saved) {
        JSON.parse(saved).forEach(t => addTaskToDOM(t.text, t.done));
    }
}