'use strict';

// Selectors
const add = document.querySelector("#addTaskButton");
const input = document.querySelector('#addTaskInput');
const taskList = document.querySelector('#taskList');
const searchTasks = document.querySelector('#searchTasks');

//empty array to store tasks
let arrayOfTasks = [];

getdatafromlocalStorage();

// Add Task
add.addEventListener("click", (event) => {
    if (input.value !== "") {
        addTaskToArray(input.value); // Add Task To Array Of Tasks
        input.value = ""; // Empty Input Field
    }
}
);

function addTaskToArray(task) {
    const taskObj = {
        id: Date.now(),
        name: task,
        completed: false
    };
    addTask(taskObj);     
    arrayOfTasks.push(taskObj);
    addTasktolocalStorage(arrayOfTasks);
}

function addTask(taskObj) {
    taskList.innerHTML += `
       <div id="taskListItem" data-id="${taskObj.id}">
                <input type="checkbox" id="completedTaskbox"  onchange="TaskCompletion(${taskObj.id})" ${taskObj.completed ? "checked" : ""}/>
                <span class="taskName"> ${taskObj.name} </span>
                <button class="editBtn" onclick="editTask(${taskObj.id})">Edit</button>
                <button class="deleteBtn" onclick="deleteTask(${taskObj.id})">Delete</button>
        </div> `;
}

function addTasktolocalStorage(arrayOfTasks) {
    window.localStorage.setItem('tasks', JSON.stringify(arrayOfTasks));
}

if (localStorage.getItem('tasks')) {
    arrayOfTasks = JSON.parse(localStorage.getItem('tasks'));
}

function getdatafromlocalStorage() {
    let data = window.localStorage.getItem('tasks');
    if (data) {
        let tasks = JSON.parse(data);
        tasks.forEach(task => {
            addTask(task);
        });
    }
}

function deleteTask(taskId) {
    arrayOfTasks = arrayOfTasks.filter(task => task.id !== taskId);
    addTasktolocalStorage(arrayOfTasks);
    const task = document.querySelector(`[data-id="${taskId}"]`);
    if (task) {
        task.remove();
    }
}

function editTask(taskId) {
    const task = arrayOfTasks.find(task => task.id === taskId);
    const taskElement = document.querySelector(`[data-id="${taskId}"]`);
    const taskName = taskElement.querySelector('.taskName');

    const newTaskName = prompt("Edit task:", taskName.textContent);

    if (newTaskName) {
        taskName.textContent = newTaskName;
        task.name = newTaskName;
        addTasktolocalStorage(arrayOfTasks);
    }
}


function TaskCompletion(taskId) {
    const task = arrayOfTasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        addTasktolocalStorage(arrayOfTasks);
    }
}

function clearAllTasks() {
    arrayOfTasks = [];
    addTasktolocalStorage(arrayOfTasks);
    taskList.innerHTML = "";
}

function allTasks() {
    taskList.innerHTML = "";
    arrayOfTasks.forEach(task => {
        addTask(task);
    });
}

function completedTasks() {
    taskList.innerHTML = "";
    arrayOfTasks.filter(task => task.completed).forEach(task => {
        addTask(task);
    });
}

function pendingTasks() {
    taskList.innerHTML = "";
    arrayOfTasks.filter(task => !task.completed).forEach(task => {
        addTask(task);
    });
}

//search bar functionality
searchTasks.addEventListener('input', () => {
    const searchTerm = searchTasks.value.toLowerCase();
    const taskElements = document.querySelectorAll('#taskListItem');
    taskElements.forEach(taskElement => {
        const taskName = taskElement.querySelector('.taskName').textContent.toLowerCase();
        if (taskName.includes(searchTerm)) {
            taskElement.style.display = '';
        } else {
            taskElement.style.display = 'none';
        }
    });
}
);