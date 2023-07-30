/* 
    Cory Knapp - A00792990 
    COMP 2132
*/

class GameImage {

    constructor ( src, val ) {
        this.src = src;
        this.val = val;
    }

    html() {
        return `<img src="${this.src}" alt="${this.val}" class="game-image">`;
    }
}

class GameRules {

    static #defaultDifficulty = 5;

    static #gameImages = [];
    #answer = [];
    #difficulty = 0;

    constructor ( difficulty = GameRules.#defaultDifficulty ) {
        this.#difficulty = difficulty;

        this.#setupGameImages();
        this.setupNewGame();
        this.numOfGuesses = 0;
    }

    #setupGameImages () {

        let images = [];

        for ( let i = 0; i <= 9; i++ ) {
            images.push( new GameImage(`images/icons/0${i}.png`, i) );
        }

        GameRules.#gameImages = images;
    }

    setupNewGame( newDifficulty = GameRules.#defaultDifficulty ) {

        this.#difficulty = newDifficulty;
        this.#answer = [];
        this.numOfGuesses = 0;

        for ( let i = 0; i < this.#difficulty; i++ ) {
            this.#answer.push( GameRules.#gameImages[ Math.floor(Math.random() * GameRules.#gameImages.length ) ] );
        }

        // this is for debug cheating
        console.log(this.#answer);
    }

    getAnswerValues() {
        let retArr = [];
        for ( let i = 0; i < this.#answer.length; i++ ) {
            retArr.push(this.#answer[i].val);
        }
        return retArr;
    }

    getAnswer() {
        return this.#answer;
    }

    getGameImages() {
        return GameRules.#gameImages;
    }

    getDifficulty() {
        return this.#difficulty;
    }

    /* Returns a response as an array.
        0 : if the guess digit is not in the answer at all
       -1 : if the guess digit is in the answer but not in that spot
        1 : if the guess digit is in that spot
    */
    makeGuess( guess ) {

        this.numOfGuesses++;
        let response = [];
        let tempAnswer = Array.from(this.#answer);

        // look for perfect guesses
        for ( let i = 0; i < guess.length; i++ ) {

            // default response if asnwer isn't in puzzle
            response[i] = 0;

            // check if it's a perfect guess
            if (guess[i] === tempAnswer[i].val) {
                response[i] = 1;
            }
        }

        // remove perfect guesses from the answers
        for ( let i = response.length-1; i >= 0; i-- ) {
            if ( response[i] === 1 ) {
                tempAnswer.splice(i, 1);

            }
        }

        // checks non-perfect guesses against remaining answers
        // to see if they're still in there.
        for ( let g = 0; g < response.length; g++ ) {
            if ( response[g] === 0 ) {
                for ( let a = tempAnswer.length-1; a >= 0; a-- ) {
                    if ( guess[g] === tempAnswer[a].val ) {
                        response[g] = -1;
                        tempAnswer.splice(a, 1);
                        break;
                    }
                }
            }
        }

        return response;
    }
}