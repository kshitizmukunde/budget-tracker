// localStorage.setItem("name", "kshitiz");
// localStorage.setItem("age", 25);

// const name = localStorage.getItem("name");
// const age = localStorage.getItem("age");

// console.log(name, typeof name);
// console.log(age, typeof age);

// localStorage.clear();
// localStorage.age = 26;

// localStorage.removeItem("name");
// localStorage.removeItem("age");

// PARSE AND STRINGIFY //

// const data = [
//     {username: "kshitiz", age: 25},
//     {username: "john", age: 29}
// ];

// const dataStringify = JSON.stringify(data);

// localStorage.setItem("data", dataStringify);

// const accessData = localStorage.getItem("data");
// console.log(accessData);
// const final = JSON.parse(accessData);
// console.log(final);

const form = document.querySelector("form");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [] ;

function updateStatistics() {
    const updatedIncome = transactions
    .filter(transaction => transaction.amount > 0)
    .reduce((total, transaction) => total += transaction.amount, 0);

    const updatedExpense = transactions
    .filter(transaction => transaction.amount < 0)
    .reduce((total, transaction) => total += Math.abs(transaction.amount), 0);


    const updatedBalance = updatedIncome - updatedExpense;
    balance.textContent = updatedBalance;
    income.textContent = updatedIncome;
    expense.textContent = updatedExpense;
}

function generateTemplate(id, source, amount, time) {
    return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                $<span>${Math.abs(amount)}</span>
                <i class="bi bi-trash delete">del</i>
            </li>`;
}

function addTransactionDOM(id, source, amount, time) {
    if(amount > 0) {
        incomeList.innerHTML += generateTemplate(id, source, amount, time);
    } else {
        expenseList.innerHTML += generateTemplate(id, source, amount, time);
    }
}

function addTransaction(source, amount) {
    const time = new Date();
    const transaction = {
        id: Math.floor(Math.random()*10000),
        source: source,
        amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    addTransactionDOM(transaction.id, source, amount, transaction.time);
} 


form.addEventListener("submit", event => {
    event.preventDefault();
    if(form.source.value.trim() === "" || form.amount.value === ""){
        return alert("Please Add Proper Values!");
    } else {
        addTransaction(form.source.value.trim(), Number(form.amount.value));
        updateStatistics();
        form.reset();
    }
})

function getTransaction() {
    transactions.forEach(transaction => {
        if(transaction.amount > 0) {
            incomeList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        } else {
            expenseList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        }
    })
}


function deleteTransaction(id) {
    transactions = transactions.filter(transaction => {
        // console.log(transaction.id, id)
        return transaction.id !== id;
        });
    localStorage.setItem("transactions", JSON.stringify(transactions));
};


incomeList.addEventListener("click", event => {
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        updateStatistics();
    }
});

expenseList.addEventListener("click", event => {
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        updateStatistics();
    }
});

function init() {
    getTransaction();
    updateStatistics();
}

init();

// const numbers = [1, 2, 3, 4, 5];
// reducedNumbers = numbers.reduce((total, current) => {
//     total = total + current;
//     return total;
// }, 0);
// console.log(reducedNumbers);