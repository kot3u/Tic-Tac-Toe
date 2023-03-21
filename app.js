const MakePlayers = (name, marker, bot) => ({ name, marker, bot });

const GameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  const buttonsContainer = document.querySelector("#game-board");

  const setMarker = (index, marker) => {
    board[index] = marker;
  };

  const restart = () => {
    while (buttonsContainer.firstChild) {
      buttonsContainer.removeChild(buttonsContainer.firstChild);
    }
    board.forEach((element, index) => {
      setMarker(index, "");
    });
  };

  const renderBoard = () => {
    for (let i = 0; i <= 8; i += 1) {
      const button = document.createElement("div");
      button.classList.add("play-button");
      button.id = i;
      buttonsContainer.appendChild(button);
    }
  };

  return {
    board,
    setMarker,
    renderBoard,
    restart,
  };
})();

const display = (() => {
  const gameHeader = document.querySelector("#header");
  const addClass = (marker, e) => {
    if (marker === "X") {
      e.classList.add("cross");
    } else if (marker === "O") {
      e.classList.add("circle");
    }
  };
  const showWinner = (player) => {
    gameHeader.textContent = `The winner is: ${player.name}!`;
  };

  const showTie = () => {
    gameHeader.textContent = "Its a tie!";
  };

  const showPlayerNames = (players) => {
    gameHeader.textContent = `${players[0].name} vs ${players[1].name}`;
  };

  return { showPlayerNames, showTie, showWinner, addClass };
})();

const Game = (() => {
  let gameOver = 0;
  let playerIndex = 0;
  let players = [];

  const createPlayers = () => {
    const playerOneName = document.querySelector("#player-one-input").value;
    const playerTwoName = document.querySelector("#player-two-input").value;
    const playerOneIsBot = document.querySelector('#player-one-is-bot').checked;
    const playerTwoIsBot = document.querySelector('#player-two-is-bot').checked;
    players = [
      MakePlayers(playerOneName, "X", playerOneIsBot),
      MakePlayers(playerTwoName, "O", playerTwoIsBot),
    ];
    return players;
  };

  const changeIndex = () => {
    if (playerIndex === 0) {
      playerIndex += 1;
      return playerIndex;
    }
    playerIndex -= 1;
    return playerIndex;
  };

  const endGame = () => {
    const buttons = document.querySelectorAll(".play-button");
    const buttonsArr = Array.from(buttons);
    buttonsArr.forEach((element) => {
      element.removeEventListener("click", clickEvent);
    });
    gameOver = 1;
    return gameOver
  };

  const checkTie = () => {
    if (!GameBoard.board.includes("")) {
      endGame();
      display.showTie();
    }
  };

  const checkWin = () => {
    const winningCombination = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombination.length; i += 1) {
      const [a, b, c] = winningCombination[i];
      if (
        GameBoard.board[a] === GameBoard.board[b] &&
        GameBoard.board[a] === GameBoard.board[c] &&
        GameBoard.board[a] !== ""
      ) {
        display.showWinner(players[playerIndex]);
        endGame();
      }
    }
    checkTie();
  };

  const makeMove = (index) => {
    const buttons = document.querySelectorAll(".play-button");
    const buttonsArr = Array.from(buttons);
    if (
      !(
        (buttonsArr[index]).classList.contains("cross") ||
        (buttonsArr[index]).classList.contains("circle")
      )
    ) {
      GameBoard.setMarker(index, players[playerIndex].marker);
      display.addClass(players[playerIndex].marker, buttonsArr[index]);
      changeIndex();
      checkWin();
    }
  }

  const makeRandomDecision = () => {
    const randomDecision = Math.floor(Math.random() * 9)
      return randomDecision
  }

  const handleBot = () => {
    while((players[playerIndex]).bot && gameOver === 0){
      const randomDecision = makeRandomDecision()
      makeMove(randomDecision)
    }
  }

  const clickEvent = (e) => {
    if (
      !(
        e.target.classList.contains("cross") ||
        e.target.classList.contains("circle")
      )
    ) {
      GameBoard.setMarker(e.target.id, players[playerIndex].marker);
      display.addClass(players[playerIndex].marker, e.target);
      changeIndex();
      checkWin();
      handleBot();
    }
  };

  const listenForClicks = () => {
    const buttons = document.querySelectorAll(".play-button");
    const buttonsArr = Array.from(buttons);
    buttonsArr.forEach((element) => {
      element.addEventListener("click", clickEvent);
    });
  };

  const start = () => {
    GameBoard.renderBoard();
    createPlayers();
    display.showPlayerNames(players);
    listenForClicks();
    handleBot();
  };

  const restart = () => {
    playerIndex = 0;
    gameOver = 0;
    GameBoard.restart();
    start();
  };

  return {
    restart,
  };
})();

const StartButton = document.querySelector("#start-button");
StartButton.addEventListener("click", Game.restart);

