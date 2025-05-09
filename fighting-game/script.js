'use strict';
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const enemyHealth = document.querySelector('#enemy-health');
const playerHealth = document.querySelector('#player-health');
const gameTimer = document.querySelector('.timer')
const gameScoreText = document.querySelector('.gameScoreText')





canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './images/background.png'
})

const shop = new Sprite({
	position: {
		x: 630,
		y: 133.5
	},
	imageSrc: './images/shop.png',
	scale: 2.75,
	framesMax: 6
})



const player = new Fighter({
	position: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 10
	},
	offset: {
		x: 0,
		y: 0
	},
	imageSrc: './images/samuraiMack/Idle.png',
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: 215,
		y: 157
	},
	sprites: {
		idle: {
			imageSrc: './images/samuraiMack/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './images/samuraiMack/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './images/samuraiMack/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './images/samuraiMack/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './images/samuraiMack/Attack1.png',
			framesMax: 6
		},
		takeHit: {
			imageSrc: './images/samuraiMack/Take Hit - white silhouette.png',
			framesMax: 4
		},
		death: {
			imageSrc: './images/samuraiMack/Death.png',
			framesMax: 6
		}
	},
	attackBox: {
		offset: {
			x: 100,
			y: 50
		},
		width: 160,
		height: 50
	}

});

const enemy = new Fighter({

	position: {
		x: 400,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0
	},
	color: 'blue',

	offset: {
		x: -50,
		y: 0
	},

	imageSrc: './images/kenji/Idle.png',
	framesMax: 4,
	scale: 2.5,
	offset: {
		x: 215,
		y: 167
	},
	sprites: {
		idle: {
			imageSrc: './images/kenji/Idle.png',
			framesMax: 4
		},
		run: {
			imageSrc: './images/kenji/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './images/kenji/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './images/kenji/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './images/kenji/Attack1.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './images/kenji/Take hit.png',
			framesMax: 3
		},
		death: {
			imageSrc: './images/kenji/Death.png',
			framesMax: 7
		}
	},

	attackBox: {
		offset: {
			x: -170,
			y: 50
		},
		width: 170,
		height: 50
	}
});


console.log(player);

//definig relevant keyboard keys
const keys = {
	a: {
		pressed: false
	},

	d: {
		pressed: false
	},
	w: {
		pressed: false
	},

	ArrowRight: {
		pressed: false
	},

	ArrowLeft: {
		pressed: false
	}
}


decreaseTimer()

function animate() {
	window.requestAnimationFrame(animate)
	ctx.fillStyle = 'black' // Correctly set the fill color
	ctx.fillRect(0, 0, canvas.width, canvas.height) // Fill the canvas
	background.update()
	shop.update()
	ctx.fillStyle = 'rgba(255,255,255,0.15)'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	enemy.update()

	//strict movment for player and enemy
	player.velocity.x = 0
	enemy.velocity.x = 0

	//player movement 

	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5
		player.switchSprite('run')
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5
		player.switchSprite('run')

	} else {
		player.switchSprite('idle')
	}

	//jumping player
	if (player.velocity.y < 0) {
		player.switchSprite('jump')
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall')
	}

	//enemy movment
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5
		enemy.switchSprite('run')
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5
		enemy.switchSprite('run')
	} else {
		enemy.switchSprite('idle')
	}

	//jumping enemy
	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall')
	}

	//detect for colision & enemy gets hit
	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy
		}) &&
		player.isAttacking && player.framesCurrent === 4
	) {
		enemy.takeHit()
		player.isAttacking = false
		gsap.to(enemyHealth, {
			width: enemy.health + '%'
		})
	}

	//if player misses
	if (player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false
	}

	//player is hit 
	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy
		}) &&
		enemy.isAttacking && enemy.framesCurrent === 2
	) {
		player.takeHit()
		enemy.isAttacking = false
		gsap.to(playerHealth, {
			width: player.health + '%'
		})

		console.log('enemy attack succesful')
	}

	//if enemy misses
	if (enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false
	}

	//end game based on health

	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({ player, enemy, timerId })
	}
}


animate()

//keyboard events for player and enemy movement
window.addEventListener('keydown', (event) => {
	if (!player.dead) {
		switch (event.key) {
			//player keys
			case 'd':
				keys.d.pressed = true
				player.lastKey = 'd'
				break
			case 'a':
				keys.a.pressed = true
				player.lastKey = 'a'
				break

			case 'w':
				keys.w.pressed = true
				player.velocity.y = -20
				break
			case ' ':
				player.attack()
				break
		}
	}

	if (!enemy.dead) {
		switch (event.key) {
			//enemy keys
			case 'ArrowRight':
				keys.ArrowRight.pressed = true
				enemy.lastKey = 'ArrowRight'
				break
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true
				enemy.lastKey = 'ArrowLeft'
				break

			case 'ArrowUp':
				enemy.velocity.y = -20
				break
			case 'ArrowDown':
				enemy.attack()
				break
		}
	}

	//console.log(event)
})

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		//player keys
		case 'd':
			keys.d.pressed = false
			break

		case 'a':
			keys.a.pressed = false
			break
		case 'w':
			keys.w.pressed = false
			break

		//enemy
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break
	}
	//dfdconsole.log(event)
})

function updateOrientation() {
	if (window.matchMedia("(orientation: landscape)").matches) {
		document.body.classList.add("landscape");
		document.body.classList.remove("portrait");
	} else {
		document.body.classList.add("portrait");
		document.body.classList.remove("landscape");
	}
}

// Run on load and on orientation change
window.addEventListener("load", updateOrientation);
window.addEventListener("orientationchange", updateOrientation);
window.addEventListener("resize", updateOrientation); // fallback for some devices