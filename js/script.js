// elements

const triggerButton = document.querySelector('.trigger__btn');
const menu = document.querySelector('.menu');
const startButton = document.querySelector('.btn--menu');
const trigger = document.querySelector('.trigger');
const lettersDisplay = document.querySelector('.letters-display');
const roundsCounter = document.querySelector('#rounds-counter');
const chceckLetterButton = document.querySelector('.btn--letter');

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
        this.hiddenWord = 'javascript'.toUpperCase();
    }
};

// game view

const getWordsLength = () => document.querySelector('#letters-number').value;
const getRoundsNumber = () => document.querySelector('#rounds-number').value;
const getLetter = () => document.querySelector('#guess-letter').value;

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

const displayLetter = letter => {
    const arr = Array.from(document.querySelector('.letters-display').children);
    arr.forEach((el, i) => {
        if (game.hiddenWord[i] === letter) {
            el.innerHTML = letter;
        };
    });
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

const chceckLetter = (letter) => {
    return game.hiddenWord.includes(letter);
}

startButton.addEventListener('click', e => {
    e.preventDefault();
    initGame();
});

chceckLetterButton.addEventListener('click', e => {
    e.preventDefault();
    const letter = getLetter().toUpperCase();
    if(chceckLetter(letter)) {
        displayLetter(letter);
    }
});