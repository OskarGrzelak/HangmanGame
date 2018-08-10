// elements

const triggerButton = document.querySelector('.trigger__btn');
const menu = document.querySelector('.menu');
const startButton = document.querySelector('.btn--menu');
const trigger = document.querySelector('.trigger');
const lettersDisplay = document.querySelector('.letters-display');
const roundsCounter = document.querySelector('#rounds-counter');
const chceckLetterButton = document.querySelector('.btn--letter');
const checkWordButton = document.querySelector('.btn--guess');
const message = document.querySelector('.message');
const checkedLetters = document.querySelector('.checked__letters');
const inputs = document.querySelectorAll('input');
const box = document.querySelector('.box');
const checked = document.querySelector('.checked');
const guessWord = document.querySelector('.guess-word');
const result = document.querySelector('.result');

// game

class Game {

    constructor() {
        this.checked = [];
        this.isPlayed = false;
    }

    setRoundsNumber(num) {
        this.roundsNumber = num;
    }

    setWordsLength(length) {
        this.wordsLength = length;
    }

    setHiddenWord(word) {
        this.hiddenWord = word.toUpperCase();
    }
};

// game view

const gameView = {
    getWordsLength() { return document.querySelector('#letters-number').value; },
    getRoundsNumber() { return document.querySelector('#rounds-number').value; },
    getLetter() { return document.querySelector('#guess-letter').value; },
    getWord() { return document.querySelector('#guess-word').value; },
    async getHiddenWord(q) {
        try {
            let mask = '';
            for(let i = 0; i < q; i++){
                mask += '?';
            };
            const res = await fetch(`https://cors-anywhere.herokuapp.com/https://api.datamuse.com/words?sp=${mask}`);
            const words = await res.json();
            const hiddenWord = words[Math.floor(Math.random()*100)].word;
            return hiddenWord;
        } catch(err) {
            console.log(err);
        };
    },
    clearLettersDisplay() { lettersDisplay.innerHTML = ''; },
    clearInputs() { inputs.forEach(el => el.value = ''); },
    clearMessage() {
        message.innerHTML = '';
        message.classList.remove('message--correct');
        message.classList.remove('message--incorrect');
    },
    clearCheckedLetters() {
        game.checked = [];
        checkedLetters.innerHTML = '';
    },
    displayHiddenWord(word) {
        const markup = `<div class="letters-display__letter">&nbsp;</div>`;
        for(let i = 0; i < word.length; i++) {
            lettersDisplay.insertAdjacentHTML('beforeend', markup);
        };
    },
    displayRoundsCounter(num) { roundsCounter.innerHTML = num; },
    displayLetter(letter, word) {
        const arr = Array.from(document.querySelector('.letters-display').children);
        arr.forEach((el, i) => {
            if (word[i] === letter) {
                el.innerHTML = letter;
            };
        });
    },
    displayCorrectWord(word) {
        const arr = Array.from(document.querySelector('.letters-display').children);
        arr.forEach((el, i) => el.innerHTML = word[i]);
    },
    displayMessage(state, str) {
        switch(state) {
            case 'correctLetter':
                message.innerHTML = `<p class="message__text">Hidden word contains letter: <span class="message__letter">${str}</span></p>`;
                message.classList.remove('message--incorrect');
                message.classList.add('message--correct');
                break;
            case 'incorrectLetter':
                message.innerHTML = `<p class="message__text">Hidden word does not contain letter: <span class="message__letter">${str}</span></p>`;
                message.classList.remove('message--correct');
                message.classList.add('message--incorrect');
                break;
            case 'checkedLetter':
                message.innerHTML = `<p class="message__text">You have already checked letter: <span class="message__letter">${str}</span></p>`;
                message.classList.remove('message--correct');
                message.classList.remove('message--incorrect');
                break;
            case 'correctWord':
                message.innerHTML = `<p class="message__text"><span class="message__letter">${str}</span> was the hidden word</p>`;
                message.classList.remove('message--incorrect');
                message.classList.add('message--correct');
                break;
            case 'incorrectWord':
                message.innerHTML = `<p class="message__text">Oh no! <span class="message__letter">${str}</span> was not the hidden word</p>`;
                message.classList.remove('message--correct');
                message.classList.add('message--incorrect');
                break;
            case 'wrongLength':
                message.innerHTML = `<p class="message__text"><span class="message__letter">${str}</span> has a different length than the hidden word</p>`;
                message.classList.remove('message--incorrect');
                message.classList.remove('message--correct');
                break;
        };
    },
    displayResult(str) {
        if (str === 'won') {
            result.innerHTML = `<p class="result__text result__text--green">Congrats, you won!</p>`;
            result.classList.add('show');
        } else if (str === 'lost') {
            result.innerHTML = `<p class="result__text result__text--red">Sorry, you lost!</p>`;
            result.classList.add('show');
        };
    },
    displayCheckedLetters(letter) {
        checkedLetters.innerHTML += `${letter} `;
    },
    showMenu() {
        menu.classList.remove('menu__hidden');
        trigger.style.marginBottom = '2rem';
        triggerButton.style.transform = 'rotate(0)';
    },
    hideMenu() {
        menu.classList.add('menu__hidden');
        trigger.style.marginBottom = '7rem';
        triggerButton.style.transform = 'rotate(180deg)';
    },
    showGameInterface() {
        box.classList.add('show');
        checked.classList.add('show');
        guessWord.classList.add('show');
    },
    hideGameInterface() {
        box.classList.remove('show');
        checked.classList.remove('show');
        guessWord.classList.remove('show');
    }
};

// control

// menu

triggerButton.addEventListener('click', () => !menu.classList.contains('menu__hidden') ? gameView.hideMenu() : gameView.showMenu());

// game

const game = new Game();

const initGame = async () => {

    // Setting game's parameters
    game.setRoundsNumber(gameView.getRoundsNumber());
    game.setWordsLength(gameView.getWordsLength());
    game.setHiddenWord(await gameView.getHiddenWord(game.wordsLength));
    game.isPlayed = true;

    // Preparing UI 
    
    // 1. clearing UI
    gameView.clearInputs();
    gameView.clearMessage();
    gameView.clearCheckedLetters();
    gameView.clearLettersDisplay();
    result.classList.remove('show');

    // 2. displaying new UI
    gameView.displayHiddenWord(game.hiddenWord);
    gameView.displayRoundsCounter(game.roundsNumber);
    gameView.showGameInterface();
};

const checkLetter = (letter) => {
    return game.hiddenWord.includes(letter);
};

const checkResult = () => {
    if(game.roundsNumber <= 0) {
        game.isPlayed = false;
        box.classList.remove('show');
        checked.classList.remove('show');
        guessWord.classList.remove('show');
        gameView.displayResult('lost');
        gameView.showMenu();
    };
};

startButton.addEventListener('click', e => {
    e.preventDefault();
    initGame();
    gameView.hideMenu();
});

chceckLetterButton.addEventListener('click', e => {
    e.preventDefault();
    let state = 'checkedLetter';
    const letter = gameView.getLetter().toUpperCase();
    if(letter !== '') {
        gameView.clearInputs();
        if(!game.checked.includes(letter)) {
            const isCorrect = checkLetter(letter);
            if(isCorrect) {
                gameView.displayLetter(letter, game.hiddenWord);
                state = 'correctLetter';
                const arr = Array.from(document.querySelector('.letters-display').children);
                let c = 0;
                arr.forEach(el => {
                    if (el.innerHTML !== '&nbsp;') {
                        c++;
                    };
                });
                if (c === arr.length) {
                    gameView.displayResult('won');
                    game.isPlayed = false;
                    gameView.hideGameInterface();
                    gameView.showMenu();
                }
            } else {
                game.roundsNumber -= 1;
                gameView.displayRoundsCounter(game.roundsNumber);
                state = 'incorrectLetter';
                checkResult();
            };
            gameView.displayCheckedLetters(letter);
            game.checked.push(letter);
        };
        gameView.displayMessage(state, letter);
    };
});

checkWordButton.addEventListener('click', e => {
    e.preventDefault();
    let state = 'wrongLength';
    const word = gameView.getWord().toUpperCase();
    if(word !=='') {
        gameView.clearInputs();
        if(word.length === game.hiddenWord.length) {
            if(word === game.hiddenWord) {
                gameView.displayCorrectWord(game.hiddenWord);
                game.isPlayed = false;
                gameView.hideGameInterface();
                gameView.showMenu();
                state = 'correctWord';
                gameView.displayResult('won');
            } else {
                game.roundsNumber -= 1;
                gameView.displayRoundsCounter(game.roundsNumber);
                state = 'incorrectWord';
                checkResult();
            };
        };
        gameView.displayMessage(state, word);
    };
});