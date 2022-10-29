// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.

function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Проверка, является ли строка str числом.

function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.

function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.

function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && 
                   isOperation(stack[stack.length - 1]) && 
                   priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением, записанным в обратной 
// польской нотации. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запись#Вычисления_на_стеке).


function evaluate(str) {
    let stack = [];
    stack = str.split(" ");

    let newStack = [];
    let next = 0;

    const operators = {
        '+': (x, y) => x + y,
        '-': (x, y) => x - y,
        '*': (x, y) => x * y,
        '/': (x, y) => x / y
    };
    console.log(stack);
    while (stack.length != 1) {
        let x = stack[0];
        let y = stack[1];
        for (let i = 2; i < stack.length; i++) {
            if (stack[i] in operators) {
                newStack.push(operators[stack[i]](Number(x), Number(y)));
                next = i + 1;
                break;
            } else {
                newStack.push(x);
                x = y;
                y = stack[i];
            }
        }
        for (let j = next; j < stack.length; j++) newStack.push(stack[j]);
        stack.length = 0;
        for (let i = 0; i < newStack.length; i++) stack[i] = newStack[i];
        newStack.length = 0;
    }

    return stack[0];
}

// Функция clickHandler предназначена для обработки 
// событий клика по кнопкам калькулятора. 
// По нажатию на кнопки с классами digit, operation и bracket
// на экране (элемент с классом screen) должны появляться 
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана 
// должно очищаться.
// По нажатию на кнопку с классом result на экране 
// должен появиться результат вычисления введённого выражения 
// с точностью до двух знаков после десятичного разделителя (точки).
// Реализуйте эту функцию. Воспользуйтесь механизмом делегирования 
// событий (https://learn.javascript.ru/event-delegation), чтобы 
// не назначать обработчик для каждой кнопки в отдельности.


function clickHandler(event) {
    let screen = document.getElementsByClassName("screen")[0];
    let target = event.target;
    if (target.className == "key clear") {
        screen.innerHTML = "";
        return;
    }
    if (target.className == "key digit") {
        screen.innerHTML += target.innerHTML;
        return;
    }
    if (target.className == "key operation") {
        screen.innerHTML += target.innerHTML;
        return;
    }
    if (target.className == "key bracket") {
        screen.innerHTML += target.innerHTML;
        return;
    }
    if (target.className == "key result") {
        let result = evaluate(compile(screen.innerHTML));
        screen.innerHTML = Math.round(result * 100) / 100;
        return;
    }
    return;
}


// Назначьте нужные обработчики событий.

window.onload = function () {
    let buttons = document.getElementsByClassName("buttons");
    for (let i = 0; i < buttons.length; i++) buttons[i].onclick = clickHandler;
};
