const Game = (function() {
  let board = Array(9).fill('');

  let turn = true;

  const changeTurn = () => {
    turn = !turn;
  };

  const restart = () => {
    turn = true;
  };

  const players = { x: 'X', o: 'O' };

  const mark = (index) => {
    let sign = turn ? players.x : players.o;
    
    if (board[index] === '') {
      board[index] = sign;
      changeTurn();
    }
  };

  const winningPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 4, 8], [6, 4, 2],
    [0, 3, 6], [1, 4, 7], [2, 5, 8]
  ];

  const checkWinner = () => {
    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
        return [board[a], pattern];
      }
    }
    return '';
  };

  return {
    board,
    players,
    mark,
    checkWinner,
    restart,
  };

})();

const board = document.querySelector('.board');
const squares = Array.from(board.querySelectorAll('.square'));
const overlay = document.querySelector('.overlay');
const restartBtn = document.querySelector('.restart-btn');

const xNum = document.querySelector('.x-num');
const oNum = document.querySelector('.o-num');

let xScore = 0;
let oScore = 0;

const hideOverlay = (state) => {
  overlay.style.display = state;
};

const addSign = (index) => {
  Game.mark(index);
};

squares.forEach((square, index) => {
  square.addEventListener('click', () => {
    addSign(index);

    if (!square.firstChild) {
      const pElem = document.createElement('p');
      pElem.textContent = Game.board[index];
      square.appendChild(pElem);
    }

    const [winner, pattern] = Game.checkWinner();

    if (winner) {
      pattern.forEach((idx) => {
        squares[idx].style.backgroundColor = '#21262d';
      });
      hideOverlay('block');
      winner === 'X' ? xScore++ : oScore++;
      update();
    } else if(Game.board.every((cell) => cell !== '')) {
      hideOverlay('block');
      squares.forEach(target => {
        target.style.backgroundColor = '#21262d';
      })
    }
  });
});

const update = () => {
  xNum.textContent = xScore;
  oNum.textContent = oScore;
};

restartBtn.addEventListener('click', () => {
  squares.forEach((square) => {
    while (square.firstChild) {
      square.removeChild(square.firstChild);
    }
  });
  Game.board.fill('');
  squares.forEach((square) => {
    square.style.backgroundColor = '';
  });
  hideOverlay('none');
  Game.restart();
});