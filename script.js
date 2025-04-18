let gameMode = "";
let gameModeButton = document.querySelectorAll(".btn");
const scoreBoard = document.querySelector(".scoreBoard");
const scoreBoardMob = document.querySelector(".scoreBoardMob");
const game = document.querySelector(".gameContent");
const gameMenu = document.querySelector(".gameMenu");
const gameName = document.querySelector(".nameGame");
const alterGameMode = document.querySelectorAll(".changeGameMode");
const points1 = document.querySelector(".point1");
const points2 = document.querySelector(".point2");
let pointPlayer1 = 0;
let pointPlayer2 = 0;
const playerName = document.querySelectorAll(".playerName");
alterGameMode.forEach((button) => {
  button.addEventListener("click", () => {
    scoreBoardMob.classList.add("hidden");
    gameName.classList.remove("hidden");
    game.classList.add("hidden");
    gameMenu.classList.remove("hidden");
    scoreBoard.classList.add("hidden");
    pointPlayer1 = 0;
    pointPlayer2 = 0;
    reset();
    points1.textContent = pointPlayer1;
    points2.textContent = pointPlayer2;
  })
});

gameModeButton.forEach((button) => {
  button.addEventListener("click", () => {
    gameName.classList.add("hidden");
    game.classList.remove("hidden");
    gameMenu.classList.add("hidden");
    scoreBoard.classList.remove("hidden");
    scoreBoardMob.classList.remove("hidden");
    // alert(scoreBoardMob.classList.contains("hidden"));

    if (button.classList.contains("withFriend")) {
      gameMode = "withFriend";
      playerName[1].textContent = "Player 2";
    } else if (button.classList.contains("withMachine")) {
      gameMode = "withMachine";
      playerName[1].textContent = "Máquina";
    } else {
      gameName.classList.remove("hidden");
      game.classList.add("hidden");
      gameMenu.classList.remove("hidden");
      scoreBoard.classList.add("hidden");
    }
  });
});
const player1 = "X";
const player2 = "O";
let currentTurn = player1;
const resetButton = document.querySelector(".reset");
const popUps = document.querySelector(".popUps");
const popUpMessage = document.querySelector(".message h3");
const contents = document.querySelectorAll(".content");

contents.forEach((content) => {
  content.addEventListener("click", () => {
    let shape = content.querySelector(".shape");

    if (shape.textContent !== "") {
      return;
    } else {
      shape.classList.add("show");
      shape.textContent = currentTurn;
      shape.classList.add(currentTurn === player1 ? "x" : "circle");

      if (checkWin(contents)) {
        if (currentTurn === player1) {
          popUpMessage.textContent = "O Player 1 Ganhou!";
          pointPlayer1++;
          points1.textContent = pointPlayer1;
        } else {
          popUpMessage.textContent = "O Player 2 Ganhou!";
          pointPlayer2++;
          points2.textContent = pointPlayer2;
        }
        popUps.classList.remove("hidden");
        return;
      }

      if (isTie()) {
        popUps.classList.remove("hidden");
        popUpMessage.textContent = "Deu velha!";
        return;
      }

      currentTurn = currentTurn === player1 ? player2 : player1;

      if (gameMode === "withMachine" && currentTurn === player2) {
        setTimeout(() => {
          botMove();

          if (checkWin(contents)) {
            popUpMessage.textContent = "A Máquina Ganhou!";
            pointPlayer2++;
            points2.textContent = pointPlayer2;
            popUps.classList.remove("hidden");
            return;
          }

          if (isTie()) {
            popUps.classList.remove("hidden");
            popUpMessage.textContent = "Deu velha!";
            return;
          }

          currentTurn = player1;
        }, 550);
      }
    }
  });
});

resetButton.addEventListener("click", reset);
const checkPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
function checkWin(moves) {
  for (let pattern of checkPatterns) {
    const [a, b, c] = pattern;
    const shapeA = moves[a].querySelector(".shape").textContent;
    const shapeB = moves[b].querySelector(".shape").textContent;
    const shapeC = moves[c].querySelector(".shape").textContent;

    if (shapeA && shapeA === shapeB && shapeA === shapeC) {
      return true;
    }
  }
  return false;
}

function isTie() {
  return Array.from(contents).every(
    (content) => content.querySelector(".shape").textContent !== ""
  );
}

function reset() {
  currentTurn = player1;
  contents.forEach((content) => {
    content.querySelector(".shape").textContent = "";
    content.querySelector(".shape").classList.remove("x", "circle");
    popUps.classList.add("hidden");
  });
}

// bot
function playInPosition(position) {
  const shape = contents[position].querySelector(".shape");
  shape.textContent = player2;
  shape.classList.add("show", "circle");
}
function botMove() {
  if (gameMode === "withMachine") {
    let posicao = bestMove(player2);
    if (posicao !== null) {
      playInPosition(posicao);
      if (checkWin(contents)) {
        popUps.classList.remove("hidden");
        popUpMessage.textContent = "A Máquina Ganhou!";
      }
      return;
    }
    posicao = bestMove(player1);
    if (posicao !== null) {
      playInPosition(posicao);
      currentTurn = player1;
      return;
    }
    playRandomly();
  }
}
function playRandomly() {
  let emptyContents = Array.from(contents).filter(
    (content) => content.querySelector(".shape").textContent === ""
  );
  if (emptyContents.length === 0) return;

  const randomContent =
    emptyContents[Math.floor(Math.random() * emptyContents.length)];
  const shape = randomContent.querySelector(".shape");
  shape.textContent = player2;
  shape.classList.add("show", "circle");
}
function bestMove(symbol) {
  for (let [a, b, c] of checkPatterns) {
    const cellA = contents[a].querySelector(".shape").textContent;
    const cellB = contents[b].querySelector(".shape").textContent;
    const cellC = contents[c].querySelector(".shape").textContent;

    if (cellA === symbol && cellB === symbol && cellC === "") {
      return c;
    } else if (cellA === symbol && cellB === "" && cellC === symbol) {
      return b;
    } else if (cellA === "" && cellB === symbol && cellC === symbol) {
      return a;
    }
  }
  return null;
}
