const PlayerFactory = (name, marker) => {
  const playerName = name;
  const playerMarker = marker;
  return { playerName, playerMarker };
};

const GameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  const buttonsNodeList = document.querySelectorAll(".play-button");
  const buttonsArr = Array.from(buttonsNodeList);
  const render = () => {
    buttonsArr.forEach((button, index) => {
      button.textContent = board[index];
    });
  };

  return {
    buttonsArr,
    board,
    render,
  };
})();

const Game = (() => {
  let playerIndex = 0;
  let GameOver = false;
  let players = [];

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

    for(let i = 0; i < winningCombination.length; i += 1){
      const [a, b, c] = winningCombination[i]
      if (
        GameBoard.board[a] === GameBoard.board[b] &&
        GameBoard.board[a] === GameBoard.board[c] &&
        GameBoard.board[a] !== ""
      ){
        return true;
      }
    };
    return false;
  };

  const changeIndex = () => {
    if (playerIndex === 0) {
      playerIndex += 1;
      return playerIndex;
    }
    playerIndex -= 1;
    return playerIndex;
  };

  const clickedButton = (e) => {
    if (e.target.textContent === "") {
      GameBoard.board[e.target.id] = players[playerIndex].playerMarker;
      GameBoard.render();
      changeIndex();
      if(checkWin()) {
        alert('game over')
      }
    }
  };

  const listenForClicks = () => {
    GameBoard.buttonsArr.forEach((button) => {
      button.addEventListener("click", clickedButton);
    });
  };

  const Start = () => {
    players = [
      PlayerFactory(document.querySelector("#player-one-input"), "X"),
      PlayerFactory(document.querySelector("#player-two-input"), "O"),
    ];
    listenForClicks();
    return players;
  };
  return { Start, checkWin, GameOver };
})();

const StartButton = document.querySelector("#start-button");
StartButton.addEventListener("click", () => {
  Game.Start();
});
