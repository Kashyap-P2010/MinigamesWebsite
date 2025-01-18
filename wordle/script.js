const gameBoard = document.getElementById("game-board");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");

const ROWS = 6;
const WORD_LENGTH = 5;
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

const generateDailyWord = () => {
    const words = ["apple", "grape", "peach", "mango", "berry"];
    const date = new Date();
    const index = date.getDate() % words.length; 
    return words[index];
};

const dailyWord = generateDailyWord();
console.log(`Today's word: ${dailyWord}`);

const initBoard = () => {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < WORD_LENGTH; c++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = `row-${r}-tile-${c}`;
            gameBoard.appendChild(tile);
        }
    }
};

const initKeyboard = () => {
    const keys = "qwertyuiopasdfghjklzxcvbnm".split("");
    keys.push("enter", "delete");

    keys.forEach((key) => {
        const button = document.createElement("button");
        button.textContent = key;
        button.classList.add("key");
        button.dataset.key = key;
        button.addEventListener("click", () => handleKeyClick(key));
        keyboard.appendChild(button);
    });
};

const handleKeyClick = (key) => {
    if (isGameOver) return;

    if (key === "enter") {
        checkRow();
    } else if (key === "delete") {
        deleteLetter();
    } else if (key.length === 1 && currentTile < WORD_LENGTH) {
        addLetter(key);
    }
};

const addLetter = (letter) => {
    const tile = document.getElementById(`row-${currentRow}-tile-${currentTile}`);
    tile.textContent = letter;
    tile.classList.add("filled");
    currentTile++;
};

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById(`row-${currentRow}-tile-${currentTile}`);
        tile.textContent = "";
        tile.classList.remove("filled");
    }
};

const checkRow = () => {
    if (currentTile < WORD_LENGTH) {
        showMessage("Not enough letters!");
        return;
    }

    const guess = Array.from(
        { length: WORD_LENGTH },
        (_, i) =>
            document.getElementById(`row-${currentRow}-tile-${i}`).textContent
    ).join("");

    if (guess === dailyWord) {
        showMessage("You guessed it!");
        revealTiles("correct");
        isGameOver = true;
        return;
    }

    if (currentRow === ROWS - 1) {
        showMessage(`Game Over! The word was "${dailyWord}".`);
        isGameOver = true;
        return;
    }

    evaluateGuess(guess);
    currentRow++;
    currentTile = 0;
};

const evaluateGuess = (guess) => {
    const wordArray = dailyWord.split("");
    const guessArray = guess.split("");

    guessArray.forEach((letter, index) => {
        const tile = document.getElementById(`row-${currentRow}-tile-${index}`);
        if (letter === wordArray[index]) {
            tile.classList.add("correct");
        } else if (wordArray.includes(letter)) {
            tile.classList.add("present");
        } else {
            tile.classList.add("absent");
        }
    });
};

const showMessage = (msg) => {
    message.textContent = msg;
};

initBoard();
initKeyboard();