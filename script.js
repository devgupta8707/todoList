const inputBox = document.getElementById("input-box");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearBtn = document.getElementById("clear-completed");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  tasks
    .filter((task) => {
      if (filter === "all") return true;
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
    })
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";

      const textSpan = document.createElement("span");
      textSpan.textContent = task.text;
      textSpan.style.cursor = "pointer";
      textSpan.onclick = () => toggleComplete(index);

      const buttonContainer = document.createElement("div");

      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "✏️";
      editBtn.onclick = () => editTask(index);

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "🗑️";
      deleteBtn.onclick = () => deleteTask(index);

      buttonContainer.appendChild(editBtn);
      buttonContainer.appendChild(deleteBtn);

      li.appendChild(textSpan);
      li.appendChild(buttonContainer);

      taskList.appendChild(li);
    });
}

addBtn.onclick = () => {
  const text = inputBox.value.trim();
  if (text !== "") {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks(document.querySelector(".filter-btn.active").dataset.filter);
    inputBox.value = "";
  }
};

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks(document.querySelector(".filter-btn.active").dataset.filter);
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks(document.querySelector(".filter-btn.active").dataset.filter);
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks(document.querySelector(".filter-btn.active").dataset.filter);
  }
}

filterBtns.forEach((btn) => {
  btn.onclick = () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  };
});

clearBtn.onclick = () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks(document.querySelector(".filter-btn.active").dataset.filter);
};

// INITIAL render
renderTasks();
