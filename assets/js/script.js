// Event listeners
document.addEventListener("DOMContentLoaded", function(){
    let buttons = document.getElementsByTagName("button");

    for (let button of buttons){
        button.addEventListener("click", function(){
            if (this.getAttribute("data-type") === "start"){
                generateBoard();
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

function generateBoard(){
    let pages = document.getElementsByClassName("page");

    for (let page of pages){
        page.style.display = 'none';
    }

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