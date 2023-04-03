// Event listeners
document.addEventListener("DOMContentLoaded", function(){
    let container = document.getElementById('game-board');
    let pressTime = null;
    let longPress = false;
    let eventTargetDown;
    let timerOn = false;
    let minesMarked = 0;

    let buttons = document.getElementsByTagName("button");

    for (let button of buttons){
        button.addEventListener("click", function(){
            if (this.getAttribute("data-type") === "start"){
                menuClickSound();
                minesMarked = 0;
                timerOn = false;
                clearInterval(timerTick);
                displayBoard();
            } else if (this.getAttribute("data-type") === "reset"){  
                menuClickSound();             
                minesMarked = 0;
                timerOn = false;
                clearInterval(timerTick);
                generateBoard(); 
            } else if (this.getAttribute("data-type") === "rules"){
                menuClickSound();
                displayRules();
            } else if (this.getAttribute("data-type") === "settings"){
                menuClickSound();
                displaySettings();
            } else if (this.getAttribute("data-type") === "save"){
                menuClickSound();
                checkInput();
            } else if (this.getAttribute("data-type") === "do-not-save"){
                menuClickSound();
                doNotSave();
            } else if (this.getAttribute("data-type") === "leaderboard"){
                menuClickSound();
                displayLeaderboard();
            } else {
                // If button is not recognised, default action is displayHome
                menuClickSound();
                displayHome();
            }
        })
    }

    document.getElementById('logo').addEventListener("click", function(){
        menuClickSound();
        minesMarked = 0;
        timerOn = false;
        clearInterval(timerTick);
        displayHome();
    });

    //Add event listeners for 'x' in modals
    let closes = document.getElementsByClassName('close');
    for (let close of closes){
        close.addEventListener('click', function(){
            //Close all modals
            menuClickSound();
            let modals = document.getElementsByClassName('modal');
            for (let modal of modals){
                modal.style.display = 'none';
            }
        });
    }

    //Add event listener for selectors in leaderboard
    document.getElementById('sel-grid-size-l').addEventListener("change", function(){
        populateLeaderboard();
    });
    document.getElementById('sel-mine-count-l').addEventListener("change", function(){
        populateLeaderboard();
    });
    
    //Add event listeners to game tiles dynamically
    //Use mousedown, mouseup and a timer to see if user did a short or long click
    //Short click reveals tile
    //Long click flaggs or unflaggs tile
    container.addEventListener("mousedown", function(event){
        eventTargetDown = event.target;
        longPress = false;
        pressTime = null;
        pressTime = setTimeout(function() {    
            longPress = true;        
            if(event.target.classList.contains('hidden-tile')){
                let classes = event.target.classList;
                event.target.remove();
                document.getElementById('game-board').innerHTML += `<span class="flagged-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                style="grid-column:${classes[2].slice(1)}; grid-row:${classes[3].slice(1)}; 
                background: url('assets/images/flag.png') no-repeat center center;
                background-size: contain; background-color: #bbbbbb;"></span>`;  
                minesMarked++; 
            } else if(event.target.classList.contains('flagged-tile')){
                let classes = event.target.classList;
                event.target.remove();
                document.getElementById('game-board').innerHTML += `<span class="hidden-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                style="grid-column:${classes[2].slice(1)}; grid-row:${classes[3].slice(1)}";</span>`;   
                minesMarked--;
            }

            flagTileSound();
        }, 350);

        checkMines(minesMarked);
    });
    //Touchscreen devices
    container.addEventListener("touchstart", function(event){
        event.preventDefault();
        eventTargetDown = event.target;
        longPress = false;
        pressTime = null;
        pressTime = setTimeout(function() {            
            longPress = true;
            if(event.target.classList.contains('hidden-tile')){
                let classes = event.target.classList;
                event.target.remove();
                document.getElementById('game-board').innerHTML += `<span class="flagged-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                style="grid-column:${classes[2].slice(1)}; grid-row:${classes[3].slice(1)}; 
                background: url('assets/images/flag.png') no-repeat center center;
                background-size: contain; background-color: #bbbbbb;"></span>`;   
                minesMarked++;
            } else if(event.target.classList.contains('flagged-tile')){
                let classes = event.target.classList;
                event.target.remove();
                document.getElementById('game-board').innerHTML += `<span class="hidden-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                style="grid-column:${classes[2].slice(1)}; grid-row:${classes[3].slice(1)}";</span>`;   
                minesMarked--;
            }

            flagTileSound();
        }, 350);
        
        checkMines(minesMarked);
    });

    container.addEventListener("mouseup", function(event){
        clearTimeout(pressTime);
        if (eventTargetDown === event.target){
            if(event.target.classList.contains('hidden-tile') && !longPress){
                let classes = event.target.classList;
                event.target.remove();
                this.innerHTML += `<span class="revealed-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                style="grid-column:${classes[2].slice(1)}; grid-row:${classes[3].slice(1)}; 
                background: url('assets/images/number-${classes[1]}.png') no-repeat center center;
                background-size: contain;"></span>`;    
                
                tileRevealSound(); 

                if (classes[1] == 9){loseGame(); timerOn = true;} 
            }
        }
        longPress = false;



        if (!timerOn) {startTimer(); timerOn = true;}
        checkMines(minesMarked);
    });
    //Mobile devices
    container.addEventListener("touchend", function(event){
        clearTimeout(pressTime);
        if (eventTargetDown === event.target){
            if(event.target.classList.contains('hidden-tile') && !longPress){
                let classes = event.target.classList;
                event.target.remove();
                this.innerHTML += `<span class="revealed-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                style="grid-column:${classes[2].slice(1)}; grid-row:${classes[3].slice(1)}; 
                background: url('assets/images/number-${classes[1]}.png') no-repeat center center;
                background-size: contain;"></span>`;
                
                tileRevealSound();

                if (classes[1] == 9){loseGame(); timerOn = true;} 
            }
        }
        longPress = false;

        if (!timerOn) {startTimer(); timerOn = true;}
        checkMines(minesMarked);
    });
});

function displayHome(){
    let pages = document.getElementsByClassName("page");

    for (let page of pages){
        page.style.display = 'none';
    }

    document.getElementById('home-page').style.display = 'block';
}

function displayBoard(){
    let pages = document.getElementsByClassName("page");

    for (let page of pages){
        page.style.display = 'none';
    }

    generateBoard();

    document.getElementById('game-page').style.display = 'block';
}

function displayRules(){
    document.getElementById('rules-modal').style.display = 'block';
}

function displaySettings(){
    document.getElementById('settings-modal').style.display = 'block';
}

window.onclick = function(event){
    let modals = document.getElementsByClassName('modal');
    for (let modal of modals){
        if (event.target == modal) {
            modal.style.display = "none";
      }
    }
}

function displayLeaderboard(){
    let pages = document.getElementsByClassName("page");

    for (let page of pages){
        page.style.display = 'none';
    }

    document.getElementById('sel-grid-size-l').value = document.getElementById('sel-grid-size').value;
    document.getElementById('sel-mine-count-l').value = document.getElementById('sel-mine-count').value;

    console.log(document.getElementById('sel-mine-count').innerHTML);

    populateLeaderboard();

    document.getElementById('leaderboard-page').style.display = 'block';
}

/**
 * Generates a new random board based on the game settings
 */
function generateBoard(){
    let gridSize = document.getElementById('sel-grid-size').value;
    let board = []

    //Generate empty 2d array: 'board'
    for (let o = 0; o < gridSize; o++){
        let boardRow = []
        for (let i = 0; i < gridSize; i++){
            boardRow[i] = 0;
        }
        board[o] = boardRow;
    }

    //Randomly populate board with a set number mines
    //   *Mines are represented by the number 9
    let totalMines = Math.floor((gridSize * gridSize) * document.getElementById('sel-mine-count').value / 100);   
    let mineCount = 0;
    while(mineCount < totalMines){
        let mineX = Math.floor(Math.random() * gridSize);
        let mineY = Math.floor(Math.random() * gridSize); 

        if(board[mineY][mineX] == 0){
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
function getAdjacentMines(board){    
    let gridSize = board.length;

    for (let y = 0; y < gridSize; y++){
        for (let x = 0; x < gridSize; x++){
            //Logic to only check valid adjacent tiles
            if (board[y][x] !== 9){
                if (y == 0){
                    if (x == 0){
                        board[y][x] += right(board, y, x);
                        board[y][x] += bottom(board, y, x);
                        board[y][x] += bottomRight(board, y, x);
                    } else if (x == gridSize - 1){
                        board[y][x] += left(board, y, x);
                        board[y][x] += bottomLeft(board, y, x);
                        board[y][x] += bottom(board, y, x);
                    } else {
                        board[y][x] += left(board, y, x);                    
                        board[y][x] += right(board, y, x);
                        board[y][x] += bottomLeft(board, y, x);
                        board[y][x] += bottom(board, y, x);
                        board[y][x] += bottomRight(board, y, x);
                    }
                } else if (y == gridSize - 1){
                    if (x == 0){  
                        board[y][x] += above(board, y, x);
                        board[y][x] += aboveRight(board, y, x);
                        board[y][x] += right(board, y, x);
                    } else if (x == gridSize - 1){
                        board[y][x] += aboveLeft(board, y, x);
                        board[y][x] += above(board, y, x);                    
                        board[y][x] += left(board, y, x);
                    } else {
                        board[y][x] += aboveLeft(board, y, x);
                        board[y][x] += above(board, y, x);
                        board[y][x] += aboveRight(board, y, x);
                        board[y][x] += left(board, y, x);                    
                        board[y][x] += right(board, y, x);
                    }
                } else {
                    if (x == 0){
                        board[y][x] += above(board, y, x);
                        board[y][x] += aboveRight(board, y, x);
                        board[y][x] += right(board, y, x);                    
                        board[y][x] += bottom(board, y, x);
                        board[y][x] += bottomRight(board, y, x);
                    } else if (x == gridSize - 1){
                        board[y][x] += aboveLeft(board, y, x);
                        board[y][x] += above(board, y, x);
                        board[y][x] += left(board, y, x);
                        board[y][x] += bottomLeft(board, y, x);
                        board[y][x] += bottom(board, y, x);
                    } else {
                        board[y][x] += aboveLeft(board, y, x);
                        board[y][x] += above(board, y, x);
                        board[y][x] += aboveRight(board, y, x);
                        board[y][x] += left(board, y, x);
                        board[y][x] += right(board, y, x);
                        board[y][x] += bottomLeft(board, y, x);
                        board[y][x] += bottom(board, y, x);
                        board[y][x] += bottomRight(board, y, x);
                    }
                }
            }
        }
    }

    return(board);
}

//A collection of smaller functions with similar tasks
//They each take the parameters of board[][], y and x position
//and return 1 if the adjacent tile is a mine (9)
//otherwise they return 0
function aboveLeft(board, y, x){
    if(board[y - 1][x - 1] == 9){ return 1 }
    else { return 0 }
}
function above(board, y, x){
    if(board[y - 1][x] == 9){ return 1 }
    else { return 0 }
}
function aboveRight(board, y, x){
    if(board[y - 1][x + 1] == 9){ return 1 }
    else { return 0 }
}
function left(board, y, x){
    if(board[y][x - 1] == 9){ return 1 }
    else { return 0 }
}
function right(board, y, x){
    if(board[y][x + 1] == 9){ return 1 }
    else { return 0 }
}
function bottomLeft(board, y, x){
    if(board[y + 1][x - 1] == 9){ return 1 }
    else { return 0 }
}
function bottom(board, y, x){
    if(board[y + 1][x] == 9){ return 1 }
    else { return 0 }
}
function bottomRight(board, y, x){
    if(board[y + 1][x + 1] == 9){ return 1 }
    else { return 0 }
}

/**
 * Builds the HTML for the game board using generated board
 * @param {*2d array} board 
 */
function buildBoardTiles(board){
    let gameArea = document.getElementById('game-board');
    let gridSize = board.length;
    let tileLength = Math.floor(100/gridSize);

    //Reset HTML elements before populating
    gameArea.style.gridTemplateColumns = "";
    gameArea.style.gridTemplateRows = "";
    gameArea.innerHTML = "";
    document.getElementById('mines-left').innerHTML = "Mines Remaining: 0";
    document.getElementById('timer').innerHTML = "Time: 00:00";

    for (let t = 0; t < gridSize; t++){
        gameArea.style.gridTemplateColumns += `${tileLength}% `;
        gameArea.style.gridTemplateRows += `${tileLength}% `;
    }

    for (let y = 0; y < gridSize; y++){
        for (let x = 0; x < gridSize; x++){
            //Tile classes:
            //hidden-tile    -> wether tile has been revealed or not
            //${board[x][y]} -> number of adjacent mines, or is a mine (9)
            //$y{y + 1}      -> y position in grid
            //$x{x + 1}      -> x position in grid
            gameArea.innerHTML += `<span class="hidden-tile ${board[y][x]} y${y + 1} x${x + 1}" 
            style="grid-column:${y + 1}; grid-row:${x + 1};"></span>`
        }
    }
}

let timerTick = null;
function startTimer(){

    let startTime = new Date().getTime();
    let timeView = document.getElementById('timer');
    timeView.classList = `${startTime}`;
    checkMines(0);

    timerTick = setInterval(function() {
        let timeElapsed = new Date().getTime() - startTime;
        var minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);
        timeView.innerHTML = `Time: ${minutes < 10 ? 0 : ""}${minutes}
            : ${seconds < 10 ? 0 : ""}${seconds}`;
    }, 1000);
}

function checkMines(minesMarked){
    let gridSize = document.getElementById('sel-grid-size').value;
    let minesCount = Math.floor((gridSize * gridSize) * document.getElementById('sel-mine-count').value / 100);
    document.getElementById('mines-left').innerHTML = `Mines Remaining: ${minesCount - minesMarked}`;
    if (minesMarked == minesCount){
        //Final check to see if all flags are on mines
        let flagged = document.getElementsByClassName('flagged-tile');
        let isMine = true;
        for (let f = 0; f < flagged.length; f++){
            if(flagged[f].classList[1] !== '9'){isMine = false;} 
        }

        if (isMine){winGame();}
    } else if (document.getElementsByClassName('hidden-tile').length + 
        document.getElementsByClassName('flagged-tile').length == minesCount){
        //Check to see if all marked and unmarked tiles remaining are mines
        winGame();
    }
}

function loseGame(){
    explosionSound();

    console.log('lose');
    clearInterval(timerTick);
}

function winGame(){
    winSound();

    let winTime = new Date().getTime() - document.getElementById('timer').classList[0];
    clearInterval(timerTick);

    let pages = document.getElementsByClassName("page");

    for (let page of pages){
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

function checkInput(){
    let input = document.getElementById('name').value;

    if (input == ''){alert('Name cannot be blank');}
    else if (input.indexOf(' ') >= 0){alert('Name cannot have a space');}
    else {saveScore();}
}

function saveScore(){
    //Check if new score is a high score
    let newScoreM = parseInt(document.getElementById('time').classList[0]);
    let gridSize = document.getElementById('sel-grid-size').value;
    let totalMines = Math.floor((gridSize * gridSize) * document.getElementById('sel-mine-count').value / 100);  

    let scores = [];
    for (let s = 0; s < 10; s++) {
        try {
            scores.push(localStorage.getItem(`best-score-${s}-${gridSize}-${totalMines}`).split(' '));
        } catch{
            scores.push(['...', Infinity]);
        }
    }

    for (let s = 0; s < scores.length; s++) {
        if (scores[s][1] == '...'){scores[s][1] = Infinity;}
        if (scores[s][1] >= newScoreM){
            scores.splice(s, 0, [document.getElementById('name').value, newScoreM]);
            break;
        }
    }

    if (scores.length > 10) {scores.pop();}

    for (let s = 0; s < 10; s++) {
        if (scores[s][1] == Infinity){scores[s][1] = '...';}

        localStorage.setItem(`best-score-${s}-${gridSize}-${totalMines}`, `${scores[s][0]} ${scores[s][1]}`);
    }

    displayLeaderboard();
}

function doNotSave(){
    if (confirm("Are you sure? Your time will NOT be saved.")) {
        displayHome();
    }
}

function populateLeaderboard(){
    let leaderboardView = document.getElementById('leaderboard-content');
    let score;
    let timeT;
    let gridSize = document.getElementById('sel-grid-size-l').value;
    let totalMines = Math.floor((gridSize * gridSize) * document.getElementById('sel-mine-count-l').value / 100);  

    leaderboardView.innerHTML = `<span class="score-grid">${gridSize}</span>
        <span class="score-mineCount">${totalMines}</span>
        <span class="score-name">Name</span>
        <span class="score-time">Time</span>`;
    for (let s = 0; s < 10; s++) {
        try {
            score = localStorage.getItem(`best-score-${s}-${gridSize}-${totalMines}`).split(' ');
            console.log(score);
            timeT = ['...'];

            if (score[1] !== '...'){
                let minutes = Math.floor((score[1] % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((score[1] % (1000 * 60)) / 1000);
                let milliseconds = Math.floor((score[1] % 1000));
                timeT = `${minutes < 10 ? 0 : ""}${minutes}
                : ${seconds < 10 ? 0 : ""}${seconds}
                . ${milliseconds < 100 ? 0 : ""}${milliseconds % 100 < 10 ? 0 : ""}${milliseconds}`;
            }
        } catch {
            score = ['...','...'];
            timeT = ['...'];
        }

        leaderboardView.innerHTML += `<span class="score-name">${score[0]}</span>
            <span class="score-time">${timeT}</span>`;
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
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
} 

function menuClickSound(){
    if (document.getElementById('sound').checked){
        new sound("assets/sounds/menu-click.mp3").play();
    }
}

function tileRevealSound(){
    if (document.getElementById('sound').checked){
        new sound("assets/sounds/tile-reveal.mp3").play();
    }
}

function flagTileSound(){
    if (document.getElementById('sound').checked){
        new sound("assets/sounds/flag-tile.mp3").play();
    }
}

function explosionSound(){
    if (document.getElementById('sound').checked){
        new sound("assets/sounds/explosion.mp3").play();
    }
}

function winSound(){
    if (document.getElementById('sound').checked){
        new sound("assets/sounds/win.mp3").play();
    }
}