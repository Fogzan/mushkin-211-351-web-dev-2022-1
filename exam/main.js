let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api";
let key = "740a2b97-6ea6-453d-9f60-425597307217";
let countOfPages;

// Показ уведомлений, взят из Bootstrap5 (https://getbootstrap.com/docs/5.3/components/alerts/)
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

// Загрузка маршрутов с сервера (на выход: JSON с маршрутами)
async function downloadFromServerRoutes() {
    let thisUrl = new URL(url + "/routes");
    thisUrl.searchParams.append("api_key", key);
    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', thisUrl);
    // xhr.responseType = 'json';
    // xhr.send();
    // xhr.onload = function () {
    //     console.log(this.response);
    // };
    
    try {
        let response = await fetch(thisUrl, { method: "GET" });
        let routes = await response.json();
        //console.log(routes);
        return routes;
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}

// Загрузка количество страниц и выбранной страницы (на вход: количество страниц)
function loadNumberPages(numberPage, maxPages) {
    let page0 = document.querySelectorAll("[data-page=\"0\"]")[0];
    let page1 = document.querySelectorAll("[data-page=\"1\"]")[0];
    let page2 = document.querySelectorAll("[data-page=\"2\"]")[0];
    let page3 = document.querySelectorAll("[data-page=\"3\"]")[0];
    let page4 = document.querySelectorAll("[data-page=\"4\"]")[0];
    let page5 = document.querySelectorAll("[data-page=\"5\"]")[0];
    let page6 = document.querySelectorAll("[data-page=\"6\"]")[0];

    page1.innerHTML = Number(numberPage) - 2;
    page2.innerHTML = Number(numberPage) - 1;
    page3.innerHTML = Number(numberPage);
    page4.innerHTML = Number(numberPage) + 1;
    page5.innerHTML = Number(numberPage) + 2;

    page0.classList.remove("d-none");
    page1.classList.remove("d-none");
    page2.classList.remove("d-none");
    page3.classList.remove("d-none");
    page4.classList.remove("d-none");
    page5.classList.remove("d-none");
    page6.classList.remove("d-none");
    page3.classList.add("active");
    if (numberPage == 1) {
        page0.classList.add("d-none");
        page1.classList.add("d-none");
        page2.classList.add("d-none");
    } else if (numberPage == 2) {
        page1.classList.add("d-none");
    } else if (numberPage == maxPages - 1) {
        page5.classList.add("d-none");
    } else if (numberPage == maxPages) {
        page4.classList.add("d-none");
        page5.classList.add("d-none");
        page6.classList.add("d-none");
    }
}

// Добавление элементов в HTML для loadRoutes (На вход: номер записи и сама запись)
function addNewElemRoute(number, infoElem) {
    //console.log(infoElem);
    let exapleExcursion = document.querySelectorAll(".exaple-excursion")[0].cloneNode(true);
    exapleExcursion.innerHTML = "";
    exapleExcursion.classList = "route";
    let count = number;
    exapleExcursion.innerHTML += "<td scope=\"row\">" + count + "</td>";
    exapleExcursion.innerHTML += "<td>" + infoElem.name + "</td>";
    exapleExcursion.innerHTML += "<td>" + infoElem.description + "</td>";
    exapleExcursion.innerHTML += "<td>" + infoElem.mainObject + "</td>";
    let check_input = "<td><input class=\"form-check-input\" type=\"radio\" name=\"flexRadioDefault\" id=\"flexRadioDefault\"></td>";
    exapleExcursion.innerHTML += check_input;
    let listExcursion = document.querySelectorAll(".list-excursion")[0];
    listExcursion.append(exapleExcursion);
}

// Заполнение таблицы маршрутов (На вход номер страницы)
async function loadRoutes(numberPage) {
    let routes = await downloadFromServerRoutes();
    countOfPages = Math.floor(routes.length/5) + 1;
    loadNumberPages(numberPage, countOfPages);
    let allExcursionRoute = document.querySelectorAll(".route");
    for(let i = 0; i < allExcursionRoute.length; i++)
        allExcursionRoute[i].classList.add("d-none");
    for (let i = (numberPage * 5) - 5; i < numberPage * 5; i++) {
        if (routes[i]) addNewElemRoute(i + 1, routes[i])
        //console.log(routes[i]);
    }
}

// Обработчик события Нажатие на переключение страниц
function clickPageBtn(event) {
    if (event.target.dataset.page) {
        //console.log(event.target.innerHTML);
        if (event.target.dataset.page == 0) {
            loadRoutes(1);
        } else if (event.target.dataset.page == 6) {
            loadRoutes(24);
        } else {
            loadRoutes(Number(event.target.innerHTML));
        }
    }
}

window.onload = function () {
    document.querySelector('.pagination').onclick = clickPageBtn;
    loadRoutes(1);

};

// showAlert("ОШИБКА", "alert-danger"); <--- Пример вывода уведомлений