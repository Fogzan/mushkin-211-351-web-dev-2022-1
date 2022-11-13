function createAuthorElement(record) {
    let user = record.user || { 'name': { 'first': '', 'last': '' } };
    let authorElement = document.createElement('div');
    authorElement.classList.add('author-name');
    authorElement.innerHTML = user.name.first + ' ' + user.name.last;
    return authorElement;
}

function createUpvotesElement(record) {
    let upvotesElement = document.createElement('div');
    upvotesElement.classList.add('upvotes');
    upvotesElement.innerHTML = record.upvotes;
    return upvotesElement;
}

function createFooterElement(record) {
    let footerElement = document.createElement('div');
    footerElement.classList.add('item-footer');
    footerElement.append(createAuthorElement(record));
    footerElement.append(createUpvotesElement(record));
    return footerElement;
}

function createContentElement(record) {
    let contentElement = document.createElement('div');
    contentElement.classList.add('item-content');
    contentElement.innerHTML = record.text;
    return contentElement;
}

function createListItemElement(record) {
    let itemElement = document.createElement('div');
    itemElement.classList.add('facts-list-item');
    itemElement.append(createContentElement(record));
    itemElement.append(createFooterElement(record));
    return itemElement;
}

function renderRecords(records) {
    let factsList = document.querySelector('.facts-list');
    factsList.innerHTML = '';
    for (let i = 0; i < records.length; i++) {
        factsList.append(createListItemElement(records[i]));
    }
}

function setPaginationInfo(info) {
    document.querySelector('.total-count').innerHTML = info.total_count;
    let start = info.total_count && (info.current_page - 1) * info.per_page + 1;
    document.querySelector('.current-interval-start').innerHTML = start;
    let end = Math.min(info.total_count, start + info.per_page - 1);
    document.querySelector('.current-interval-end').innerHTML = end;
}

function createPageBtn(page, classes = []) {
    let btn = document.createElement('button');
    classes.push('btn');
    for (cls of classes) {
        btn.classList.add(cls);
    }
    btn.dataset.page = page;
    btn.innerHTML = page;
    return btn;
}

function renderPaginationElement(info) {
    let btn;
    let paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    btn = createPageBtn(1, ['first-page-btn']);
    btn.innerHTML = 'Первая страница';
    if (info.current_page == 1) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);

    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('pages-btns');
    paginationContainer.append(buttonsContainer);

    let start = Math.max(info.current_page - 2, 1);
    let end = Math.min(info.current_page + 2, info.total_pages);
    for (let i = start; i <= end; i++) {
        btn = createPageBtn(i, i == info.current_page ? ['active'] : []);
        buttonsContainer.append(btn);
    }

    btn = createPageBtn(info.total_pages, ['last-page-btn']);
    btn.innerHTML = 'Последняя страница';
    if (info.current_page == info.total_pages) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);
}

function downloadData(page = 1, condition = null) {
    let factsList = document.querySelector('.facts-list');
    let url = new URL(factsList.dataset.url);
    let perPage = document.querySelector('.per-page-btn').value;
    url.searchParams.append('page', page);
    url.searchParams.append('per-page', perPage);
    if (condition != null) url.searchParams.append('q', condition);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderRecords(this.response.records);
        setPaginationInfo(this.response['_pagination']);
        renderPaginationElement(this.response['_pagination']);
    };
    xhr.send();
}

//отправляется запрос с определенным условием
function search(event) {
    let condition = document.querySelector('.search-field').value;
    downloadData(1, condition);
    console.log(condition);
}

function perPageBtnHandler(event) {
    search();
}

function pageBtnHandler(event) {
    if (event.target.dataset.page) {
        let condition = document.querySelector('.search-field').value;
        downloadData(event.target.dataset.page, condition);
        window.scrollTo(0, 0);
    }
}

// очищение полей автозаполенния 
function clearAutoField() {
    let t = document.querySelector('.auto');
    t.classList.add('display-none');
}

// заполнение полей автозаполнения
function autoFieldEnd(arrayAutoField) {
    if (arrayAutoField.length == 0) clearAutoField();
    else {
        let auto = document.querySelector('.auto');
        auto.classList.remove('display-none');
        auto.innerHTML = "";
        for (let objectAutoField of arrayAutoField) {
            let div = document.createElement('div');
            div.classList.add('automatic-addition');
            div.innerHTML = objectAutoField;
            auto.append(div);
        }
    }
}

// поиск автозаполенний
function downloadDataAutoField(params) {
    let autoField = document.querySelector('.auto');
    let url = new URL(autoField.dataset.url);
    url.searchParams.append('q', params);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        autoFieldEnd(this.response);
    };
    xhr.send();
}

// автозаполенния
function autoField(event) {
    let symbols = document.querySelector('.search-field').value;
    if (symbols) downloadDataAutoField(symbols);
    else clearAutoField();
}

// при клике на поле автозаполнения происходит автозаполение поля
function autoFill(event) {
    console.log(event.target.innerHTML);
    let word = event.target.innerHTML;
    document.querySelector('.search-field').value = word;
    clearAutoField();
} 

window.onload = function () {
    downloadData();
    document.querySelector('.pagination').onclick = pageBtnHandler;
    document.querySelector('.per-page-btn').onchange = perPageBtnHandler;
    // нажатие кнопки поиск
    document.querySelector('.search-btn').onclick = search;  
    // очищение полей автозаполенния 
    clearAutoField();
    // автозаполнение
    let searchField = document.querySelector('.search-field');
    searchField.addEventListener('input', autoField);
    // при клике на поле автозаполнения происходит автозаполение поля
    document.querySelector('.auto').onclick = autoFill; 
};