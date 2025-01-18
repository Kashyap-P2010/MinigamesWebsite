const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const difficultySelect = document.getElementById('difficulty');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let difficulty = 'easy';

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

difficultySelect.addEventListener('change', () => {
    difficulty = difficultySelect.value;
});

const handleCellClick = (e) => {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (board[cellIndex] !== '' || !gameActive) return;

    board[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');

    if (checkWin(currentPlayer)) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
    } else if (board.includes('') === false) {
        statusText.textContent = 'Draw!';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'O') botMove();
    }
};

const botMove = () => {
    setTimeout(() => {
        let move;

        switch (difficulty) {
            case 'easy':
                move = easyMove();
                break;
            case 'medium':
                move = mediumMove();
                break;
            case 'hard':
                move = hardMove();
                break;
            case 'impossible':
                move = impossibleMove();
                break;
        }

        board[move] = 'O';
        cells[move].textContent = 'O';
        cells[move].classList.add('taken');

        if (checkWin('O')) {
            statusText.textContent = 'Bot wins!';
            gameActive = false;
        } else if (board.includes('') === false) {
            statusText.textContent = 'Draw!';
            gameActive = false;
        } else {
            currentPlayer = 'X';
        }
    }, 500);
};

const easyMove = () => {
    const emptyCells = board.map((val, index) => (val === '' ? index : null)).filter((val) => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const mediumMove = () => {
    const blockingMove = findBlockingMove('X');
    if (blockingMove !== -1) return blockingMove;

    const winningMove = findWinningMove('O');
    if (winningMove !== -1) return winningMove;

    return easyMove(); 
};

const hardMove = () => {
    const blockingMove = findBlockingMove('X');
    if (blockingMove !== -1) return blockingMove;

    const winningMove = findWinningMove('O');
    if (winningMove !== -1) return winningMove;

    return easyMove(); 
};

const impossibleMove = () => {
    return minimax(board, 'O', 0).index;
};

const minimax = (board, player, depth) => {
    const emptyCells = board.map((val, index) => (val === '' ? index : null)).filter((val) => val !== null);

    if (checkWin('O')) return { score: 10 - depth };
    if (checkWin('X')) return { score: depth - 10 };
    if (emptyCells.length === 0) return { score: 0 };

    const moves = [];
    for (let i = 0; i < emptyCells.length; i++) {
        const move = {};
        move.index = emptyCells[i];
        board[emptyCells[i]] = player;

        if (player === 'O') {
            move.score = minimax(board, 'X', depth + 1).score;
        } else {
            move.score = minimax(board, 'O', depth + 1).score;
        }

        board[emptyCells[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        moves.forEach((move) => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach((move) => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }

    return bestMove;
};

const findBlockingMove = (player) => {
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = player;
            if (checkWin(player)) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }
    return -1;
};

const findWinningMove = (player) => {
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = player;
            if (checkWin(player)) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }
    return -1;
};

const checkWin = (player) => {
    return winConditions.some((condition) => {
        return condition.every((index) => board[index] === player);
    });
};

const resetGame = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach((cell) => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
    statusText.textContent = '';
};

cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);