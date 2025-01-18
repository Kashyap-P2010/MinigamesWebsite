const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");
const wordDisplay = document.getElementById("wordDisplay");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const resetButton = document.getElementById("resetButton");
const hintButton1 = document.getElementById("hintButton1");
const hintButton2 = document.getElementById("hintButton2");

const words = ["banana", "apple", "grapes", "orange", "mango", "peach", "cherry"];
let selectedWord = "";
let guessedLetters = [];
let wrongGuesses = 0;
let hintsUsed = 0;
const maxGuesses = 6;

const initGame = () => {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongGuesses = 0;
    hintsUsed = 0;
    message.textContent = "";
    wordDisplay.textContent = "_ ".repeat(selectedWord.length).trim();
    drawHangman(0);
    initKeyboard();
    enableHintButtons();
};

const drawHangman = (step) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000";

    if (step > 0) {

        ctx.beginPath();
        ctx.moveTo(10, 240);
        ctx.lineTo(190, 240);
        ctx.stroke();
    }
    if (step > 1) {

        ctx.beginPath();
        ctx.moveTo(40, 240);
        ctx.lineTo(40, 20);
        ctx.stroke();
    }
    if (step > 2) {

        ctx.beginPath();
        ctx.moveTo(40, 20);
        ctx.lineTo(120, 20);
        ctx.stroke();
    }
    if (step > 3) {

        ctx.beginPath();
        ctx.moveTo(120, 20);
        ctx.lineTo(120, 50);
        ctx.stroke();
    }
    if (step > 4) {

        ctx.beginPath();
        ctx.arc(120, 70, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (step > 5) {

        ctx.beginPath();
        ctx.moveTo(120, 90);
        ctx.lineTo(120, 150);
        ctx.stroke();
    }
    if (step > 6) {

        ctx.beginPath();
        ctx.moveTo(120, 110);
        ctx.lineTo(90, 130);
        ctx.stroke();
    }
    if (step > 7) {

        ctx.beginPath();
        ctx.moveTo(120, 110);
        ctx.lineTo(150, 130);
        ctx.stroke();
    }
    if (step > 8) {

        ctx.beginPath();
        ctx.moveTo(120, 150);
        ctx.lineTo(90, 190);
        ctx.stroke();
    }
    if (step > 9) {

        ctx.beginPath();
        ctx.moveTo(120, 150);
        ctx.lineTo(150, 190);
        ctx.stroke();
    }
};

const initKeyboard = () => {
    keyboard.innerHTML = "";
    "abcdefghijklmnopqrstuvwxyz".split("").forEach((letter) => {
        const button = document.createElement("button");
        button.textContent = letter;
        button.classList.add("key");
        button.addEventListener("click", () => handleGuess(letter, button));
        keyboard.appendChild(button);
    });
};

const handleGuess = (letter, button) => {
    button.classList.add("disabled");

    if (selectedWord.includes(letter)) {
        guessedLetters.push(letter);
        updateWordDisplay();
        if (wordDisplay.textContent.replace(/\s+/g, "") === selectedWord) {
            message.textContent = "🎉 You Win!";
            keyboard.innerHTML = "";
        }
    } else {
        wrongGuesses++;
        drawHangman(wrongGuesses);
        if (wrongGuesses === maxGuesses) {
            message.textContent = `💀 Game Over! The word was "${selectedWord}".`;
            keyboard.innerHTML = "";
        }
    }
};

const updateWordDisplay = () => {
    const display = selectedWord
        .split("")
        .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
        .join(" ");
    wordDisplay.textContent = display;
};

const enableHintButtons = () => {
    hintButton1.disabled = false;
    hintButton2.disabled = false;
    hintButton1.addEventListener("click", revealHint);
    hintButton2.addEventListener("click", revealHint);
};

const revealHint = (event) => {
    if (hintsUsed < 2) {
        const availableLetters = selectedWord.split("").filter(
            (letter) => !guessedLetters.includes(letter)
        );
        const hintLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
        guessedLetters.push(hintLetter);
        updateWordDisplay();
        hintsUsed++;
        message.textContent = `Hint ${hintsUsed}: Revealed letter "${hintLetter}".`;
        event.target.disabled = true;
    } else {
        message.textContent = "You have used all hints!";
    }
};

resetButton.addEventListener("click", initGame);
/* check for doubleclick */
initGame();