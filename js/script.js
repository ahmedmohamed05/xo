// TODO: Add a score
const gameModBtns = document.querySelectorAll(".mode-btns .btns button");
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

gameModBtns.forEach((btn) => {
  btn.onclick = () => {
    if (btn.getAttribute("data-mode") == "locally") {
      playLocally();
    } else {
      playAgainstComputer();
    }
    document.querySelector(".mode-btns").remove();
    document.querySelector(".game").classList.remove("hidden");
  };
});

function playLocally() {
  let gameState = checkGame(board);
  squares.forEach((square, i) => {
    square.onclick = () => {
      if (gameState != "-1") {
        return;
      }

      // check if the box already played on
      if (square.getAttribute("data-item") != "") {
        // TODO: Send notification msg
        alert("هذا المربع ملعوب عليه مُسبقا");
        return;
      }

      let success = play(i + 1, turn);

      // Second level of safety
      if (!success) {
        // TODO: Send notification msg
        alert("هذا المربع ملعوب عليه مُسبقا");
        return;
      }

      gameState = checkGame(board);
      // The game end's and the winner is the current player turn
      if (gameState == "1") {
        gameTitle.innerHTML = `فاز اللاعب ${turn} !!!, اضغط للعب مره اخرى`;
        // TODO: Add animation to the winning squares
        return;
      }

      if (gameState == "0") {
        gameTitle.innerHTML = "تعادل !!!, اضغط للعب مره اخرى";
        return;
      }

      // Change turns
      turn = changeTurn(turn);
      gameTitle.innerHTML = `${turn} Turn`;
    };
  });
}

function playAgainstComputer() {
  let gameState = checkGame(board);

  squares.forEach((square, i) => {
    square.onclick = () => {
      if (gameState != -1) return;

      // check if the box already played on
      if (square.getAttribute("data-item") != "") {
        // TODO: Send notification msg
        alert("هذا المربع ملعوب عليه مُسبقا");
        return;
      }

      // !: REFACTOR this nonsense pleas
      // Player plays
      let playingPosition = i + 1;
      let success = play(playingPosition, turn);
      // Reload the page if something went wrong
      if (!success) {
        alert("عذراً حدث خطأ ما");
        location.reload();
      }
      gameState = checkGame(board);
      // The game end's and the winner is the current player turn
      if (gameState == 1) {
        gameTitle.innerHTML = "مبروك لقد فزت !!!!";
        // TODO: Add animation to the winning squares
        return;
      }
      if (gameState == 0) {
        gameTitle.innerHTML = "تعادل !!!, اضغط اعادة اللعب";
        return;
      }
      // Change turns
      turn = changeTurn(turn);

      // Computer Plays
      playingPosition = getComputerMove(board);
      success = play(playingPosition, turn);
      // Reload the page if something went wrong
      if (!success) {
        alert("عذراً حدث خطأ ما");
        location.reload();
      }
      gameState = checkGame(board);
      // The game end's and the winner is the current player turn
      if (gameState == 1) {
        gameTitle.innerHTML = "لقد فاز الكمبيوتر, اضغط اعادة اللعب";
        // TODO: Add animation to the winning squares
        return;
      }
      if (gameState == 0) {
        gameTitle.innerHTML = "تعادل !!!, اضغط اعادة اللعب";
        return;
      }
      // Change turns
      turn = changeTurn(turn);
      gameTitle.innerHTML = `دورك ألعب`;
    };
  });

  function getComputerMove(gameBoard) {
    // Check Rows
    {
      let position = 0;
      for (let i = 0; i < 3; i++) {
        let userMarks = 0,
          emptyBoxes = 0,
          computerMarks = 0;
        let updatePosition = true;
        for (let j = 0; j < 3; j++) {
          if (updatePosition) position++;

          if (gameBoard[i][j] == "X") userMarks++;
          if (gameBoard[i][j] == "O") computerMarks++;
          if (gameBoard[i][j] == "-") {
            emptyBoxes++;
            position = j + (i * 3 + 1); // to correct the position
            updatePosition = false;
          }
        }

        if ((userMarks == 2 || computerMarks == 2) && emptyBoxes == 1)
          return position;
      }
    }

    // Check columns
    {
      let position = 0;
      for (let i = 0; i < 3; i++) {
        let userMarks = 0,
          emptyBoxes = 0,
          computerMarks = 0;
        let updatePosition = true;
        for (let j = 0; j < 3; j++) {
          if (updatePosition) position++;
          if (gameBoard[j][i] == "X") userMarks++;
          if (gameBoard[j][i] == "O") computerMarks++;
          if (gameBoard[j][i] == "-") {
            emptyBoxes++;
            position = j * 3 + i + 1; // to correct the position
            updatePosition = false;
          }
        }

        if ((userMarks == 2 || computerMarks == 2) && emptyBoxes == 1)
          return position;
      }
    }

    // Check main diagonal
    {
      let position = 0;
      let userMarks = 0,
        emptyBoxes = 0,
        computerMarks = 0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          position++;
          if (i == j) {
            if (gameBoard[i][j] == "X") userMarks++;
            if (gameBoard[i][j] == "-") emptyBoxes++;
            if (gameBoard[i][j] == "O") computerMarks++;
          }
        }

        if ((userMarks == 2 || computerMarks == 2) && emptyBoxes == 1)
          return position;
      }
    }

    // Anti-Diagonal
    {
      let position = 0,
        userMarks = 0,
        emptyBoxes = 0,
        computerMarks = 0;
      let updatePosition = true;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (updatePosition) position++;
          if (i + j == 2) {
            if (gameBoard[i][j] == "X") userMarks++;
            if (gameBoard[i][j] == "O") computerMarks++;
            if (gameBoard[i][j] == "-") {
              emptyBoxes++;
              updatePosition = false;
            }
          }
        }

        if ((userMarks == 2 || computerMarks == 2) && emptyBoxes == 1)
          return position;
      }
    }

    let position = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        position++;
        if (gameBoard[i][j] == "-") {
          return position;
        }
      }
    }

    return -1;
  }
}

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
  gameTitle.innerHTML = "ابدأ اللعب";

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
      if (gameBoard[i][j] == "-") return -1;
    }
  }

  // otherwise it is a draw
  return 0;
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
