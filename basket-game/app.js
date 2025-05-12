'use strict';

class Basket {
	constructor(element) {
		this.element = element;
		this.left = 250;
		this.updateScreen();
	}
	moveLeft() {
		if (this.left > 10) {
			this.left -= 20;
			this.updateScreen();
		}
	}
	moveRight() {
		if (this.left < 490) {
			this.left += 20;
			this.updateScreen();
		}
	}
	updateScreen() {
		this.element.style.left = this.left + 'px';
	}
}

class Present {
	constructor(gameArea, basket) {
		this.x = Math.floor(Math.random() * 560);
		this.y = 0;
		this.gameArea = gameArea;
		this.basket = basket;

		this.element = document.createElement('div');
		this.element.className = 'present';
		this.element.style.left = this.x + 'px';
		this.gameArea.appendChild(this.element);
	}

	fall() {
		this.y += 2;
		this.element.style.top = this.y + 'px';

		if (this.y > 600) {
			this.element.remove();
			return false;
		}

		const basketRect = this.basket.element.getBoundingClientRect();
		const presentRect = this.element.getBoundingClientRect();

		const isColliding = !(
			basketRect.top > presentRect.bottom ||
			basketRect.bottom < presentRect.top ||
			basketRect.left > presentRect.right ||
			basketRect.right < presentRect.left
		);

		if (isColliding) {
			this.element.remove();
			score++;
			scoreDisplay.textContent = "Score: " + score;
			return false;
		}

		return true;
	}
}

let myBasket = document.getElementById('basket');
let b = new Basket(myBasket);
let score = 0;
let scoreDisplay = document.getElementById('score');

let highScore = localStorage.getItem('highScore') || 0;
let highScoreDisplay = document.getElementById('highScore');
highScoreDisplay.textContent = "High Score: " + highScore;

document.addEventListener('keydown', (event) => {
	if (event.key === 'ArrowLeft') b.moveLeft();
	if (event.key === 'ArrowRight') b.moveRight();
});

document.getElementById('leftTouch')?.addEventListener('touchstart', () => b.moveLeft());
document.getElementById('rightTouch')?.addEventListener('touchstart', () => b.moveRight());

let gameArea = document.getElementById('gameArea');
let presents = [];

setInterval(() => {
	let p = new Present(gameArea, b);
	presents.push(p);
}, 1500);

setInterval(() => {
	presents = presents.filter((p) => p.fall());
}, 40);

//  Only update high score when the page is being closed or reloaded
window.addEventListener('beforeunload', () => {
	if (score > highScore) {
		localStorage.setItem('highScore', score);
	}
});

const resetButton = document.getElementById('resetHighScoreBtn');
resetButton.addEventListener('click', () => {
	localStorage.removeItem('highScore');
	highScore = 0;
	highScoreDisplay.textContent = "High Score: 0";
});
