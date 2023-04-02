// Event listeners
document.addEventListener("DOMContentLoaded", function(){
    let buttons = document.getElementsByTagName("button");

    for (let button of buttons){
        button.addEventListener("click", function(){
            if (this.getAttribute("data-type") === "start"){
                displayBoard();
            } else if (this.getAttribute("data-type") === "reset"){
                generateBoard(); //*******
            } else if (this.getAttribute("data-type") === "rules"){
                displayRules();
            } else if (this.getAttribute("data-type") === "settings"){
                displaySettings();
            } else if (this.getAttribute("data-type") === "leaderboard"){
                displayLeaderboard();
            } else {
                // If button is not recognised, default action is displayHome
                displayHome();
            }
        })
    }

    document.getElementById('logo').addEventListener("click", displayHome);

    //Add event listeners for 'x' in modals
    let closes = document.getElementsByClassName('close');
    for (let close of closes){
        close.addEventListener('click', function(){
            //Close all modals
            let modals = document.getElementsByClassName('modal');
            for (let modal of modals){
                modal.style.display = 'none';
            }
        });
    }
    
    //Add event listeners to game tiles dynamically
    //Use mousedown, mouseup and a timer to see if user did a short or long click
    //Short click reveals tile
    //Long click flaggs or unflaggs tile
    let container = document.getElementById('game-board');
    let pressTime = null;
    let longPress = false;
    let eventTargetDown;
    let timerOn = false;
    let minesMarked = 0;
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
        }, 500);

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
    checkMines(0);

    timerTick = setInterval(function() {
        let timeElapsed = new Date().getTime() - startTime;
        var minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);
        timeView.innerHTML = `Time: ${minutes < 10 ? 0 : ""}${minutes}
            : ${seconds < 10 ? 0 : ""}${seconds}`;
        timeView.classList = `${timeElapsed}`;
    }, 1000);
}

function checkMines(minesMarked){
    let gridSize = document.getElementById('sel-grid-size').value;
    let minesCount = Math.floor((gridSize * gridSize) * document.getElementById('sel-mine-count').value / 100);
    document.getElementById('mines-left').innerHTML = `Mines remaining: ${minesCount - minesMarked}`;
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
    console.log('lose');
    clearInterval(timerTick);
}

function winGame(){
    console.log('win');
    clearInterval(timerTick);
}
