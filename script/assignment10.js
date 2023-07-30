/* 
    Cory Knapp - A00792990 
    COMP 2132
*/

/* * * * * * * * *\
SETUP
\* * * * * * * * */

const $previousGuesses = $('#previous-guesses');
const $currentGuess = $('#current-guess');

let gameRules = new GameRules();
let guess = [];

/* * * * * * * * *\
DISPLAY FUNCTIONS
\* * * * * * * * */

// function formRowFromAnswer( selection ) {

//     let rowGuts = "";

//     selection.forEach( function ( s ) {
//         rowGuts += `<td>${s.html()}</td>`;
//     });

//     return `<tr>${rowGuts}</tr>`;
// }

function formRowFromGuess ( guess, gameRules ) {
    
    let images = gameRules.getGameImages();
    let rowGuts = "";
    let response = gameRules.makeGuess( guess );

    for ( let g = 0; g < guess.length; g++ ) {
        for ( let i = 0; i < images.length; i++ ) {
            if ( guess[g] === images[i].val ) {

                let tdClass;

                if (response[g] === 1) {
                    tdClass = "guess-exact"
                } else if (response[g] === -1 ) {
                    tdClass = "guess-close"
                } else {
                    tdClass = "guess-wrong"
                }

                rowGuts += `<td class="${tdClass}">${images[i].html()}</td>`;
                break;
            }
        }
    }

    return `<tr>${rowGuts}</tr>`;
}

/* * * * * * * * *\
INPUT PANEL
\* * * * * * * * */

const $inp0 = $('#input-pannel #0');
const $inp1 = $('#input-pannel #1');
const $inp2 = $('#input-pannel #2');
const $inp3 = $('#input-pannel #3');
const $inp4 = $('#input-pannel #4');
const $inp5 = $('#input-pannel #5');
const $inp6 = $('#input-pannel #6');
const $inp7 = $('#input-pannel #7');
const $inp8 = $('#input-pannel #8');
const $inp9 = $('#input-pannel #9');

const $subm = $('#input-pannel #submit');
const $back = $('#input-pannel #backspace');
const $new  = $('#input-pannel #new-game');

$inp0.click( inputButtonClick );
$inp1.click( inputButtonClick );
$inp2.click( inputButtonClick );
$inp3.click( inputButtonClick );
$inp4.click( inputButtonClick );
$inp5.click( inputButtonClick );
$inp6.click( inputButtonClick );
$inp7.click( inputButtonClick );
$inp8.click( inputButtonClick );
$inp9.click( inputButtonClick );

$subm.click( submitGuess );
$back.click( backSpaceGuess );
$new.click( newGame );

// adds the clicked button value to the guesses
function inputButtonClick( e ) {

    let difficulty = gameRules.getDifficulty();

    if (guess.length < difficulty) {
        guess.push(parseInt($(e.target).attr("alt")));
        updateCurrentGuess()
    }

}

// submits the current guess
function submitGuess() {

    if (guess.length === gameRules.getDifficulty()) {
        $previousGuesses.append(`<table>${formRowFromGuess(guess, gameRules)}</table>`);
        guess = [];
        updateCurrentGuess()
    }

}

// removed the last guess
function backSpaceGuess() {

    guess.pop();

    if (guess.length == 0) {
        $back.click(false);
    }

    updateCurrentGuess()
}

// resets the whole game
function newGame() {
    guess = [];
    gameRules.setupNewGame();
    $previousGuesses.html("");
    updateCurrentGuess()
}

// updates the display of the current guess
function updateCurrentGuess() {

    let images = gameRules.getGameImages();
    let guessImages = [];

    for ( let g = 0; g < guess.length; g++ ) {
        for ( let i = 0; i < images.length; i++ ) {
            if ( guess[g] === images[i].val ) {
                guessImages += `<td>${images[i].html()}</td>`;
            }
        }
    }

    $currentGuess.html(`<table><tr>${guessImages}</tr></table>`);
}

/* * * * * * * * *\
RUNNING TESTS
\* * * * * * * * */
