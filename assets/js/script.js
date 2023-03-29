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
            } else if (this.getAttribute("data-type") === "leaderboard"){
                displayLeaderboard();
            } else {
                // If button is not recognised, default action is displayHome
                displayHome();
            }
        })
    }

    document.getElementById('logo').addEventListener("click", displayHome);
    
    //Add event listeners to game tiles dynamically
    let container = document.getElementById('game-board');
    let pressTime = null;
    let longPress = false;
    let eventTargetDown;
    container.addEventListener("mousedown", function(event){
        eventTargetDown = event.target;
        longPress = false;
        pressTime = null;
        pressTime = setTimeout(function() {            
            longPress = true;
            pressTime = null;
        }, 500);        
    });
    //Use mousedown, mouseup and a timer to see if user did a short or long click
    //Short click reveals tile
    //Long click flaggs or unflaggs tile
    container.addEventListener("mouseup", function(event){
        pressTime = null;
        if (eventTargetDown === event.target){
            if(event.target.classList.contains('hidden-tile') && !longPress){
                let classes = event.target.classList;
                event.target.remove();
                this.innerHTML += `<button class="revealed-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                style="grid-column:${classes[2][1]}; grid-row:${classes[3][1]}; 
                background: url('../assets/images/number-${classes[1]}.png') no-repeat center center;
                background-size: contain;"></button>`;   
            } else if(event.target.classList.contains('hidden-tile') && longPress){
                let classes = event.target.classList;
                console.log("flag");
                event.target.remove();
                this.innerHTML += `<button class="flagged-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                style="grid-column:${classes[2][1]}; grid-row:${classes[3][1]}; 
                background: url('../assets/images/flag.png') no-repeat center center;
                background-size: contain; background-color: #bbbbbb;"></button>`;   
            } else if(event.target.classList.contains('flagged-tile') && longPress){
                let classes = event.target.classList;
                event.target.remove();
                this.innerHTML += `<button class="hidden-tile ${classes[1]} ${classes[2]} ${classes[3]}" 
                style="grid-column:${classes[2][1]}; grid-row:${classes[3][1]}";</button>`;   
            }
        }
        longPress = false;
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
    let gridSize = 5;   //******
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
    let totalMines = 8;   //******
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
            gameArea.innerHTML += `<button class="hidden-tile ${board[y][x]} y${y + 1} x${x + 1}" 
            style="grid-column:${y + 1}; grid-row:${x + 1};"></button>`
        }
    }
}
