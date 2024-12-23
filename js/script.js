const grid = document.querySelector(".grid");
const squares = document.querySelectorAll(".square");
const gameTitle = document.querySelector(".title");
const rematchBtn = document.querySelector(".rematch");
let turn = "X";
let board = [
  ["-", "-", "-"],
  ["-", "-", "-"],
  ["-", "-", "-"],
];

// Initiate game state
let gameState = checkGame(board);

squares.forEach((square, i) => {
  square.onclick = () => {
    if (gameState != "-1") {
      return;
    }

    // check if the box already played on
    if (square.getAttribute("data-item") != "") {
      // TODO: Send notification msg
      alert("This box already played on");
      return;
    }

    let success = play(i + 1, turn);

    // Second level of safety
    if (!success) {
      // TODO: Send notification msg
      alert("This box already played on");
      return;
    }

    gameState = checkGame(board);
    // The game end's and the winner is the current player turn
    if (gameState == "1") {
      gameTitle.innerHTML = `${turn} won !!!, Start a new match`;
      return;
    }

    if (gameState == "0") {
      gameTitle.innerHTML = "It's a DRAW, Start a new match";
      return;
    }

    // Change turns
    turn = changeTurn(turn);
    gameTitle.innerHTML = `${turn} Turn`;
  };
});

rematchBtn.onclick = (n) => {
  // Reset the board
  board = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ];

  // Return turns to default
  turn = "X";
  updateGrid(board);

  // Reset game title
  gameTitle.innerHTML = "3X3 XO GAME";

  gameState = checkGame(board);
};

// *: Helper functions starts here

// return false if the position already played on
function play(position, item) {
  let indicator = 1;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (position == indicator++) {
        if (board[i][j] != "-") return false;

        board[i][j] = item;
        updateGrid(board);
        return true;
      }
    }
  }
  return false;
}

// return 1 there is a winner and 0 if draw, -1 if the game still on
function checkGame(gameBoard) {
  if (
    gameBoard[0][0] == gameBoard[0][1] &&
    gameBoard[0][0] == gameBoard[0][2] &&
    gameBoard[0][0] != "-"
  )
    return 1;

  // Second row case
  if (
    gameBoard[1][0] == gameBoard[1][1] &&
    gameBoard[1][0] == gameBoard[1][2] &&
    gameBoard[1][0] != "-"
  )
    return 1;

  // Third row case
  if (
    gameBoard[2][0] == gameBoard[2][1] &&
    gameBoard[2][0] == gameBoard[2][2] &&
    gameBoard[2][0] != "-"
  )
    return 1;

  // First column case
  if (
    gameBoard[0][0] == gameBoard[1][0] &&
    gameBoard[0][0] == gameBoard[2][0] &&
    gameBoard[0][0] != "-"
  )
    return 1;

  // Second column case
  if (
    gameBoard[0][1] == gameBoard[1][1] &&
    gameBoard[0][1] == gameBoard[2][1] &&
    gameBoard[0][1] != "-"
  )
    return 1;

  // Third column case
  if (
    gameBoard[0][2] == gameBoard[1][2] &&
    gameBoard[0][2] == gameBoard[2][2] &&
    gameBoard[0][2] != "-"
  )
    return 1;

  // Main diagonal case
  if (
    gameBoard[0][0] == gameBoard[1][1] &&
    gameBoard[0][0] == gameBoard[2][2] &&
    gameBoard[0][0] != "-"
  )
    return 1;

  // Second diagonal case
  if (
    gameBoard[0][2] == gameBoard[1][1] &&
    gameBoard[0][2] == gameBoard[2][0] &&
    gameBoard[0][2] != "-"
  )
    return 1;

  // game still on
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (gameBoard[i][j] == "-") return "-1";
    }
  }

  // otherwise it is a draw
  return "0";
}

function changeTurn(currentTurn) {
  return currentTurn == "X" ? "O" : "X";
}

function updateGrid(newGrid) {
  let indicator = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let item = newGrid[i][j];
      squares[indicator].setAttribute("data-item", item == "-" ? "" : item);
      indicator++;
    }
  }
}
