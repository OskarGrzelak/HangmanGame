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

const getWordsLength = () => document.querySelector('#letters-number').value;
const getRoundsNumber = () => document.querySelector('#rounds-number').value;
const getLetter = () => document.querySelector('#guess-letter').value;
const getWord = () => document.querySelector('#guess-word').value;
const getHiddenWord = async (q) => {
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
};

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
            message.innerHTML = `<p class="message__text"><span class="message__letter">${str}</span> was the hidden word</p>`;
            message.classList.remove('message--incorrect');
            message.classList.add('message--correct');
            result.innerHTML = `<p class="result__text result__text--green">Congrats, you won!</p>`;
            result.classList.add('show');
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
        case 'lost':
            result.innerHTML = `<p class="result__text result__text--red">Sorry, you lost!</p>`;
            result.classList.add('show');
            break;
    };
};

const displayCheckedLetters = letter => {
    checkedLetters.innerHTML += `${letter} `;
};

// control

const game = new Game();

const initGame = async () => {
    const roundsNumber = getRoundsNumber();
    const wordsLength = getWordsLength(); 

    clearInputs();
    clearMessage();
    clearCheckedLetters();

    game.setRoundsNumber(roundsNumber);
    game.setWordsLength(wordsLength);
    const hiddenWord = await getHiddenWord(wordsLength);
    game.setHiddenWord(hiddenWord);
    box.classList.add('show');
    checked.classList.add('show');
    guessWord.classList.add('show');
    result.classList.remove('show');
    clearLettersDisplay();
    displayHiddenWord(game.hiddenWord);
    displayRoundsCounter(game.roundsNumber);
    game.isPlayed = true;
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
        displayMessage('lost');
        menu.classList.remove('menu__hidden');
        trigger.style.marginBottom = '2rem';
        triggerButton.style.transform = 'rotate(0)';
    };
};

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
                checkResult();
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
                game.isPlayed = false;
                box.classList.remove('show');
                checked.classList.remove('show');
                guessWord.classList.remove('show');
                menu.classList.remove('menu__hidden');
                trigger.style.marginBottom = '2rem';
                triggerButton.style.transform = 'rotate(0)';
                state = 'correctWord';
            } else {
                game.roundsNumber -= 1;
                displayRoundsCounter(game.roundsNumber);
                state = 'incorrectWord';
                checkResult();
            };
        };
        displayMessage(state, word);
    };
});