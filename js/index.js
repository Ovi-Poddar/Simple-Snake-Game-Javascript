// Game Constants & Variables
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');

let speed = 5.00;
let score = 0;
let lastPaintTime = 0;

let snakeArr = [
    {x: 13, y: 15}
];
let food = {x: 6, y: 7};
let inputDir = {x: 0, y: 0}; 

function initializeGame(){
    snakeArr = [
        {x: 13, y: 15}
    ];
    food = {x: 6, y: 7};
    inputDir = {x: 0, y: 0}; 
}


//Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    // check how many second have passed since the last paint. If less, then return
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}


// show and update score
function showScores(){
    scoreBox.innerHTML = "Score: " + score;
    hiscoreBox.innerHTML = "High Score: " + hiscoreval;
}


function isCollide(snake) {
    // If snake bumps into itself
    for (let i = 1; i < snakeArr.length; i++) {
         if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
              return true;
         }
    }

    // If snake bumps into the wall
    if(snake[0].x >= 18 || snake[0].x <=0 || snake[0].y >= 18 || snake[0].y <=0){
        return true;
    }

    return false;
}


function gameEngine(){
    // Part 1: Updating the snake array & Food
    if(isCollide(snakeArr)){ 
        gameOverSound.play();
        musicSound.pause();
        inputDir =  {x: 0, y: 0}; 
        alert("Game Over. Press any key to play again!");
        snakeArr = [{x: 13, y: 15}];
        musicSound.play();
        score = 0; 
    }

    // If snake has eaten the food, increment the score and regenerate the food
    let snakeHead = snakeArr[0];
    if(snakeHead.x === food.x && snakeHead.y === food.y){
        foodSound.play();
        snakeArr.unshift({x: snakeHead.x + inputDir.x, y: snakeHead.y + inputDir.y});
        let a = 2, b = 16;
        food = {x: Math.round(a + (b-a)*Math.random()), y: Math.round(a + (b-a)*Math.random())};
        
        speed += 0.01; // increase speed
        score += 1; // increase score

        //update score
        if(score>hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
        }
    }

    // Moving the Snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i+1] = {...snakeArr[i]};
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((element, index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = element.y;
        snakeElement.style.gridColumnStart = element.x;

        if(index === 0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    // Display the score
    showScores();
}


// Main logic starts here
musicSound.play();
let value = localStorage.getItem("hiscore");
if(value === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(value);
    hiscoreBox.innerHTML = "High Score: " + hiscoreval;
}


window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    inputDir = {x: 0, y: 1} // Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;

        default:
            break;
    }

});