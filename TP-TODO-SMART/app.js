
// DONNÉES
let tasks = [];
let currentFilter = "all";

// DOM
const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const counter = document.querySelector("#counter");

const filterBtns = document.querySelectorAll(".filter-btn");
const clearDoneBtn = document.querySelector("#clearDoneBtn");
const clearAllBtn = document.querySelector("#clearAllBtn");

// LOCAL STORAGE
const STORAGE_KEY = "todo_smart_tasks_v1";
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
function load() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      tasks = [];
      return;
    }
    tasks = JSON.parse(data);
  } catch {
    tasks = [];
  }
}
function getVisibleTasks() {
  if (currentFilter === "active") {
    return tasks.filter(task => task.done === false);
  }
  if (currentFilter === "done") {
    return tasks.filter(task => task.done === true);
  }
  return tasks;
}
function updateCounter() {
  const remaining = tasks.filter(task => task.done === false).length;
  counter.textContent = `${remaining} restantes`;
}
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "item";
  if (task.done) {
    li.classList.add("done");
  }
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const span = document.createElement("span");
  span.className = "text";
  span.textContent = task.text;
  const spacer = document.createElement("div");
  spacer.className = "spacer";
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Supprimer";
  deleteBtn.className = "icon-btn";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));
  li.append(checkbox, span, spacer, deleteBtn);
  return li;
}
function render() {
  taskList.innerHTML = "";
  const visibleTasks = getVisibleTasks();
  visibleTasks.forEach(task => {
    taskList.appendChild(createTaskElement(task));
  });
  updateCounter();
}
function addTask(text) {
  const cleanText = text.trim();
  if (cleanText === "") return;
  const task = {
    id: Date.now().toString(),
    text: cleanText,
    done: false
  };

  tasks.push(task);
  save();
  render();
}
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  save();
  render();
}
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  save();
  render();
}
function setActiveFilterButton(activeBtn) {
  filterBtns.forEach(btn => btn.classList.remove("is-active"));
  activeBtn.classList.add("is-active");
}
// Events
addBtn.addEventListener("click", () => {
  addTask(taskInput.value);
  taskInput.value = "";
  taskInput.focus();
});
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(taskInput.value);
    taskInput.value = "";
    taskInput.focus();
  }
});
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    setActiveFilterButton(btn);
    render();
  });
});
clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => task.done === false);
  save();
  render();
});
clearAllBtn.addEventListener("click", () => {
  tasks = [];
  save();
  render();
});

// INIT
load();
render();
