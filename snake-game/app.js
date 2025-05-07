'use strict';


//Define the HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
//game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval
let gameSpeedDelay = 200;
let gameStarted = false;



//draw game map, snake ,food
function draw() {
	board.innerHTML = '';
	drawSnake();
	drawFood();
	updateScore();
}

//draw snake
function drawSnake() {
	snake.forEach((segment) => {
		const snakeElement = createGameElement('div', 'snake');
		setPosition(snakeElement, segment)
		board.appendChild(snakeElement);
	});
}

//create a snake or food cube/div
function createGameElement(tag, className) {
	const element = document.createElement(tag);
	element.className = className;
	return element;
}

//set position for snake or food
function setPosition(element, position) {
	element.style.gridColumn = position.x;
	element.style.gridRow = position.y;
}

//test draw functoon
//draw();

//draw food element
function drawFood() {
	if(gameStarted){
		const foodElement = createGameElement('div', 'food')
		setPosition(foodElement, food);
		board.appendChild(foodElement);
	}
}
//generating food and add random location 
function generateFood() {
	const x = Math.floor(Math.random() * gridSize) + 1;
	const y = Math.floor(Math.random() * gridSize) + 1;
	return { x, y }
}

//moving  the snake
function move() {
	const head = { ...snake[0] };
	switch (direction) {
		case 'up':
			head.y--;
			break;

		case 'down':
			head.y++;
			break;

		case 'left':
			head.x--;
			break;

		case 'right':
			head.x++;
			break;
	}
	snake.unshift(head);


	//snake.pop();
	if (head.x === food.x && head.y === food.y) {
		food = generateFood();
		increaseSpeed();
		clearInterval(gameInterval);//clear past intervl
		gameInterval = setInterval(() => {
			move();
			checkCollision();
			draw();
		}, gameSpeedDelay);
	} else {
		snake.pop();
	}
}

//test moving
/* setInterval(() => {
	move();//move first
	draw();//then draw new position
}, 200); */

//startGameFunction

function startGame() {
	gameStarted = true;//keep track of a running game
	instructionText.style.display = 'none';
	logo.style.display = 'none';
	document.getElementById('start-button').style.display = 'none';
	gameInterval = setInterval(() => {
		move();
		checkCollision();
		draw()
	}, gameSpeedDelay)
}

//keypress lisitner event
function handleKeyPress(event) {
	if (
		(!gameStarted && event.code === 'Space') ||
		(!gameStarted && event.key === '')
	) {
		startGame();
	} else {
		switch (event.key) {
			case 'ArrowUp':
				direction = 'up'
				break;
			case 'ArrowDown':
				direction = 'down'
				break;
			case 'ArrowLeft':
				direction = 'left'
				break;
			case 'ArrowRight':
				direction = 'right'
				break;
		}
	}
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
	console.log(gameSpeedDelay)
	if (gameSpeedDelay > 150) {
		gameSpeedDelay -= 5;
	} else if (gameSpeedDelay > 100) {
		gameSpeedDelay -= 3;
	} else if (gameSpeedDelay > 50) {
		gameSpeedDelay -= 2;
	} else if (gameSpeedDelay > 25) {
		gameSpeedDelay -= 1;
	}
};


function checkCollision() {
	const head = snake[0]

	if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
		resetGame();
	}

	for (let i = 1; i < snake.length; i++) {
		if (head.x === snake[i].x && snake.y === snake[i].y) {
			resetGame();
		}
	}
}

function resetGame() {
	updateHighScore();
	stopGame();
	snake = [{ x: 10, y: 10 }];
	food = generateFood();
	direction = 'right';
	gameSpeedDelay = 200;
	updateScore();

	// Show start button again when game resets
	document.getElementById('start-button').style.display = 'block';
}

function updateScore() {
	const currentScore = snake.length - 1;
	score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
	clearInterval(gameInterval);
	gameStarted = false;
	instructionText.style.display = 'block';
	logo.style.display = 'block';
}

function updateHighScore() {
	const currentScore = snake.length - 1;
	if (currentScore > highScore) {
		highScore = currentScore;
		highScoreText.textContent=highScore.toString().padStart(3,'0');
	}
	highScoreText.style.display='block';
}

function setDirection(newDirection) {
	const oppositeDirections = {
		up: 'down',
		down: 'up',
		left: 'right',
		right: 'left'
	};
	// Prevent reversing direction
	if (oppositeDirections[newDirection] !== direction) {
		direction = newDirection;
	}
}

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
	touchStartX = e.changedTouches[0].screenX;
	touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
	const deltaX = e.changedTouches[0].screenX - touchStartX;
	const deltaY = e.changedTouches[0].screenY - touchStartY;

	if (Math.abs(deltaX) > Math.abs(deltaY)) {
		if (deltaX > 30) setDirection('right');
		else if (deltaX < -30) setDirection('left');
	} else {
		if (deltaY > 30) setDirection('down');
		else if (deltaY < -30) setDirection('up');
	}
});
