document.addEventListener('DOMContentLoaded', () => {
    const newTaskForm = document.getElementById('new-task-form');
    const newTaskInput = document.getElementById('new-task-input');
    const taskPriorityInput = document.getElementById('task-priority');
    const tasksList = document.getElementById('tasks');

    loadTasksFromLocalStorage();

    newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = newTaskInput.value.trim();
        const taskPriority = taskPriorityInput.value;
        if (taskText === "") return;

        const taskItem = createTaskItem(taskText, taskPriority, false);
        tasksList.appendChild(taskItem);
        saveTaskToLocalStorage(taskText, taskPriority, false);

        newTaskInput.value = "";
        taskPriorityInput.value = "low";
    });

    function createTaskItem(text, priority, completed) {
        const taskItem = document.createElement('li');
        taskItem.classList.toggle('completed', completed);

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = text;
        taskText.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            updateTaskInLocalStorage(taskText.textContent, priority, taskItem.classList.contains('completed'));
        });

        const taskPriority = document.createElement('span');
        taskPriority.className = `task-priority ${priority}`;
        taskPriority.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);

        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            const newTaskText = prompt("Edit task", taskText.textContent);
            if (newTaskText !== null && newTaskText.trim() !== "") {
                taskText.textContent = newTaskText.trim();
                updateTaskInLocalStorage(taskText.textContent, priority, taskItem.classList.contains('completed'));
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            tasksList.removeChild(taskItem);
            removeTaskFromLocalStorage(taskText.textContent);
        });

        taskItem.appendChild(taskText);
        taskItem.appendChild(taskPriority);
        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);

        return taskItem;
    }

    function saveTaskToLocalStorage(text, priority, completed) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text, priority, completed });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskInLocalStorage(text, priority, completed) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.findIndex(task => task.text === text);
        if (taskIndex > -1) {
            tasks[taskIndex].priority = priority;
            tasks[taskIndex].completed = completed;
        } else {
            tasks.push({ text, priority, completed });
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTaskFromLocalStorage(text) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.text !== text);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskItem(task.text, task.priority, task.completed);
            tasksList.appendChild(taskItem);
        });
    }
});
