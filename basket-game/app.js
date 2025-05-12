
//classes

class Basket {
	constructor(element) {
		this.element = element;
		this.left = 250;


	}
	moveLeft() {
		if (this.left > 10) {
			this.left -= 20
			this.updateScreen()
		}

	}


	moveRight() {
		if (this.left < 490) {
			this.left += 20;
			this.updateScreen();
		}
	}

	updateScreen() {
		//console.log(this.left)
		this.element.style.left = this.left + 'px'

	}
}


class Present {
	constructor(gameArea, basket) {
		this.x = Math.floor(Math.random() * 570);//put here random value between 0 and 570
		this.y = 0;
		this.gameArea = gameArea;
		this.basket = basket;

		//create present 
		this.element = document.createElement('div');
		//add style to the present element
		this.element.className = 'present';
		this.element.style.left = this.x + 'px';
		// display the present on screen 
		this.gameArea.appendChild(this.element);

	}

	fall() {
		this.y += 2;
		this.element.style.top = this.y + 'px';


		if (this.y > 600) {
			this.element.remove()
			return false
		}
		if (this.x > this.basket.left &&
			this.x <= this.basket.left + 100 &&
			this.y >= 580) {
			console.log(`you got a point`);
			this.element.remove();

			// Increase score and update display
			score++;
			scoreDisplay.textContent = "Score: " + score;

			
			return false

		}
		return true

	}
}


let myBasket = document.getElementById('basket')
let b = new Basket(myBasket)
let score = 0;
let scoreDisplay = document.getElementById('score');



document.addEventListener('keydown', (event) => {
	//	console.log(event)
	if (event.key === 'ArrowLeft') {
		b.moveLeft();
	}

	if (event.key === 'ArrowRight') {
		b.moveRight();
	}
});

let gameArea = document.getElementById('gameArea')

//check that the element appears at random location on top of screen 
//let x = new Present(gameArea, myBasket);

let presents = [];

setInterval(() => {
	let p = new Present(gameArea, b);
	presents.push(p);
}, 1500);
setInterval(() => {
	presents = presents.filter((p) => p.fall());
}, 40);







/* class Basket {
	constructor(element) {
		this.element = element;
		this.left = 250;
	}
	moveLeft() {
		this.left -= 20;
		this.updateScreen();
	}
	moveRight() {
		this.left += 20;
		this.updateScreen();
	}
	updateScreen() {
		this.element.style.left = this.left + "px";
	}
}
let myBasket = document.getElementById("basket");
let b = new Basket(myBasket);
document.addEventListener("keydown", (event) => {
	if (event.key === "ArrowLeft") {
		b.moveLeft();
	}
	if (event.key === "ArrowRight") {
		b.moveRight();
	}
}); */