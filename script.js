const board = document.querySelector('.board');
const blockheight = 50;
const blockwidth = 50;
const startbtn = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startgamemodal = document.querySelector('.start-game');
const endgamemodal = document.querySelector('.end-game');
const restartButton = document.querySelector('.btn-restart');
const highscore = document.querySelector('#high-score');
const score = document.querySelector('#score');
const time = document.querySelector('#time');

let storedhighscore = localStorage.getItem('highscore');
if (storedhighscore === null) {
    highscore.innerText = `0`;
}
let highscorevalue = 0;
let scorevalue = 0;
let timevalue = `00:00`;



const rows = Math.floor(board.clientHeight / blockheight);
const cols = Math.floor(board.clientWidth / blockwidth);
let intervalid = null;
let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
}

const blocks = [];
let snake = [
    {
        x: 1, y: 3
    }]
let direction = "down";

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        // block.innerText = `${row}-${col}`;
        blocks[`${row}-${col}`] = block;
    }
}


function render() {
    let head = null
    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    }
    else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    }
    else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    }
    else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }
    //food consumption logic
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };
        snake.unshift(head);
        scorevalue += 10;
        score.innerText = `Score:${scorevalue}`;
        if (scorevalue > highscorevalue) {
            highscorevalue = scorevalue;
            highscore.innerText = `${highscorevalue}`;
            localStorage.setItem('highscore', highscorevalue.toString());
        }
        return;

    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalid);
        modal.style.display = "flex";
        startgamemodal.style.display = "none";
        endgamemodal.style.display = "flex";
        return;
    }
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })
    snake.pop();
    snake.unshift(head);

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill")
    })
    blocks[`${food.x}-${food.y}`].classList.add("food");
}


function restartGame() {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })
    scorevalue = 0;
    timevalue = `00-00`;
    score.innerText = `Score:${scorevalue}`;
    time.innerText = `Time:${timevalue}`;
    modal.style.display = "none";
    snake = [
        {
            x: 1, y: 3
        }]
    direction = "down";
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };
}

startbtn.addEventListener('click', () => {
    modal.style.display = "none";
    intervalid = setInterval(() => {
        render();
    }, 400);
    timeInterval = setInterval(() => {
        let [mins, secs] = timevalue.split(':').map(Number);

        if (secs === 59) {
            mins += 1;
            secs = 0;
        } else {
            secs += 1;
        }
        timevalue = `${mins}:${secs}`;
        time.innerText = `${timevalue}`;
    }, 1000);
})


restartButton.addEventListener('click', () => {
    restartGame();
    intervalid = setInterval(() => {
        render();
    }, 400);
})


addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp") {
        direction = "up";
    }
    else if (e.key === "ArrowDown") {
        direction = "down";
    }
    else if (e.key === "ArrowLeft") {
        direction = "left";
    }
    else if (e.key === "ArrowRight") {
        direction = "right";
    }
})