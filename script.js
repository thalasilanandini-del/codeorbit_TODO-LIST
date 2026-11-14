
// ======================================
// TASKFLOW - TO-DO LIST APPLICATION
// ======================================

const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");

const progressFill = document.getElementById("progressFill");
const progressPercentage = document.getElementById("progressPercentage");



// Get HTML Elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const taskCount = document.getElementById("taskCount");

const filterButtons = document.querySelectorAll(".filter-btn");

// Load tasks from Local Storage
let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("taskflowTasks")
    );

    tasks = Array.isArray(savedTasks) ? savedTasks : [];
} catch (error) {
    tasks = [];
}

let currentFilter = "all";
let searchTerm = "";

// Save tasks to Local Storage
function saveTasks() {
    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );
}

// Update Statistics

function updateStatistics() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;

    // Calculate completion percentage
    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    progressFill.style.width = percentage + "%";
    progressPercentage.textContent = percentage + "%";
}


// Render Tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        const matchesSearch = task.text
            .toLowerCase()
            .includes(searchTerm);

        return matchesFilter && matchesSearch;
    });

    taskCount.textContent =
        `${filteredTasks.length} task${filteredTasks.length !== 1 ? "s" : ""}`;

    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("div");
        emptyMessage.className = "empty-state";

        const heading = document.createElement("h3");
        const paragraph = document.createElement("p");

        if (tasks.length === 0) {
            heading.textContent = "No tasks yet!";
            paragraph.textContent =
                "Add your first task to get started.";
        } else {
            heading.textContent = "No matching tasks!";
            paragraph.textContent =
                "Try another filter or search term.";
        }

        const icon = document.createElement("div");
        icon.className = "empty-icon";
        icon.textContent = "📝";

        emptyMessage.append(icon, heading, paragraph);
        taskList.appendChild(emptyMessage);

    } else {

        filteredTasks.forEach(task => {

            const taskItem = document.createElement("div");

            taskItem.className = "task-item";

            if (task.completed) {
                taskItem.classList.add("completed");
            }

            // Task Left Section
            const taskLeft = document.createElement("div");
            taskLeft.className = "task-left";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "task-checkbox";
            checkbox.checked = task.completed;
            checkbox.setAttribute(
                "aria-label",
                "Mark task as completed"
            );

            checkbox.addEventListener("change", () => {
                toggleTask(task.id);
            });

            const taskText = document.createElement("span");
            taskText.className = "task-text";
            taskText.textContent = task.text;

            
const details = document.createElement("div");
details.className = "task-details";

const priority = document.createElement("span");
priority.className = "priority " + (task.priority || "Medium");
priority.textContent = (task.priority || "Medium") + " Priority";

const dueDate = document.createElement("span");
dueDate.textContent = task.dueDate
    ? "Due: " + task.dueDate
    : "No due date";

details.append(priority, dueDate);

const taskContent = document.createElement("div");
taskContent.append(taskText, details);

taskLeft.append(checkbox, taskContent);


            // Task Action Buttons
            const actions = document.createElement("div");
            actions.className = "task-actions";

            const editButton = document.createElement("button");
            editButton.className = "edit-btn";
            editButton.textContent = "Edit";

            editButton.addEventListener("click", () => {
                editTask(task.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", () => {
                deleteTask(task.id);
            });

            actions.append(editButton, deleteButton);

            taskItem.append(taskLeft, actions);

            taskList.appendChild(taskItem);
        });
    }

    updateStatistics();
}

// Add New Task
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskTextValue = taskInput.value.trim();

    if (taskTextValue === "") {
        alert("Task cannot be empty!");
        return;
    }

    if (taskTextValue.length > 120) {
        alert("Task must be 120 characters or less.");
        return;
    }

    const newTask = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        text: taskTextValue,
        completed: false,
        priority: taskPriority.value,
        dueDate: taskDueDate.value
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskPriority.value = "Medium";
    taskDueDate.value = "";
    taskInput.focus();
});

// Mark Task as Completed or Pending
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// Edit Task
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const updatedText = prompt(
        "Edit your task:",
        task.text
    );

    if (updatedText === null) return;

    const cleanText = updatedText.trim();

    if (cleanText === "") {
        alert("Task cannot be empty!");
        return;
    }

    if (cleanText.length > 120) {
        alert("Task must be 120 characters or less.");
        return;
    }

    task.text = cleanText;

    saveTasks();
    renderTasks();
}

// Delete Task
function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// Filter Tasks
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

// Search Tasks
searchInput.addEventListener("input", () => {

    searchTerm = searchInput.value
        .trim()
        .toLowerCase();

    renderTasks();
});

// Initial Display
renderTasks();
