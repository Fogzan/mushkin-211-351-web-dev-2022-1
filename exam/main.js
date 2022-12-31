let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api";
let key = "740a2b97-6ea6-453d-9f60-425597307217";
let countOfPages;
let globalListRoutes;
let globalListGuides;
let temporaryListRoutes;
let selectRoute;
let selectGuide;
let globalListAttractions = new Array();
let experienceFrom, experienceUpTo;

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

// Сортировка маршрутов 
// searchElement = name / mainObject
function sortJson(oldJson, searchElement, searchText) {
    const jsonLength = oldJson.length
    let newJson = new Array();
    for (let i = 0; i < jsonLength; i++) {
        let jsonElement = oldJson[i];

        if (searchElement == "name") {
            let strName = jsonElement.name.toLowerCase();
            searchText = searchText.toLowerCase();
            if (strName.includes(searchText)) {
                newJson.push(jsonElement);
            }
        } else if (searchElement == "mainObject") {
            //let strMainObject = jsonElement.mainObject.toLowerCase();
            if (jsonElement.mainObject.includes(searchText)) {
                newJson.push(jsonElement);
            }
        } else if (searchElement == "language") {
            let strName = jsonElement.language.toLowerCase();
            searchText = searchText.toLowerCase().trim();
            if (strName.includes(searchText)) {
                newJson.push(jsonElement);
            }
        }
    }
    //if (searchElement == "name" || searchElement == "mainObject")
        temporaryListRoutes = newJson;
    return newJson;
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
        // console.log(filter(routes));
        globalListRoutes = routes;
        return routes;
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}

// Загрузка количество страниц и выбранной страницы (на вход: количество страниц)
function loadNumberPages(numberPage, maxPages) {
    // console.log(numberPage + " " + maxPages);
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

    if (maxPages == 1) {
        page4.classList.add("d-none");
        page5.classList.add("d-none");
        page6.classList.add("d-none");
    } else if (maxPages == 2) {
        page5.classList.add("d-none");
        if (numberPage == 2) {
            page4.classList.add("d-none");
            page6.classList.add("d-none");
        }
    }
}

// Добавление элементов в HTML для loadRoutes (На вход: номер записи и сама запись)
function addNewElemRoute(number, infoElem) {
    //console.log(infoElem);
    let exapleExcursion = document.querySelector(".exaple-excursion").cloneNode(true);
    exapleExcursion.innerHTML = "";
    exapleExcursion.classList = "route";
    exapleExcursion.innerHTML += "<td scope=\"row\">" + number + "</td>";
    exapleExcursion.innerHTML += "<td>" + infoElem.name + "</td>";
    exapleExcursion.innerHTML += "<td>" + infoElem.description + "</td>";
    exapleExcursion.innerHTML += "<td>" + infoElem.mainObject + "</td>";
    let check_input = "<td><input class=\"form-check-input radio-route\" type=\"radio\" name=\"radio-route\" value=\"" + infoElem.id + "\" data-id=\"" + infoElem.id + "\"></td>";
    exapleExcursion.innerHTML += check_input;
    let listExcursion = document.querySelectorAll(".list-excursion")[0];
    listExcursion.append(exapleExcursion);
}

// Заполнение списка с Достопримечательностями в поиске по маршрутам
function addAttractionsToList(attractions) {
    let newListAttractions = new Array();
    let listAttractions = attractions.split("-");
    for (let i = 0; i < listAttractions.length; i++) {
        listAttractions[i] = listAttractions[i].trim();
        if (globalListAttractions.indexOf(listAttractions[i]) < 0)
            globalListAttractions.push(listAttractions[i]);
    }
}

// Заполнение списка с Достопримечательностями в поиске по маршрутам
function addAttractionsToHtml() {
    let attractionsListHtml = document.querySelector(".list-attractions");
    for (let i = 0; i < globalListAttractions.length; i++) {
        let exampleAttractions = document.querySelector(".exaple-attractions").cloneNode(true);
        exampleAttractions.classList = "";
        exampleAttractions.innerHTML = "";
        exampleAttractions.innerHTML += globalListAttractions[i];
        exampleAttractions.setAttribute("class", "elem-attractions");
        exampleAttractions.setAttribute("value", globalListAttractions[i]);
        attractionsListHtml.append(exampleAttractions);
    }
}

// Заполнение таблицы маршрутов (На вход номер страницы) при загрузке страницы
async function loadRoutesStart(numberPage) {
    let routes = await downloadFromServerRoutes();
    temporaryListRoutes = routes;
    for (let i = 0; i < routes.length; i++)
        addAttractionsToList(routes[i].mainObject);
    loadRoutes(numberPage, routes);
    addAttractionsToHtml();
}

// Заполнение таблицы маршрутов (На вход номер страницы)
function loadRoutes(numberPage, routes) {
    if (routes.length % 5 == 0) countOfPages = routes.length / 5;
    else countOfPages = Math.floor(routes.length / 5) + 1;
    loadNumberPages(numberPage, countOfPages);
    let allExcursionRoute = document.querySelectorAll(".route");
    for (let i = 0; i < allExcursionRoute.length; i++) {
        let elem = allExcursionRoute[i];
        elem.parentNode.removeChild(elem);
    }
    for (let i = (numberPage * 5) - 5; i < numberPage * 5; i++) {
        if (routes[i]) addNewElemRoute(i + 1, routes[i])
        //console.log(routes[i]);
    }
    //console.log(document.querySelectorAll('.radio-route'));
    let radioList = document.querySelectorAll('.radio-route');
    for (let i = 0; i < radioList.length; i++) {
        elem = radioList[i];
        elem.onchange = radioRouteChange;
    }
    if (selectRoute && document.querySelector("[data-id='" + selectRoute + "']")) {
        document.querySelector("[data-id='" + selectRoute + "']").parentNode.parentNode.classList.add("select-route");
        document.querySelector("[data-id='" + selectRoute + "']").setAttribute("checked", "true");
    }
}

// Обработчик события Нажатие на переключение страниц
function clickPageBtn(event) {
    if (event.target.dataset.page) {
        //console.log(temporaryListRoutes, globalListRoutes);
        //console.log(event.target.innerHTML);
        if (event.target.dataset.page == 0) {
            loadRoutes(1, temporaryListRoutes);
        } else if (event.target.dataset.page == 6) {
            loadRoutes(countOfPages, temporaryListRoutes);
        } else {
            loadRoutes(Number(event.target.innerHTML), temporaryListRoutes);
        }
    }
}

// Начало сортировки маршрутов 
function startSortRoutes() {
    let listRoutes = globalListRoutes.map(a => Object.assign({}, a));
    let nameRoute = document.querySelector(".search-routes").value;
    let attractionsRoute = document.querySelector(".list-attractions").options[document.querySelector(".list-attractions").selectedIndex].value;
    if (attractionsRoute || nameRoute) {
        if (nameRoute) {
            listRoutes = sortJson(listRoutes, "name", nameRoute);
        } 
        if (attractionsRoute) {
            listRoutes = sortJson(listRoutes, "mainObject", attractionsRoute);
        }
    } else {
        listRoutes = globalListRoutes;
    }
    temporaryListRoutes = listRoutes;
    return listRoutes;
}

// Начало сортировки гидов
function startSortGuides() {
    let listGuides = globalListGuides.map(a => Object.assign({}, a));
    let languageGuides = document.querySelector(".list-language").value;
    //experienceFrom, experienceUpTo
    //console.log("languageGuides");
    if (languageGuides || experienceFrom || experienceUpTo) {
        if (languageGuides) {
            listGuides = sortJson(listGuides, "language", languageGuides);
        } 
        if (experienceFrom || experienceUpTo) {
            listGuides = sortJsonExpWork(listGuides, experienceFrom, experienceUpTo);
        }
    } else {
        listGuides = globalListGuides;
    }
    newListGuides = listGuides;
    return listGuides;
}


// Поиск маршрутов по Достопримечательностям
function searchByAttractions(event) {
    let listRoutes = startSortRoutes();
    loadRoutes(1, listRoutes);
}

// Поиск маршрутов по названию
function searchByName(event) {
    let listRoutes = startSortRoutes();
    loadRoutes(1, listRoutes);
}

// Загрузка с сервера списка гидов
async function downloadFromServerGuides(idRoute) {
    let thisUrl = new URL(url + "/routes/" + idRoute + "/guides");
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "GET" });
        let guides = await response.json();
        globalListGuides = guides;
        return guides;
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}

// Добавление гидов в таблицу Html
function addNewElemGuides(number, infoElem) {
    //console.log(infoElem);
    let exapleGuide = document.querySelector(".exaple-guide").cloneNode(true);
    exapleGuide.innerHTML = "";
    exapleGuide.classList = "guide";
    exapleGuide.innerHTML += "<td scope=\"row\">" + number + "</td>";
    exapleGuide.innerHTML += "<td class=\"profile\"><img src=\"images\\profile.jpg\" alt=\"\" class=\"img-fluid\"></td>";
    exapleGuide.innerHTML += "<td>" + infoElem.name + "</td>";
    exapleGuide.innerHTML += "<td>" + infoElem.language + "</td>";
    exapleGuide.innerHTML += "<td class=\"text-center\">" + infoElem.workExperience + "</td>";
    exapleGuide.innerHTML += "<td class=\"text-center\">" + infoElem.pricePerHour + " рублей</td>";
    //let check_input = "<td><input class=\"form-check-input radio-guide\" type=\"radio\" name=\"radio-guide\" value=\"" + infoElem.id + "\" data-id=\"" + infoElem.id + "\"></td>";
    let check_input;
    if (selectGuide && infoElem.id == selectGuide) {
        exapleGuide.classList.add("select-guide");
        check_input = "<td><input checked class=\"form-check-input radio-guide\" type=\"radio\" name=\"radio-guide\" value=\"" + infoElem.id + "\" data-id=\"" + infoElem.id + "\"></td>";
    } else {
        check_input = "<td><input class=\"form-check-input radio-guide\" type=\"radio\" name=\"radio-guide\" value=\"" + infoElem.id + "\" data-id=\"" + infoElem.id + "\"></td>";
    }
    exapleGuide.innerHTML += check_input;
    let listGuide = document.querySelector(".list-guide");
    listGuide.append(exapleGuide);
}

// Добавление слотов сортировки по языку
function addLanguage(language) {
    let listLanguage = document.querySelector(".list-language");
    let exapleLanguage = document.querySelector(".example-language").cloneNode(true);
    listLanguage.innerHTML += "<option value=\" " + language + "\" class=\"element-language\">" + language + "</option>";
}

// Выбор языка у гида
function searchByLanguage(event) {
    //let newListGuides = sortJson(globalListGuides, "language", event.target.value);
    let listGuides = startSortGuides();
    loadGuideList(listGuides);
}

// Начало загрузки окна с гидами
async function stratLoadGuideList(idRoute) {
    document.querySelector(".guidesList").classList.remove("d-none");
    let guides = await downloadFromServerGuides(idRoute);
    let oldElemLanguage = document.querySelectorAll(".element-language");
    for (let i = 0; i < oldElemLanguage.length; i++)
        oldElemLanguage[i].parentNode.removeChild(oldElemLanguage[i]);
    for (let i = 0; i < guides.length; i++)
        addLanguage(guides[i].language);
    loadGuideList(guides);

}

// Загрузка окна с гидами
function loadGuideList(guides) {
    let allGuide = document.querySelectorAll(".guide");
    for (let i = 0; i < allGuide.length; i++) {
        allGuide[i].parentNode.removeChild(allGuide[i]);
    }
    for (let i = 0; i < guides.length; i++) {
        addNewElemGuides(i + 1, guides[i]);
    }
    document.querySelector('.list-language').onchange = searchByLanguage;
    let radioList = document.querySelectorAll('.radio-guide');
    for (let i = 0; i < radioList.length; i++) {
        elem = radioList[i];
        elem.onchange = radioGuideChange;
    }
}

// Обработчик события Нажатие на выбор гида
function radioGuideChange(event) {
    if (selectGuide)
        document.querySelector("[data-id='" + selectGuide + "']").parentNode.parentNode.classList.remove("select-guide");
    selectGuide = event.target.value;
    event.target.parentNode.parentNode.classList.add("select-guide");
    document.querySelector('.containet-btn-make-an-application').classList.remove("d-none");
}

// Обработчик события Нажатие на выбор маршрута
function radioRouteChange(event) {
    if (selectRoute)
        document.querySelector("[data-id='" + selectRoute + "']").parentNode.parentNode.classList.remove("select-route");
    selectRoute = event.target.value;
    event.target.parentNode.parentNode.classList.add("select-route");
    stratLoadGuideList(event.target.value);
}

// Сортировка для опыта работы
function sortJsonExpWork(oldJson, expFrom, expUptTo) {
    //let oldJson = globalListGuides;
    const jsonLength = oldJson.length;
    let newJson = new Array();
    for (let i = 0; i < jsonLength; i++) {
        let jsonElement = oldJson[i];
        if (expFrom >= 0 || expUptTo >= 0) {
            if (expFrom >= 0 && expUptTo >= 0 && expUptTo >= expFrom) {
                if (expFrom <= jsonElement.workExperience && expUptTo >= jsonElement.workExperience) {
                    newJson.push(jsonElement);
                }
            } else if (expFrom >= 0) {
                if (expFrom <= jsonElement.workExperience) {
                    newJson.push(jsonElement);
                }
            } else if (expUptTo >= 0) {
                if (expUptTo >= jsonElement.workExperience) {
                    newJson.push(jsonElement);
                }
            }
        } else {
            newJson = oldJson;
        }
    }
    if (!expFrom && !expUptTo) newJson = oldJson;
    return newJson;
}
// Функция поиска по опыту работы
function searchExperienceWork() {
    //let newListGuides = sortJsonExpWork(experienceFrom, experienceUpTo);
    let listGuide = startSortGuides();
    loadGuideList(listGuide);
}

// обработчик события ввода опыта работы ДО
function searchExperienceFrom(event) {
    experienceFrom = event.target.value;
    searchExperienceWork();
}

// обработчик события ввода опыта работы ДО
function searchExperienceUpTo(event) {
    experienceUpTo = event.target.value;
    searchExperienceWork();
}

// Обработчик события нажатия на кнопку оформление заявки
function clickOnMakeAnApplication(event) {
    alert("DA");
}

window.onload = function () {
    document.querySelector('.pagination').onclick = clickPageBtn; // Выбор страницы с маршрутами (клики)
    loadRoutesStart(1); // Загрузка 1ой страницы маршрутов
    document.querySelector('.search-routes').addEventListener('input', searchByName); // Поиск по названию маршрута (ввод названия)
    document.querySelector('.list-attractions').onchange = searchByAttractions; // Поиск по Достопримечательностям (выбор)
    document.querySelector('.experience-from').addEventListener('input', searchExperienceFrom); // Поиск гида по опыту ОТ (ввод названия)
    document.querySelector('.experience-up-to').addEventListener('input', searchExperienceUpTo); // Поиск гида по опыту ДО (ввод названия)
    document.querySelector('.make-an-application').onclick = clickOnMakeAnApplication; // Кнопка оформить заявку
};

// showAlert("ОШИБКА", "alert-danger"); <--- Пример вывода уведомлений