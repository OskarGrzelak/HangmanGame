// elements

const triggerButton = document.querySelector('.trigger__btn');
const valueButtons = document.querySelectorAll('.btn--input');
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
const loader = document.querySelector('.loader');

// game

class Game {

    constructor() {
        this.checked = [];
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
    getWordsLength() { return document.querySelector('#word-length-input').textContent; },
    getRoundsNumber() { return document.querySelector('#round-number-input').textContent; },
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
            let hiddenWord;
            do {
                hiddenWord = words[Math.floor(Math.random()*100)].word;
            } while(hiddenWord.includes('-') || hiddenWord.includes(' '));
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
            result.innerHTML = `
                <p class="result__text result__text--red">Sorry, you lost!</p>
                <p class="result__text result__text--small">The hidden word was</p>
                <p class="result__text result__text--small result__text--red">${game.hiddenWord}</p>
            `;
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
    },
    showLoader() { loader.classList.add('show'); },
    hideLoader() { loader.classList.remove('show'); }
};

// control

// menu

triggerButton.addEventListener('click', () => !menu.classList.contains('menu__hidden') ? gameView.hideMenu() : gameView.showMenu());
valueButtons.forEach(el => el.addEventListener('click', e => {
    if (e.target.classList.contains('plus')) {
        if (e.target.parentNode.children[1].textContent < 12) {
            e.target.parentNode.children[1].textContent++;
        };
    } else if (e.target.classList.contains('minus')) {
        if (e.target.parentNode.children[1].textContent > 3) {
            e.target.parentNode.children[1].textContent--;
        };
    };
}));

// game

const game = new Game();

const initGame = async () => {

    // Clearing UI
    gameView.clearMessage();
    gameView.clearCheckedLetters();
    gameView.clearLettersDisplay();
    result.classList.remove('show');
    gameView.showLoader();

    // Setting game's parameters
    game.setRoundsNumber(gameView.getRoundsNumber());
    game.setWordsLength(gameView.getWordsLength());
    game.setHiddenWord(await gameView.getHiddenWord(game.wordsLength));

    // Displaying new UI
    gameView.hideLoader();
    gameView.displayHiddenWord(game.hiddenWord);
    gameView.displayRoundsCounter(game.roundsNumber);
    gameView.showGameInterface();
};

const checkLetter = (letter) => {
    let state = 'checkedLetter';
    if(!game.checked.includes(letter)) {
        if (game.hiddenWord.includes(letter)) {
            gameView.displayLetter(letter, game.hiddenWord);
            state = 'correctLetter';
        } else {
            game.roundsNumber -= 1;
            gameView.displayRoundsCounter(game.roundsNumber);
            state = 'incorrectLetter';
        };
        gameView.displayCheckedLetters(letter);
        game.checked.push(letter);
    };
    return state;
};

const checkWord = (word) => {
    let state = 'wrongLength';
    if(word.length === game.hiddenWord.length) {
        if(word === game.hiddenWord) {
            gameView.displayCorrectWord(game.hiddenWord);
            state = 'correctWord';
        } else {
            game.roundsNumber -= 1;
            gameView.displayRoundsCounter(game.roundsNumber);
            state = 'incorrectWord';
        };
    };
    return state;
};

const checkIfEnd = () => {
    if(game.roundsNumber <= 0) {
        gameView.hideGameInterface();
        gameView.showMenu();
        return 'lost';
    };
    const arr = Array.from(document.querySelector('.letters-display').children);
    let c = 0;
    arr.forEach(el => {
        if (el.innerHTML !== '&nbsp;') {
            c++;
        };
    });
    if (c === arr.length) {
        gameView.hideGameInterface();
        gameView.showMenu();
        return 'won';
    };
};

startButton.addEventListener('click', e => {
    e.preventDefault();
    initGame();
    gameView.hideMenu();
});

chceckLetterButton.addEventListener('click', e => {
    e.preventDefault();

    // get input letter
    const letter = gameView.getLetter().toUpperCase();

    // check if input is a letter
    if(letter !== '') {

        // clear input
        gameView.clearInputs();

        // check letter
        const state = checkLetter(letter);

        // check if game ends
        const result = checkIfEnd();

        // display messages
        gameView.displayMessage(state, letter);
        gameView.displayResult(result);
    };
});

checkWordButton.addEventListener('click', e => {
    e.preventDefault();

    // get input word
    const word = gameView.getWord().toUpperCase();

    // chceck if input is a word
    if(word !=='') {

        // clear input
        gameView.clearInputs();

        // check word
        const state = checkWord(word);

        // check if game ends
        const result = checkIfEnd();
        
        //display messages
        gameView.displayMessage(state, word);
        gameView.displayResult(result);
    };
});

// check if user type letters in input fields

inputs.forEach(el => el.addEventListener('keydown', e => {
    if(!((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode === 8 || e.keyCode === 13)) {
        e.preventDefault();
    };
}));