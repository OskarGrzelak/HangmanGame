// elements

const triggerButton = document.querySelector('.trigger__btn');
const menu = document.querySelector('.menu');
const start = document.querySelector('.btn--menu');
const trigger = document.querySelector('.trigger');
const lettersDisplay = document.querySelector('.letters-display');
const roundsCounter = document.querySelector('#rounds-counter');

// menu

triggerButton.addEventListener('click', e => {
    if(!menu.classList.contains('menu__hidden')) {
        menu.classList.add('menu__hidden');
        trigger.style.marginBottom = '14rem';
        triggerButton.style.transform = 'rotate(180deg)';
    } else {
        menu.classList.remove('menu__hidden');
        trigger.style.marginBottom = '8rem';
        triggerButton.style.transform = 'rotate(0)';
    }
});

// game

class Game {

    setRoundsNumber(num) {
        this.roundsNumber = num;
    }

    setWordsLength(length) {
        this.wordsLength = length;
    }

    setHiddenWord() {
        this.hiddenWord = 'javascript';
    }
};

// game view

const getWordsLength = () => document.querySelector('#letters-number').value;
const getRoundsNumber = () => document.querySelector('#rounds-number').value;

const clearLettersDisplay = () => lettersDisplay.innerHTML = '';

const displayHiddenWord = word => {
    const markup = `<div class="letters-display__letter">&nbsp;</div>`;
    for(let i = 0; i < word.length; i++) {
        lettersDisplay.insertAdjacentHTML('beforeend', markup);
    };
};

const displayRoundsCounter = num => {
    roundsCounter.innerHTML = num;
};

// control

const game = new Game();

const initGame = () => {
    const roundsNumber = getRoundsNumber();
    const wordsLength = getWordsLength();

    game.setRoundsNumber(roundsNumber);
    game.setWordsLength(wordsLength);
    game.setHiddenWord();
    clearLettersDisplay();
    displayHiddenWord(game.hiddenWord);
    displayRoundsCounter(game.roundsNumber);
};

start.addEventListener('click', e => {
    e.preventDefault();
    initGame();
});