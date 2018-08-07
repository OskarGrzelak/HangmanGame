// elements

const triggerButton = document.querySelector('.trigger__btn');
const menu = document.querySelector('.menu');
const startButton = document.querySelector('.btn--menu');
const trigger = document.querySelector('.trigger');
const lettersDisplay = document.querySelector('.letters-display');
const roundsCounter = document.querySelector('#rounds-counter');
const chceckLetterButton = document.querySelector('.btn--letter');
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

const displayMessage = (state, letter) => {
    if(state === 1) {
        message.innerHTML = `<p class="message__text">Hidden word contains letter: <span class="message__letter">${letter}</span></p>`;
        message.classList.remove('message--incorrect');
        message.classList.add('message--correct');
    } else if (state === -1) {
        message.innerHTML = `<p class="message__text">Hidden word does not contain letter: <span class="message__letter">${letter}</span></p>`;
        message.classList.remove('message--correct');
        message.classList.add('message--incorrect');
    } else {
        message.innerHTML = `<p class="message__text">You have already checked letter: <span class="message__letter">${letter}</span></p>`;
        message.classList.remove('message--correct');
        message.classList.remove('message--incorrect');
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
    let state = 0;
    const letter = getLetter().toUpperCase();
    if(letter !== '') {
        clearInputs();
        if(!game.checked.includes(letter)) {
            const isCorrect = checkLetter(letter);
            if(isCorrect) {
                displayLetter(letter);
                state = 1;
            } else {
                game.roundsNumber -= 1;
                displayRoundsCounter(game.roundsNumber);
                state = -1;
            };
            displayCheckedLetters(letter);
            game.checked.push(letter);
        };
        displayMessage(state, letter);
    };
});