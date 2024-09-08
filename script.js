'use strict';

const account1 = {
  username: 'Mohamed Ghoniem',
  pin: 111,
  movements: [200, -50, 34, -22, 500, -200, 1300, 600],
  messages: [],
};
const account2 = {
  username: 'Ahmed Mohamed',
  pin: 222,
  movements: [2300, -53, 500, -222, 500],
  messages: [],
};
const account3 = {
  username: 'Sara Ahmed',
  pin: 333,
  movements: [1200, -50, 340, -400, 1500, -4, -100, 50],
  messages: [],
};

const account4 = {
  username: 'aa',
  pin: 1,
  movements: [1200, -50, 340, -400, 1500, -4, -100, 50],
  messages: [],
};
const account5 = {
  username: 'bb',
  pin: 2,
  movements: [1200, 340, -400, 1500, -4, -100, 50],
  messages: [],
};

const accounts = [account1, account2, account3, account4, account5];

const logInName = document.querySelector('.username');
const logInPin = document.querySelector('.password');
const logInBtn = document.querySelector('.log-in-btn');
const logInSec = document.querySelector('.section-log-in');
const mainSec = document.querySelector('.section-main');
const movementsContainer = document.querySelector('.movements');
const balanceValue = document.querySelector('.balance-value');
const welcomeMessage = document.querySelector('.welcome-message');
const summaryIn = document.querySelector('.summary-value--in');
const summaryOut = document.querySelector('.summary-value--out');
const summaryInterest = document.querySelector('.summary-value--interest');
const logOutBtn = document.querySelector('.log-out-btn');
const deleteBtn = document.querySelector('.delete-account-btn');
const loanBtn = document.querySelector('.btn--loan');
const loanAmount = document.querySelector('.loan-amount');
const transferBtn = document.querySelector('.btn--transfer');
const transferAmount = document.querySelector('.transfer-amount');
const transferTo = document.querySelector('.user--to');
const messagesCounter = document.querySelector('.messages-count');
const messagesOutter = document.querySelector('.messages-outter');
const messagesSection = document.querySelector('.messages-container');
const messagesContainer = document.querySelector('.messages-list');
const messagesBtn = document.querySelector('.messages');
const sortBtn = document.querySelector('.sort-btn');

const displayMovements = function (movements, sorted = false) {
  movementsContainer.innerHTML = '';

  const movs = sorted ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const html = `
  <div class="movement movement--${mov > 0 ? 'deposit' : 'withdrawal'}">
            <p class="movement-label">${i + 1} ${
      mov > 0 ? 'deposit' : 'withdrawal'
    }</p>
            <p class="movement-value">${mov} $</p>
          </div>
  `;
    movementsContainer.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  balanceValue.textContent = `${balance}$`;

  acc.balance = balance;
};

const displaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  summaryIn.textContent = `${income}$`;

  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  summaryOut.textContent = `${Math.abs(outcome)}$`;

  const interest = acc.movements
    .filter(mov => mov > 1000)
    .map(mov => mov * 0.2)
    .reduce((acc, mov) => mov + acc, 0);
  summaryInterest.textContent = `${interest}$`;
  acc.interest = interest;
};

const displayMessagesCount = function (acc) {
  if (acc.messages.length !== 0) {
    messagesCounter.classList.remove('count-hidden');
    messagesCounter.textContent = acc.messages.length;
  } else {
    messagesCounter.classList.add('count-hidden');
  }
};

const displayMessages = function (acc) {
  messagesContainer.innerHTML = '';

  acc.messages.forEach(message => {
    const html = `<div class="message">
            <p class="message-from">${message.from.username}</p>
            <p class="message-amount">${message.amount}$</p>
            <div class="message-controls">
              <button class="btn message-accept">✅</button>
              <button class="btn message-refuse">❌</button>
            </div>
          </div>`;
    messagesContainer.insertAdjacentHTML('beforeend', html);
  });
};

const updateUI = function (acc) {
  welcomeMessage.textContent = `Welcome back, ${acc.username
    .split(' ')
    .at(0)}!`;
  displayMovements(acc.movements);
  displayBalance(acc);
  displaySummary(acc);
  displayMessagesCount(acc);
};

//event handlers

let currentAccount;

logInBtn.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc =>
      logInName.value.toLowerCase().trim() ===
        acc.username.toLowerCase().trim() && Number(logInPin.value) === acc.pin
  );
  if (currentAccount) {
    logInSec.classList.add('section-hidden');
    mainSec.classList.remove('section-hidden');
    updateUI(currentAccount);
    displayMessages(currentAccount);
  } else {
    alert('ACCOUNT NOT FOUND ❌');
  }
  logInName.value = logInPin.value = '';
});

logOutBtn.addEventListener('click', function () {
  const pin = prompt('Enter your pin:');
  if (Number(pin) === currentAccount.pin) {
    mainSec.classList.add('section-hidden');
    logInSec.classList.remove('section-hidden');
  } else {
    alert('Wrong PIN ❌');
  }
});

deleteBtn.addEventListener('click', function () {
  const pin = prompt(`Enter your PIN (⚠ account will be lost permanently)`);
  if (Number(pin) === currentAccount.pin) {
    const accontNum = accounts.indexOf(currentAccount);
    accounts.splice(accontNum, 1);
    mainSec.classList.add('section-hidden');
    logInSec.classList.remove('section-hidden');
  } else {
    alert('Wrong PIn ❌');
  }
});

loanBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const loan = Number(loanAmount.value);
  if ((currentAccount.balance - currentAccount.interest) * 1.2 > loan) {
    currentAccount.movements.push(loan);
    updateUI(currentAccount);
    loanAmount.value = '';
  } else {
    alert("Can't afford to request a loan");
  }
});

messagesBtn.addEventListener('click', function () {
  messagesSection.classList.remove('section-hidden');
  updateUI(currentAccount);

  const acceptBtns = [...document.querySelectorAll('.message-accept')];
  const refuseBtns = [...document.querySelectorAll('.message-refuse')];
  const messages = [...document.querySelectorAll('.message')];

  // accepting transfer
  for (const btn of acceptBtns) {
    btn.addEventListener('click', function () {
      const index = acceptBtns.indexOf(btn);
      currentAccount.movements.push(currentAccount.messages[index].amount);
      currentAccount.messages.splice(index, 1);
      acceptBtns.splice(index, 1);

      messages[index].style.display = 'none';
      messages.splice(index, 1);
      updateUI(currentAccount);
    });
  }

  // refusing transfer
  for (const btn of refuseBtns) {
    btn.addEventListener('click', function () {
      const index = refuseBtns.indexOf(btn);
      console.log(btn);
      console.log(currentAccount.messages);
      console.log(index);
      currentAccount.messages[index].from.movements.push(
        currentAccount.messages[index].amount
      );
      currentAccount.messages.splice(index, 1);
      refuseBtns.splice(index, 1);

      messages[index].style.display = 'none';
      messages.splice(index, 1);
      updateUI(currentAccount);
    });
  }
});

messagesOutter.addEventListener('click', function () {
  messagesSection.classList.add('section-hidden');
});

transferBtn.addEventListener('click', function (e) {
  e.preventDefault();

  const receivingAccount = accounts.find(
    acc =>
      acc.username.trim().toLowerCase() ===
      transferTo.value.trim().toLowerCase()
  );
  const amount = Number(transferAmount.value);

  if (
    receivingAccount &&
    receivingAccount !== currentAccount &&
    amount <= currentAccount.balance
  ) {
    currentAccount.movements.push(-amount);
    receivingAccount.messages.push({
      from: currentAccount,
      amount: amount,
    });
    updateUI(currentAccount);
  } else if (!receivingAccount) {
    alert('WRONG ACCOUNT ADDRESS');
  } else if (amount > currentAccount.balance) {
    alert(`You don't have enough money :( `);
  }
  transferAmount.value = transferTo.value = '';
});

let isSorted = false;
sortBtn.addEventListener('click', function () {
  displayMovements(currentAccount.movements, !isSorted);
  isSorted = !isSorted;
});
