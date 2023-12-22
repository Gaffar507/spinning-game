// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user is won
// 6. Give the user their winings
// 7. Play again

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};
const SYMBOLS_VALUS = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmount = parseFloat(prompt("Enter your deposit amount : "));
    if (isNaN(depositAmount) || depositAmount <= 0) {
      console.log("Invalid deposit amount , try again");
    } else {
      return depositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const getLines = parseFloat(
      prompt("Enter number of lines to bet (1-3) : ")
    );
    if (isNaN(getLines) || getLines <= 0 || getLines > 3) {
      console.log("Invalid number of lines , try again");
    } else {
      return getLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const getBet = parseFloat(prompt("Enter the bet per line : "));
    if (isNaN(getBet) || getBet <= 0 || getBet > balance / lines) {
      console.log("Invalid bet , try again");
    } else {
      return getBet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbols = reelSymbols[randomIndex];
      reels[i].push(selectedSymbols);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;
    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winnings += bet * SYMBOLS_VALUS[symbols[0]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log("You have a balance of $" + balance);
    const numberOfLines = getNumberOfLines();
    const numberOfBet = getBet(balance, numberOfLines);
    balance -= numberOfBet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    const print = printRows(rows);
    const winnings = getWinnings(rows, numberOfBet, numberOfLines);
    if (winnings) {
      balance += winnings;
      console.log(
        "You won, $" +
          winnings.toString() +
          ", and your current balance is $" +
          balance
      );
    } else {
      console.log(
        "You won $" + winnings + ", and your current balance is $" + balance
      );
    }
    if (balance <= 0) {
      console.log("You ran out of money!");
      break;
    }

    const playAgain = prompt("Do you want to play again (y/n)");
    if (playAgain != "y") {
      break;
    }
  }
};

game();