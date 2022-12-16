let counterTasks = 0;
let url = "http://tasks-api.std-900.ist.mospolytech.ru/api/tasks";
let key = "50d2199a-42dc-447d-81ed-d68a443b697e";
let titles = {
    "create": "Создание новой задачи",
    "edit": "Редактирование задачи",
    "show": "Просмотр задачи",
};
let actionBtn = {
    "create": "Создать",
    "edit": "Сохранить",
    "show": "Окей",
};

// Вывод уведомлений
function showAlert(error, color) {
    let alerts = document.querySelector(".alerts");
    let alert = document.createElement("div");
    alert.classList.add("alert", "alert-dismissible", color);
    alert.append(error);

    let btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("btn-close");
    btn.setAttribute("data-bs-dismiss", "alert");
    btn.setAttribute("aria-label", "Close");
    alert.append(btn);
    alerts.append(alert);
}

async function parseTask(taskId) {
    //let value = localStorage.getItem('task-' + taskId);
    //let task = JSON.parse(value);
    let thisUrl = new URL(url + "/" + taskId);
    thisUrl.searchParams.append("api_key", key);
    console.log(thisUrl);
    try {
        let response = await fetch(thisUrl, { method: "GET" });
        let task = await response.json();
        return task;
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}

// Изменение статуса todo <> done
async function toggleTask(event) {
    let target = event.target;
    let taskId = target.closest(".task").id;
    let task = await parseTask(taskId);
    if (task.status == "to-do") {
        task.status = "done";
    } else if (task.status == "done") {
        task.status = "to-do";
    }
    let item = document.getElementById(taskId);
    let list = document.querySelector(`#${task.status}-list ul`);
    list.append(item);

    let formData = new FormData();
    formData.append('status', task.status);
    let thisUrl = new URL(url + "/" + taskId);
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "PUT", body: formData });
        let data = await response.json();
    } catch (err) {
        showAlert(err.message, "alert-danger");
    }

    // taskId и task.status    
    // task = JSON.stringify(task);
    // localStorage.setItem('task-' + taskId, task);
}

// Создание новой задачи
function createNewTaskElem(task) {
    let templateTask = document.getElementById("taskTemplate");
    let newTask = templateTask.content.firstElementChild.cloneNode(true);
    let taskName = newTask.querySelector(".task-name");
    taskName.textContent = task.name;
    newTask.id = task.id;
    let arrows = newTask.querySelectorAll(".toggle-arrow");
    for (let arrow of arrows) {
        arrow.onclick = toggleTask;
    }
    return newTask;
}

// Добавление задачи в хранение
async function createTask(name, desc, status) {
    let data;
    let formData = new FormData();
    formData.append('name', name);
    formData.append('desc', desc);
    formData.append('status', status);
    let thisUrl = new URL(url);
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "POST", body: formData });
        data = await response.json();
    } catch (err) {
        showAlert(err.message, "alert-danger");
    }
    return data;
}

//Добавление задачи в HTML
function addTaskInHtml(task) {
    //createNewTaskElem(task);
    let list = document.querySelector("#" + task.status + "-list ul");

    let elemTask = createNewTaskElem(task);
    list.append(elemTask);
}

//Начало создания задачи || изменение
async function clickBtnHandler(event) {
    let modalWindow = event.target.closest(".modal");
    let form = modalWindow.querySelector("form");
    let formElements = form.elements;
    let name = formElements["name"].value;
    let desc = formElements["desc"].value;
    let status = formElements["status"].value;
    let action = formElements["action"].value;
    let taskId = formElements["taskId"].value;
    if (action == "create") {
        let task = await createTask(name, desc, status);
        addTaskInHtml(task);
    } else if (action == "edit") {
        let newTask = await parseTask(taskId);
        newTask.name = name;
        newTask.desc = desc;
        let formData = new FormData();
        formData.append('name', name);
        formData.append('desc', desc);
        let thisUrl = new URL(url + "/" + taskId);
        thisUrl.searchParams.append("api_key", key);
        try {
            let response = await fetch(thisUrl, { method: "PUT", body: formData });
            let data = await response.json();
        } catch (err) {
            showAlert(err.message, "alert-danger");
        }
        document.getElementById(taskId).querySelector(".task-name").textContent = name;
    }
    formElements['status'].closest('.row').classList.remove('d-none');
    form.reset();
}

// Подгрузка данных
async function dataLoad() {
    let maxId = 0;
    //Запрос на сервер
    let thisUrl = new URL(url);
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "GET" });
        let data = await response.json();
        let tasks = data.tasks;
        for (let task of tasks) {
            addTaskInHtml(task);
            if (maxId < task.id) maxId = task.id;
        }
    } catch (err) {
        showAlert(err.message, "alert-danger");
    }
    counterTasks = maxId + 1;
}

// Подсчет задач
function updateCounter(event) {
    let target = event.target;
    let taskCounter = target.closest('.card').querySelector('.task-counter');
    taskCounter.textContent = target.children.length;
}

// Удаление
async function deleteEvent(event) {
    let taskId = event.relatedTarget.closest('.task').id;
    let thisUrl = new URL(url + "/" + taskId);
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "GET" });
        let task = await response.json();
        event.target.querySelector('span.deleteTask').textContent = task.name;
        event.target.querySelector('form').elements['taskid'].value = task.id;
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}

// Изменение модальных окон для изменения и просмотра
async function actionEvent(event) {
    let action = event.relatedTarget.dataset.action;
    let form = event.target.querySelector('form');
    let task;
    form.elements['action'].value = action;
    event.target.querySelector('.modal-title').textContent = titles[action];
    event.target.querySelector('.create-btn').textContent = actionBtn[action];
    if (action == 'edit') {
        let taskId = event.relatedTarget.closest('.task').id;
        task = await parseTask(taskId);
        form.elements['name'].value = task.name;
        form.elements['desc'].value = task.desc;
        form.elements['taskId'].value = taskId;
        form.elements['status'].closest('.row').classList.add('d-none');
    }
    if (action == 'show') {
        let taskId = event.relatedTarget.closest('.task').id;
        task = await parseTask(taskId);
        form.elements['name'].value = task.name;
        form.elements['desc'].value = task.desc;
        form.elements['taskId'].value = taskId;
        form.elements['status'].closest('.row').classList.add('d-none');

        let button = event.target.querySelectorAll('.btn-secondary');
        button[0].classList.add('d-none'); // отключается кнопка отмены
        let name = form.querySelector('#name');
        let desc = form.querySelector('#desc');
        // ДОБАВИТЬ АТРИБУТ readonly ДЛЯ name и desc
        name.setAttribute('readonly', '');
        desc.setAttribute('readonly', '');
    }
}

// удаление задачи с сервера
async function deleteTask(taskId) {
    let thisUrl = new URL(url + "/" + taskId);
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "DELETE" });
        let task = await response.json();
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}

window.onload = function () {
    // 1. Создание задачи
    let createBtn = document.querySelector(".create-btn");
    createBtn.onclick = clickBtnHandler;
    // 2. Изменение столбцов с задачами = обновление счетчика
    let lists = document.querySelectorAll('#to-do-list ul, #done-list ul');
    for (let list of lists) {
        list.addEventListener('DOMSubtreeModified', updateCounter);
    }
    // 3. Удаление модальное окно
    let modal = document.querySelector('#deleteTask');
    modal.addEventListener('show.bs.modal', deleteEvent);
    // 4. Загрузка задач из хранения
    dataLoad();
    // 5. Само удаление задачи
    let buttonDel = document.querySelector('.delete');
    buttonDel.onclick = function (event) {
        let taskId = event.target.closest('.modal').querySelector('form').elements['taskid'].value;
        deleteTask(taskId);
        document.getElementById(taskId).remove();
    };
    // 6. Модальное окно добавления
    let modalAddTask = document.querySelector('#addTask');
    modalAddTask.addEventListener('show.bs.modal', actionEvent);
    // 7. Изменение статуса
    let arrows = document.querySelectorAll(".toggle-arrow");
    for (let arrow of arrows) {
        arrow.onclick = toggleTask;
    }
};