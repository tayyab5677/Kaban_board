const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const columns = [todo, progress, done];

let dragtask = null;
function updateCounts() {
    columns.forEach(col => {
        const count = col.querySelector(".right");

        if (count) {
            count.innerText = col.querySelectorAll(".task").length;
        }
    });
}

function saveTasks() {

    const data = [];

    columns.forEach(col => {

        const status = col.id;

        col.querySelectorAll(".task").forEach(task => {

            data.push({
                title: task.querySelector("h2").innerText,
                description: task.querySelector("p").innerText,
                status: status
            });

        });

    });

    localStorage.setItem("tasks", JSON.stringify(data));
}

function createTask(title, description, status = "todo") {

    const div = document.createElement("div");

    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <button class="delete-btn">Delete</button>
    `;

    /* Drag Start */
    div.addEventListener("dragstart", () => {
        dragtask = div;
    });

    /* Delete Button */
    div.querySelector(".delete-btn").addEventListener("click", () => {

        div.remove();

        updateCounts();
        saveTasks();
    });

    document.querySelector(`#${status}`).appendChild(div);
}
function Dragfunction(element) {

    element.addEventListener("dragenter", (e) => {
        e.preventDefault();
        element.classList.add("hover-over");
    });

    element.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    element.addEventListener("dragleave", () => {
        element.classList.remove("hover-over");
    });

    element.addEventListener("drop", (e) => {

        e.preventDefault();

        if (dragtask) {
            element.appendChild(dragtask);
            dragtask = null;
        }

        element.classList.remove("hover-over");

        updateCounts();
        saveTasks();
    });
}
Dragfunction(todo);
Dragfunction(progress);
Dragfunction(done);
const modal = document.querySelector(".modal");
const toggleModal = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");

toggleModal.addEventListener("click", () => {
    modal.classList.add("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});
const addTaskBtn = document.querySelector("#add-new-task");

addTaskBtn.addEventListener("click", () => {

    const title = document.querySelector("#task-title").value.trim();
    const description = document.querySelector("#task-desc").value.trim();

    if (!title || !description) {
        alert("Please fill all fields");
        return;
    }

    createTask(title, description);

    saveTasks();
    updateCounts();

    document.querySelector("#task-title").value = "";
    document.querySelector("#task-desc").value = "";

    modal.classList.remove("active");
});
const deleteAllBtn = document.querySelector("#delete-all");

if (deleteAllBtn) {

    deleteAllBtn.addEventListener("click", () => {

        const confirmDelete = confirm(
            "Are you sure you want to delete all tasks?"
        );

        if (!confirmDelete) return;

        columns.forEach(col => {

            col.querySelectorAll(".task").forEach(task => {
                task.remove();
            });

        });

        localStorage.removeItem("tasks");

        updateCounts();
    });

}
function loadTasks() {

    const data = JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

    data.forEach(task => {

        createTask(
            task.title,
            task.description,
            task.status
        );

    });

    updateCounts();
}
loadTasks();
updateCounts();