/* 
    Cory Knapp - A00792990 
    COMP 2132
*/

/* * * * * * * * *\
SETUP
\* * * * * * * * */

const $winPopup = $('#win-popup p');
const $winScreen = $('#win-screen')

const $previousGuesses = $('#previous-guesses');
const $currentGuess = $('#current-guess');

const $subm = $('#input-pannel #submit');
const $back = $('#input-pannel #backspace');
const $new  = $('#input-pannel #new-game');

const $again = $('#win-popup #play-again');
const $close = $('#win-popup #close-popup');

let gameRules = new GameRules();
let guess = [];
let won = false;

/* * * * * * * * *\
DISPLAY FUNCTIONS
\* * * * * * * * */

// submits a guess to the game and provides a formatted response
function formResponseToGuess() {
    
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

    if (winningResponse(response)) {
        displayWinPopup();
        won = true;
    }

    return `<tr>${rowGuts}</tr>`;
}

// enables or disables control panel buttons depending on context
function checkToggleButtons() {

    // if player has won, disable all inputs
    if (won) {

        diableInputButtons();
        disableSubmitButton();
        disableBackButton();
    
    // if they haven't won ...
    } else {
        // at an empty guess disable back and submit buttons and enable input buttons
        if ( guess.length === 0 ){
            disableBackButton();
            disableSubmitButton();
            if ($inputs.hasClass( "disabled-game-image" )) {
                enableInputButtons();
            }
        // at a "full" guess disable input buttons and enable submit button
        } else if ( guess.length === gameRules.getDifficulty()) {
            diableInputButtons();
            if ($subm.hasClass( "btn-disabled" )) {
                enableSubmitButton();
            }
        // at non-empty and non-full guess disable the submit button and
        // enable the back and input buttons
        } else {
            disableSubmitButton();
            if ($back.hasClass( "btn-disabled" )) {
                enableBackButton();
            }
            if ($inputs.hasClass( "disabled-game-image" )) {
                enableInputButtons();
            }
        }
    }
}

// updates the display of the current guess
function updateCurrentGuess() {

    let images = gameRules.getGameImages();
    let guessImages = [];

    // add guess images
    for ( let g = 0; g < guess.length; g++ ) {
        for ( let i = 0; i < images.length; i++ ) {
            if ( guess[g] === images[i].val ) {
                guessImages += `<td>${images[i].html()}</td>`;
            }
        }
    }

    // add in blank spaces for formatting purposes
    for ( let i = guess.length; i < gameRules.getDifficulty(); i++) {
        guessImages += `<td></td>`;
    }

    if (guess.length === 0) {
        guessImages = "<p>No current guess!</p>";
    }

    $currentGuess.html(`<div class="panel-label">Current Guess</div>
                        <table><tbody><tr>${guessImages}</tr></tbody></table>`);

    checkToggleButtons();
}

// returns true if the guess response is all correcct
function winningResponse( response ) {

    for( let i = 0; i < response.length; i++ ) {
        if ( response[i] !== 1 ) {
            return false;
        }
    }
    return true;
}

// just used to add a little quip to the win popup depending on the number of guesses
function getQuip( numberOfGuesses ) {
    switch (numberOfGuesses) {
        case 1:
            return "You got very lucky!";
        case 2:
        case 3:
            return "You did very good, maybe a bit lucky!";
        case 4:
        case 5:
            return "Good job, that's hard to beat!";
        case 6:
        case 7:
            return "Not bad, I think you could do better!";
        default:
            return "You'll do better on the next one!"
    }
}

// displays the win screen popup
function displayWinPopup() {

    guess = gameRules.numOfGuesses;

    if (guess === 1) {
        guess = "" + guess + " guess";
    } else {
        guess = "" + guess + " guesses";
    }

    $winPopup.html(`You got it in ${guess}! ${getQuip(gameRules.numOfGuesses)}`);
    $winScreen.toggle();
}

// hides the win screen popup
function hideWinPopup() {
    $winScreen.toggle();
}

/* * * * * * * * * * * * * * * * * * * * * * *\
ENABLE OR DISABLE BUTTONS ON THE INPUT PANEL
\* * * * * * * * * * * * * * * * * * * * * * */

function enableInputButtons() {
    $inputs = $( "#input-pannel img" );
    $inputs.click( inputButtonClick );
    $inputs.removeClass( "disabled-game-image" );
}

function diableInputButtons() {
    $inputs = $( "#input-pannel img" );
    $inputs.off( "click" );
    $inputs.addClass( "disabled-game-image" );
}

function enableSubmitButton() {
    $subm.click( submitGuess );
    $subm.removeClass( "btn-disabled" );
    $subm.addClass( "btn-enabled" );
}

function disableSubmitButton() {
    $subm.off( "click" );
    $subm.removeClass( "btn-enabled" );
    $subm.addClass( "btn-disabled" );
}

function enableBackButton() {
    $back.click( backSpaceGuess );
    $back.removeClass( "btn-disabled" );
    $back.addClass( "btn-enabled" );
}

function disableBackButton() {
    $back.off( "click" );
    $back.removeClass( "btn-enabled" );
    $back.addClass( "btn-disabled" );
}

function enableNewGameButton() {
    $new.click( newGame );
    $new.addClass( "btn-enabled" );
}

function enablePopupNewGameButton() {
    $again.click( hideWinPopup );
    $again.click( newGame );
    $again.addClass( "btn-enabled" );
}

function enablePopupCloseButton() {
    $close.click( hideWinPopup );
    $close.addClass( "btn-enabled" );
}

/* * * * * * * * *\
BUTTON FUNCTIONS
\* * * * * * * * */

// adds the clicked button value to the guesses
function inputButtonClick( e ) {
    guess.push(parseInt($(e.target).attr("alt")));
    updateCurrentGuess();
}

// submits the current guess
function submitGuess() {
    if (gameRules.numOfGuesses === 0) {
        $previousGuesses.html('<div class="panel-label">Previous Guesses</div>');
    }
    $previousGuesses.append(`<table>${formResponseToGuess()}</table>`);

    guess = [];
    updateCurrentGuess();
}

// removes the last symbol in the guess
function backSpaceGuess() {
    guess.pop();
    updateCurrentGuess();
}

// resets the whole game
function newGame() {
    guess = [];
    won = false;
    gameRules.setupNewGame();
    $previousGuesses.html('<div class="panel-label">Previous Guesses</div><p>No previous guesses!</p>');
    updateCurrentGuess();
}

/* * * * * * * * *\
START THE GAME
\* * * * * * * * */

enablePopupCloseButton();
enablePopupNewGameButton();
enableNewGameButton();
enableInputButtons();
disableSubmitButton();
disableBackButton();