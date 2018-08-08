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

// menu

triggerButton.addEventListener('click', e => {
    if(!menu.classList.contains('menu__hidden')) {
        menu.classList.add('menu__hidden');
        trigger.style.marginBottom = '7rem';
        triggerButton.style.transform = 'rotate(180deg)';
    } else {
        menu.classList.remove('menu__hidden');
        trigger.style.marginBottom = '2rem';
        triggerButton.style.transform = 'rotate(0)';
    }
});

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

    setHiddenWord() {
        this.hiddenWord = 'javascript'.toUpperCase();
    }
};

// game view

const getWordsLength = () => document.querySelector('#letters-number').value;
const getRoundsNumber = () => document.querySelector('#rounds-number').value;
const getLetter = () => document.querySelector('#guess-letter').value;
const getWord = () => document.querySelector('#guess-word').value;

const clearLettersDisplay = () => lettersDisplay.innerHTML = '';
const clearInputs = () => inputs.forEach(el => el.value = '');
const clearMessage = () => {
    message.innerHTML = '';
    message.classList.remove('message--correct');
    message.classList.remove('message--incorrect');
}
const clearCheckedLetters = () => {
    game.checked = [];
    checkedLetters.innerHTML = '';
};

const displayHiddenWord = word => {
    const markup = `<div class="letters-display__letter">&nbsp;</div>`;
    for(let i = 0; i < word.length; i++) {
        lettersDisplay.insertAdjacentHTML('beforeend', markup);
    };
};

const displayRoundsCounter = num => {
    roundsCounter.innerHTML = num;
};

const displayLetter = letter => {
    const arr = Array.from(document.querySelector('.letters-display').children);
    arr.forEach((el, i) => {
        if (game.hiddenWord[i] === letter) {
            el.innerHTML = letter;
        };
    });
};

const displayCorrectWord = () => {
    const arr = Array.from(document.querySelector('.letters-display').children);
    arr.forEach((el, i) => el.innerHTML = game.hiddenWord[i]);
};

const displayMessage = (state, str) => {
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
            message.innerHTML = `<p class="message__text">You won! <span class="message__letter">${str}</span> was the hidden word</p>`;
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
};

const displayCheckedLetters = letter => {
    checkedLetters.innerHTML += `${letter} `;
};

// control

const game = new Game();

const initGame = () => {
    const roundsNumber = getRoundsNumber();
    const wordsLength = getWordsLength();

    clearInputs();
    clearMessage();
    clearCheckedLetters();

    game.setRoundsNumber(roundsNumber);
    game.setWordsLength(wordsLength);
    game.setHiddenWord();
    clearLettersDisplay();
    displayHiddenWord(game.hiddenWord);
    displayRoundsCounter(game.roundsNumber);
};

const checkLetter = (letter) => {
    return game.hiddenWord.includes(letter);
}

startButton.addEventListener('click', e => {
    e.preventDefault();
    initGame();
    menu.classList.add('menu__hidden');
    trigger.style.marginBottom = '7rem';
    triggerButton.style.transform = 'rotate(180deg)';
});

chceckLetterButton.addEventListener('click', e => {
    e.preventDefault();
    let state = 'checkedLetter';
    const letter = getLetter().toUpperCase();
    if(letter !== '') {
        clearInputs();
        if(!game.checked.includes(letter)) {
            const isCorrect = checkLetter(letter);
            if(isCorrect) {
                displayLetter(letter);
                state = 'correctLetter';
            } else {
                game.roundsNumber -= 1;
                displayRoundsCounter(game.roundsNumber);
                state = 'incorrectLetter';
            };
            displayCheckedLetters(letter);
            game.checked.push(letter);
        };
        displayMessage(state, letter);
    };
});

checkWordButton.addEventListener('click', e => {
    e.preventDefault();
    let state = 'wrongLength';
    const word = getWord().toUpperCase();
    if(word !=='') {
        clearInputs();
        if(word.length === game.hiddenWord.length) {
            if(word === game.hiddenWord) {
                displayCorrectWord();
                menu.classList.remove('menu__hidden');
                trigger.style.marginBottom = '2rem';
                triggerButton.style.transform = 'rotate(0)';
                state = 'correctWord';
            } else {
                game.roundsNumber -= 1;
                displayRoundsCounter(game.roundsNumber);
                state = 'incorrectWord';
            };
        };
        displayMessage(state, word);
    };
});