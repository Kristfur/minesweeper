// Event listeners
document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.getElementsByTagName("button");

    // Add event listeners to all buttons
    for (let button of buttons) {
        //Folloed CI example to add event listeners to items with a loop
        button.addEventListener("click", function () {
            if (this.getAttribute("data-type") === "start") {
                playSound('click');
                minesMarked = 0;
                timerOn = false;
                clearInterval(timerTick);
                displayBoard();
            } else if (this.getAttribute("data-type") === "reset") {
                playSound('click');
                minesMarked = 0;
                timerOn = false;
                clearInterval(timerTick);
                document.getElementById('lose-modal').style.display = 'none';
                let modals = document.getElementsByClassName('modal');
                for (let modal of modals) {
                    modal.style.display = 'none';
                }
                generateBoard();
            } else if (this.getAttribute("data-type") === "rules") {
                playSound('click');
                displayRules();
            } else if (this.getAttribute("data-type") === "settings") {
                playSound('click');
                displaySettings();
            } else if (this.getAttribute("data-type") === "save") {
                playSound('click');
                checkInput();
            } else if (this.getAttribute("data-type") === "do-not-save") {
                playSound('click');
                doNotSave();
            } else if (this.getAttribute("data-type") === "leaderboard") {
                playSound('click');
                displayLeaderboard("");
            } else if (this.getAttribute("data-type") === "home") {
                playSound('click');
                displayHome();
            } else {
                // If button is not recognised, default action is displayHome
                playSound('click');
                displayHome();
            }
        });
    }
});

// Add event listener to logo
document.getElementById('logo').addEventListener("click", function () {
    playSound('click');
    minesMarked = 0;
    timerOn = false;
    clearInterval(timerTick);
    displayHome();
});

//Add event listeners for 'x' in modals
let closes = document.getElementsByClassName('close');
for (let close of closes) {
    close.addEventListener('click', function () {
        //Close all modals
        playSound('click');
        let modals = document.getElementsByClassName('modal');
        for (let modal of modals) {
            modal.style.display = 'none';
        }
    });
}

//Add event listener for selectors in leaderboard
document.getElementById('sel-grid-size-l').addEventListener("change", function () {
    populateLeaderboard("");
});
document.getElementById('sel-mine-count-l').addEventListener("change", function () {
    populateLeaderboard("");
});

let container = document.getElementById('game-board');
//Add event listeners to game tiles dynamically
//processClick uses event.target to get clicked element
container.addEventListener("mousedown", processClick);
container.addEventListener("mouseup", processClick);
//Touchscreen devices    
container.addEventListener("touchstart", processClick);
container.addEventListener("touchend", processClick);

//Keyboard
document.addEventListener("keydown", function (event) {
    event = event || window.event;
    keyPress(event);
});

let pressTime = null;
let longPress = false;
let eventTargetDown;
let timerOn = false;
let minesMarked = 0;
/**
 * Uses the given event to detirmine what happens on the game board
 * @param {*event} click event 
 */
function processClick(event) {
    if (event.type == 'touchstart' || event.type == 'touchend') {
        event.preventDefault();
    }
    //Use mousedown, mouseup and a timer to see if user did a short or long click
    //Short click reveals tile
    //Long click flaggs or unflaggs tile
    //*Flagged tiles cannot be revealed unless unflagged first*
    if (event.buttons >= 0) {
        loseFocus();
    }
    if (event.type == 'mousedown' || event.type == 'touchstart') {
        eventTargetDown = event.target;
        longPress = false;
        pressTime = null;

        if (event.thisIsLongClick) {
            if (event.target.classList.contains('hidden-tile')) {
                //If tile is hidden, then flag it
                playSound('flag');
                let classes = event.target.classList;
                let isFocused = event.thisIsFocused ? `id = 'focused'` : "";
                event.target.remove();
                document.getElementById('game-board').innerHTML += `<span ${isFocused}
                class="flagged-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                style="grid-column:${classes[2].slice(1)}; grid-row:${classes[3].slice(1)}; 
                background: url('./assets/images/flag.png') no-repeat center center;
                background-size: contain; background-color: #bbbbbb;"></span>`;
                minesMarked++;
            } else if (event.target.classList.contains('flagged-tile')) {
                //If tile is flagged, then unflag it
                playSound('flag');
                let classes = event.target.classList;
                let isFocused = event.thisIsFocused ? `id = 'focused'` : "";
                event.target.remove();
                document.getElementById('game-board').innerHTML += `<span ${isFocused}
                class="hidden-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                style="grid-column:${classes[2].slice(1)}; grid-row:${classes[3].slice(1)}";</span>`;
                minesMarked--;
            }
        } else {
            pressTime = setTimeout(function () {
                //Set timeout for long click    
                longPress = true;
                if (event.target.classList.contains('hidden-tile')) {
                    //If tile is hidden, then flag it
                    playSound('flag');
                    let classes = event.target.classList;
                    let isFocused = event.thisIsFocused ? `id = 'focused'` : "";
                    event.target.remove();
                    document.getElementById('game-board').innerHTML += `<span ${isFocused}
                    class="flagged-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                    style="grid-column:${classes[2].slice(1)}; grid-row:${classes[3].slice(1)}; 
                    background: url('./assets/images/flag.png') no-repeat center center;
                    background-size: contain; background-color: #bbbbbb;"></span>`;
                    minesMarked++;
                } else if (event.target.classList.contains('flagged-tile')) {
                    //If tile is flagged, then unflag it                    
                    playSound('flag');
                    let classes = event.target.classList;
                    let isFocused = event.thisIsFocused ? `id = 'focused'` : "";
                    event.target.remove();
                    document.getElementById('game-board').innerHTML += `<span ${isFocused}
                    class="hidden-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                    style="grid-column:${classes[2].slice(1)}; grid-row:${classes[3].slice(1)}";</span>`;
                    minesMarked--;
                }
            }, 350);
        }

        checkMines(minesMarked);
    } else if (event.type == 'mouseup' || event.type == 'touchend') {
        //On mouseup clear timeout for long click
        clearTimeout(pressTime);
        if (eventTargetDown === event.target) {
            //If long click did not happen yet, then do short click
            if (event.target.classList.contains('hidden-tile') && !longPress) {
                playSound('reveal');

                let classes = event.target.classList;
                let isFocused = event.thisIsFocused ? `id = 'focused'` : "";
                event.target.remove();
                document.getElementById('game-board').innerHTML += `<span ${isFocused}
                class="revealed-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                style="grid-column:${classes[2].slice(1)}; grid-row:${classes[3].slice(1)}; 
                background: url('./assets/images/number-${classes[1]}.png') no-repeat center center;
                background-size: contain;"></span>`;

                //If a mine(9) is revealed, then lose game
                if (classes[1] == 9) {
                    //If this is first click, reset board so first clikc is not a mine
                    if (!timerOn){ resetBoard(event.target);}
                    else {
                        loseGame();
                        timerOn = true;
                    }
                }

                //If a 0 tile was revealed, reveal all adjacent tiles
                if (classes[1] == 0) {
                    revealAdjacentEmptys(event.target);
                }
            }
        }
        longPress = false;

        if (!timerOn) {
            startTimer();
            timerOn = true;
        }
        //Check for win
        checkMines(minesMarked);
    }
}

/**
 * Recieves a (0) tile and reveals all surrounding tiles
 * @param {*tile}
 */
function revealAdjacentEmptys(tile) {
    //Loop through all 8 adjacent tiles
    for (let y = -1; y < 2; y++) {
        for (let x = -1; x < 2; x++) {
            if (x == y && x == 0) {
                continue;
            } else {
                //If tile exsists, reveal it
                let thisTile = document.getElementsByClassName(`x${parseInt(tile.classList[2].slice(1)) + x} y${parseInt(tile.classList[3].slice(1)) + y}`);
                if (thisTile[0] != null) {
                    let newClasses = thisTile[0].classList;
                    //Skip tile if it was already revealed
                    if (newClasses[0] !== 'hidden-tile') {
                        continue;
                    }
                    thisTile[0].remove();
                    document.getElementById('game-board').innerHTML += `<span
                    class="revealed-tile ${newClasses[1]} ${newClasses[2]} ${newClasses[3]}" 
                    style="grid-column:${newClasses[2].slice(1)}; grid-row:${newClasses[3].slice(1)}; 
                    background: url('./assets/images/number-${newClasses[1]}.png') no-repeat center center;
                    background-size: contain;"></span>`;

                    //If a 0 tile was revealed, reveal all adjacent tiles
                    if (newClasses[1] == 0) {
                        revealAdjacentEmptys(thisTile[0]);
                    }
                }
            }
        }
    }
}

/**
 * Reset game board and simulate click on the tile that replaced the tile given
 * @param {*tile} thisTile 
 */
function resetBoard(thisTile){
    //Generate new game board
    generateBoard();

    //Get the new tile that is in the same position as the tile clicked
    let tileClicked;
    let tiles = document.getElementById('game-board').children;
    for (let tile of tiles) {
        if (tile.classList.contains(thisTile.classList[2]) && tile.classList.contains(thisTile.classList[3])) {
            tileClicked = tile;
            break;
        }
    }

    //Simulate click on new tile
    let myObject = {
        type: 'mousedown',
        target: tileClicked
    };
    processClick(myObject);
    myObject = {
        type: 'mouseup',
        target: tileClicked
    };
    processClick(myObject);
}

/** Display home page and hide other pages */
function displayHome() {
    let pages = document.getElementsByClassName("page");

    document.getElementById('lose-modal').style.display = 'none';
    for (let page of pages) {
        page.style.display = 'none';
    }

    document.getElementById('home-page').style.display = 'block';
}

/** Display game page and hide other pages */
function displayBoard() {
    let pages = document.getElementsByClassName("page");

    preloadImage("../assets/images/flag.png");
    for (let i = 1; i < 10; i++) {
        preloadImage(`../assets/images/number-${i}.png`);
    }

    for (let page of pages) {
        page.style.display = 'none';
    }

    generateBoard();

    document.getElementById('game-page').style.display = 'block';
}

/** Display rules page and hide other pages */
function displayRules() {
    document.getElementById('rules-modal').style.display = 'block';
}

/** Display settings page and hide other pages */
function displaySettings() {
    document.getElementById('settings-modal').style.display = 'block';
}

/** Display leaderboard page and hide other pages
 * @param {*string} passes score to populateLeaderboard()
 */
function displayLeaderboard(currentScore) {
    let pages = document.getElementsByClassName("page");

    for (let page of pages) {
        page.style.display = 'none';
    }

    document.getElementById('sel-grid-size-l').value = document.getElementById('sel-grid-size').value;
    document.getElementById('sel-mine-count-l').value = document.getElementById('sel-mine-count').value;

    populateLeaderboard(currentScore);

    document.getElementById('leaderboard-page').style.display = 'block';
}

// Closes modal if useer clicks on the outside
window.onclick = function (event) {
    let modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target == modal && modal !== document.getElementById('lose-modal')) {
            modal.style.display = "none";
        }
    }
};

/**
 * Generates a new random board based on the game settings
 */
function generateBoard() {
    let gridSize = document.getElementById('sel-grid-size').value;
    let board = [];

    //Generate empty 2d array: 'board'
    for (let o = 0; o < gridSize; o++) {
        let boardRow = [];
        for (let i = 0; i < gridSize; i++) {
            boardRow[i] = 0;
        }
        board[o] = boardRow;
    }

    //Randomly populate board with a set number mines
    //   *Mines are represented by the number 9
    let totalMines = Math.floor((gridSize * gridSize) * document.getElementById('sel-mine-count').value / 100);
    let mineCount = 0;
    while (mineCount < totalMines) {
        let mineX = Math.floor(Math.random() * gridSize);
        let mineY = Math.floor(Math.random() * gridSize);

        if (board[mineY][mineX] == 0) {
            board[mineY][mineX] = 9;
            mineCount++;
        }
    }

    //Get numbers in the tiles representing the amount of adjacent mines
    board = getAdjacentMines(board);

    buildBoardTiles(board);
}

/**
 * Populate board with numbers representing the amount of 
 * adjacent mines (9) (diagonals included)
 * @param {*2d array } board 
 */
function getAdjacentMines(board) {
    let gridSize = board.length;

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            //Logic to only check valid adjacent tiles
            if (board[y][x] !== 9) {
                if (y == 0) {
                    if (x == 0) {
                        board[y][x] += neighboringTiles(board, y, x, 0, 1);
                        board[y][x] += neighboringTiles(board, y, x, 1, 0);
                        board[y][x] += neighboringTiles(board, y, x, 1, 1);
                    } else if (x == gridSize - 1) {
                        board[y][x] += neighboringTiles(board, y, x, 0, -1);
                        board[y][x] += neighboringTiles(board, y, x, 1, -1);
                        board[y][x] += neighboringTiles(board, y, x, 1, 0);
                    } else {
                        board[y][x] += neighboringTiles(board, y, x, 0, -1);
                        board[y][x] += neighboringTiles(board, y, x, 0, 1);
                        board[y][x] += neighboringTiles(board, y, x, 1, -1);
                        board[y][x] += neighboringTiles(board, y, x, 1, 0);
                        board[y][x] += neighboringTiles(board, y, x, 1, 1);
                    }
                } else if (y == gridSize - 1) {
                    if (x == 0) {
                        board[y][x] += neighboringTiles(board, y, x, -1, 0);
                        board[y][x] += neighboringTiles(board, y, x, -1, 1);
                        board[y][x] += neighboringTiles(board, y, x, 0, 1);
                    } else if (x == gridSize - 1) {
                        board[y][x] += neighboringTiles(board, y, x, -1, -1);
                        board[y][x] += neighboringTiles(board, y, x, -1, 0);
                        board[y][x] += neighboringTiles(board, y, x, 0, -1);
                    } else {
                        board[y][x] += neighboringTiles(board, y, x, -1, -1);
                        board[y][x] += neighboringTiles(board, y, x, -1, 0);
                        board[y][x] += neighboringTiles(board, y, x, -1, 1);
                        board[y][x] += neighboringTiles(board, y, x, 0, -1);
                        board[y][x] += neighboringTiles(board, y, x, 0, 1);
                    }
                } else {
                    if (x == 0) {
                        board[y][x] += neighboringTiles(board, y, x, -1, 0);
                        board[y][x] += neighboringTiles(board, y, x, -1, 1);
                        board[y][x] += neighboringTiles(board, y, x, 0, 1);
                        board[y][x] += neighboringTiles(board, y, x, 1, 0);
                        board[y][x] += neighboringTiles(board, y, x, 1, 1);
                    } else if (x == gridSize - 1) {
                        board[y][x] += neighboringTiles(board, y, x, -1, -1);
                        board[y][x] += neighboringTiles(board, y, x, -1, 0);
                        board[y][x] += neighboringTiles(board, y, x, 0, -1);
                        board[y][x] += neighboringTiles(board, y, x, 1, -1);
                        board[y][x] += neighboringTiles(board, y, x, 1, 0);
                    } else {
                        board[y][x] += neighboringTiles(board, y, x, -1, -1);
                        board[y][x] += neighboringTiles(board, y, x, -1, 0);
                        board[y][x] += neighboringTiles(board, y, x, -1, 1);
                        board[y][x] += neighboringTiles(board, y, x, 0, -1);
                        board[y][x] += neighboringTiles(board, y, x, 0, 1);
                        board[y][x] += neighboringTiles(board, y, x, 1, -1);
                        board[y][x] += neighboringTiles(board, y, x, 1, 0);
                        board[y][x] += neighboringTiles(board, y, x, 1, 1);
                    }
                }
            }
        }
    }

    return (board);
}

/**
 * Take the parameters of board[][], y and x position, and relative neighbor x and y position
 * Return 1 if the neighbor tile is a mine (9), otherwise return 0
 * @param {*2d array} board 
 * @param y position
 * @param x position
 * @param neighborY position relative to y
 * @param neighborX position relative to x
 */
function neighboringTiles(board, y, x, neighborY, neighborX) {
    if (board[y + neighborY][x + neighborX] == 9) {
        return 1;
    } else {
        return 0;
    }
}

/**
 * Builds the HTML for the game board using generated board
 * @param {*2d array} board 
 */
function buildBoardTiles(board) {
    let gameArea = document.getElementById('game-board');
    let gridSize = board.length;
    let tileLength = Math.floor(100 / gridSize);

    //Reset HTML elements before populating
    gameArea.style.gridTemplateColumns = "";
    gameArea.style.gridTemplateRows = "";
    gameArea.innerHTML = "";
    document.getElementById('mines-left').innerHTML = "Mines Left: 0";
    document.getElementById('timer').innerHTML = "Time: 00:00";

    for (let t = 0; t < gridSize; t++) {
        gameArea.style.gridTemplateColumns += `${tileLength}% `;
        gameArea.style.gridTemplateRows += `${tileLength}% `;
    }

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            //Tile classes:
            //hidden-tile    -> wether tile has been revealed or not
            //${board[x][y]} -> number of adjacent mines, or is a mine (9)
            //$x{x + 1}      -> x position in grid 
            //$y{y + 1}      -> y position in grid
            gameArea.innerHTML += `<span class="hidden-tile ${board[y][x]} x${y + 1} y${x + 1}" 
            style="grid-column:${y + 1}; grid-row:${x + 1};"></span>`;
        }
    }
}

let timerTick = null;
/** Timer for users score in game */
function startTimer() {

    let startTime = new Date().getTime();
    let timeView = document.getElementById('timer');
    timeView.classList = `${startTime}`;
    checkMines(0);

    timerTick = setInterval(function () {
        let timeElapsed = new Date().getTime() - startTime;
        var minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);
        timeView.innerHTML = `Time: ${minutes < 10 ? 0 : ""}${minutes}
            : ${seconds < 10 ? 0 : ""}${seconds}`;
    }, 1000);
}

/** 
 * Calculates how many mines are remaining based on the number of flags placed.
 * Calls winGame() if all remaining hidden tiles are mines
 */
function checkMines(minesMarked) {
    let gridSize = document.getElementById('sel-grid-size').value;
    let minesCount = Math.floor((gridSize * gridSize) * document.getElementById('sel-mine-count').value / 100);
    document.getElementById('mines-left').innerHTML = `Mines Left: ${minesCount - minesMarked}`;
    if (minesMarked == minesCount) {
        //Final check to see if all flags are on mines
        let flagged = document.getElementsByClassName('flagged-tile');
        let isMine = true;
        for (let f = 0; f < flagged.length; f++) {
            if (flagged[f].classList[1] !== '9') {
                isMine = false;
            }
        }

        if (isMine) {
            winGame();
        }
    } else if (document.getElementsByClassName('hidden-tile').length +
        document.getElementsByClassName('flagged-tile').length == minesCount) {
        //Check to see if all marked and unmarked tiles remaining are mines
        winGame();
    }
}

/** Ends current game and prompts user to play again */
function loseGame() {
    playSound('explosion');
    clearInterval(timerTick);

    document.getElementById('lose-modal').style.display = 'block';
}

/** Ends current game and displays users winning time */
function winGame() {
    playSound('win');
    let winTime = new Date().getTime() - document.getElementById('timer').classList[0];
    clearInterval(timerTick);

    let pages = document.getElementsByClassName("page");

    for (let page of pages) {
        page.style.display = 'none';
    }

    let minutes = Math.floor((winTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((winTime % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((winTime % 1000));
    document.getElementById('time').innerHTML = `Time: ${minutes < 10 ? 0 : ""}${minutes}
        : ${seconds < 10 ? 0 : ""}${seconds}
        . ${milliseconds < 100 ? 0 : ""}${milliseconds % 100 < 10 ? 0 : ""}${milliseconds}`;
    document.getElementById('time').classList = `${winTime}`;

    document.getElementById('win-page').style.display = 'block';
}

/** Checks if user input is valid */
function checkInput() {
    let input = document.getElementById('name').value;

    if (input == '') {
        alert('Name cannot be blank');
    } else if (input.length > 12) {
        alert('Name cannot be longer than 12 characters');
    } else if (input.indexOf(' ') >= 0) {
        alert('Name cannot have a space');
    } else {
        saveScore();
    }
}

/** Saves name and score to local storage if they made top 5 times */
function saveScore() {
    //Check if new score is a high score
    let newScoreM = parseInt(document.getElementById('time').classList[0]);
    let gridSize = document.getElementById('sel-grid-size').value;
    let totalMines = Math.floor((gridSize * gridSize) * document.getElementById('sel-mine-count').value / 100);

    let scores = [];
    for (let s = 0; s < 5; s++) {
        try {
            scores.push(localStorage.getItem(`best-score-${s}-${gridSize}-${totalMines}`).split(' '));
        } catch {
            scores.push(['...', Infinity]);
        }
    }

    for (let s = 0; s < scores.length; s++) {
        if (scores[s][1] == '...') {
            scores[s][1] = Infinity;
        }
        if (scores[s][1] >= newScoreM) {
            scores.splice(s, 0, [document.getElementById('name').value, newScoreM]);
            break;
        }
    }

    if (scores.length > 5) {
        scores.pop();
    }

    for (let s = 0; s < 5; s++) {
        if (scores[s][1] == Infinity) {
            scores[s][1] = '...';
        }

        localStorage.setItem(`best-score-${s}-${gridSize}-${totalMines}`, `${scores[s][0]} ${scores[s][1]}`);
    }

    displayLeaderboard(`${document.getElementById('name').value} ${newScoreM}`);
}

/** Warns user before exiting to home page */
function doNotSave() {
    if (confirm("Are you sure? Your time will NOT be saved.")) {
        displayHome();
    }
}

/** Gets data from local storage and populates leaderboard display 
 * @param {*string} score that was just set
 */
function populateLeaderboard(currentScore) {
    let leaderboardView = document.getElementById('leaderboard-content');
    let isOneOfBest = false;
    let score;
    let timeT;
    let gridSize = document.getElementById('sel-grid-size-l').value;
    let totalMines = Math.floor((gridSize * gridSize) * document.getElementById('sel-mine-count-l').value / 100);

    leaderboardView.innerHTML = `
        <span class="score-rank">Rank</span>
        <span class="score-name">Name</span>
        <span class="score-time">Time</span>`;

    for (let s = 0; s < 5; s++) {
        try {
            score = localStorage.getItem(`best-score-${s}-${gridSize}-${totalMines}`).split(' ');
            timeT = ['...'];

            if (score[1] !== '...') {
                let minutes = Math.floor((score[1] % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((score[1] % (1000 * 60)) / 1000);
                let milliseconds = Math.floor((score[1] % 1000));
                timeT = `${minutes < 10 ? 0 : ""}${minutes}
                : ${seconds < 10 ? 0 : ""}${seconds}
                . ${milliseconds < 100 ? 0 : ""}${milliseconds % 100 < 10 ? 0 : ""}${milliseconds}`;
            }
        } catch {
            score = ['...', '...'];
            timeT = ['...'];
        }

        if (score[1] == parseInt(currentScore.split(' ')[1])) {
            isOneOfBest = true;
            leaderboardView.innerHTML += `
                <span class="score-rank new-score">${s + 1}</span>
                <span class="score-name new-score">${score[0]}</span>
                <span class="score-time new-score">${timeT}</span>`;
        } else {
            leaderboardView.innerHTML += `
            <span class="score-rank">${s + 1}</span>
            <span class="score-name">${score[0]}</span>
            <span class="score-time">${timeT}</span>`;
        }
    }

    if (!isOneOfBest && currentScore !== "") {
        let minutes = Math.floor((currentScore.split(' ')[1] % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((currentScore.split(' ')[1] % (1000 * 60)) / 1000);
        let milliseconds = Math.floor((currentScore.split(' ')[1] % 1000));
        timeT = `${minutes < 10 ? 0 : ""}${minutes}
            : ${seconds < 10 ? 0 : ""}${seconds}
            . ${milliseconds < 100 ? 0 : ""}${milliseconds % 100 < 10 ? 0 : ""}${milliseconds}`;

        leaderboardView.innerHTML += `
        <span class="score-rank new-score"></span>
        <span class="score-name new-score">${currentScore.split(' ')[0]}</span>
        <span class="score-time new-score">${timeT}</span>`;
    }
}

// Sounds
function sound(src) {
    //Credit:
    //https://www.w3schools.com/graphics/game_sound.asp
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
    this.stop = function () {
        this.sound.pause();
    };
}

/** Plays sound if sound enabled
 * @param {*string} sound
 */
function playSound(desiredSound) {
    if (document.getElementById('sound').checked) {
        if (desiredSound == 'click') {
            new sound("assets/sounds/menu-click.mp3").play();
        } else if (desiredSound == 'reveal') {
            new sound("assets/sounds/tile-reveal.mp3").play();
        } else if (desiredSound == 'flag') {
            new sound("assets/sounds/flag-tile.mp3").play();
        } else if (desiredSound == 'explosion') {
            new sound("assets/sounds/explosion.mp3").play();
        } else if (desiredSound == 'win') {
            new sound("assets/sounds/win.mp3").play();
        }
    }
}

/** Preload images */
function preloadImage(im_url) {
    let img = new Image();
    img.src = im_url;
}

/** Keyboard support */
function keyPress(event) {
    //Only allows keyboard to be used when lose state is not true and game board is visible
    if (document.getElementById('lose-modal').style.display == 'none' &&
        document.getElementById('game-page').style.display !== 'none') {
        //Gets the current focused tile
        let focusedTile = document.getElementById('focused');
        if (focusedTile == null) {
            //If focus does not exsist, set top left tile to focus
            let tiles = document.getElementById('game-board').children;

            for (let tile of tiles) {
                if (tile.classList.contains('y1') && tile.classList.contains('x1')) {
                    focusedTile = tile;
                    tile.setAttribute('id', 'focused');
                    break;
                }
            }
        } else {
            //Use pressed key to move focus, reveal tile, and flag tile
            if (event.key.toString() === "w" || event.key.toString() === 'W') {
                //Move focus up
                moveFocus(0, -1);
            } else if (event.key.toString() === "s" || event.key.toString() === 'S') {
                //Move focus down
                moveFocus(0, 1);
            } else if (event.key.toString() === "a" || event.key.toString() === 'A') {
                //Move focuds left
                moveFocus(-1, 0);
            } else if (event.key.toString() === "d" || event.key.toString() === 'D') {
                //Move focus right
                moveFocus(1, 0);
            } else if (event.key.toString() === "q" || event.key.toString() === 'Q') {
                //Reveal tile
                //Create object to simulate click event to pass to processClick()
                let myObject = {
                    type: 'mousedown',
                    target: document.getElementById('focused'),
                    thisIsFocused: true
                };
                processClick(myObject);
                myObject = {
                    type: 'mouseup',
                    target: document.getElementById('focused'),
                    thisIsFocused: true
                };
                processClick(myObject);
            } else if (event.key.toString() === "e" || event.key.toString() === 'E') {
                //Flag/Unflag tile
                //Create object to simulate long click event to pass to processClick()
                let myObject = {
                    type: 'mousedown',
                    target: document.getElementById('focused'),
                    thisIsFocused: true,
                    thisIsLongClick: true
                };
                processClick(myObject);
            }
        }
    }

    //If rules or settings modal open, close them whe 'Escape' pressed
    if (event.key.toString() == 'Escape' 
    && (document.getElementById('rules-modal').style.display !== 'none' || 
        document.getElementById('settings-modal').style.display !== 'none')){
        console.log("hgew");
        //Close modals
        playSound('click');
        document.getElementById('rules-modal').style.display = 'none';
        document.getElementById('settings-modal').style.display = 'none';
    }
    console.log(event.key);
}

/** Uses given parameters to move the focus to neighboring tile if it exsists */
function moveFocus(moveX, moveY) {

    let focusPos = document.getElementById('focused').classList;

    let tiles = document.getElementById('game-board').children;
    for (let tile of tiles) {
        if (tile.classList.contains(`x${parseInt(focusPos[2][1]) + moveX}`) &&
            tile.classList.contains(`y${parseInt(focusPos[3][1]) + moveY}`)) {
            document.getElementById('focused').removeAttribute('id');
            tile.setAttribute('id', 'focused');
        }
    }
}

/** Removes focus from all tiles (For when user uses the mouse) */
function loseFocus() {
    try {
        document.getElementById('focused').removeAttribute('id');
    } catch {}
}