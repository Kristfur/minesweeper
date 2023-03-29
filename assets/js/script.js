// Event listeners
document.addEventListener("DOMContentLoaded", function(){
    let buttons = document.getElementsByTagName("button");

    for (let button of buttons){
        button.addEventListener("click", function(){
            if (this.getAttribute("data-type") === "start"){
                displayBoard();
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
})

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
    let totalMines = 4;   //******
    let mineCount = 0;
    while(mineCount < totalMines){
        let mineX = Math.floor(Math.random() * gridSize);
        let mineY = Math.floor(Math.random() * gridSize); 

        if(board[mineY][mineX] == 0){
            board[mineY][mineX] = 9;
            mineCount++;
        }
    }

    console.log(board);
    for (let i = 0; i < gridSize; i++){
        document.getElementById("game-board").innerHTML += `<p>${board[i]}</p>`;
    }
}