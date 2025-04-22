'use strict';
//
const section = document.querySelector('section');

const playerLivesCount = document.querySelector('span');

let playerLives = 6

//link to text
playerLivesCount.textContent = 6

//generate data
const getData = () => [
	{ imgSrc: './images/alien.png', name: 'alien' },
	{ imgSrc: './images/ball.png', name: 'ball' },
	{ imgSrc: './images/bracket.png', name: 'bracket' },
	{ imgSrc: './images/heart.png', name: 'heart' },
	{ imgSrc: './images/leaf.png', name: 'leaf' },
	{ imgSrc: './images/music.png', name: 'music' },
	{ imgSrc: './images/present.png', name: 'present' },
	{ imgSrc: './images/star.png', name: 'star' },
	{ imgSrc: './images/alien.png', name: 'alien' },
	{ imgSrc: './images/ball.png', name: 'ball' },
	{ imgSrc: './images/bracket.png', name: 'bracket' },
	{ imgSrc: './images/heart.png', name: 'heart' },
	{ imgSrc: './images/leaf.png', name: 'leaf' },
	{ imgSrc: './images/music.png', name: 'music' },
	{ imgSrc: './images/present.png', name: 'present' },
	{ imgSrc: './images/star.png', name: 'star' },
]

const data = getData();

//randomize
const randomize = () => {
	const cardData = getData();
	cardData.sort(() => Math.random() - 0.5);
	return cardData;
}


//card generator function
const cardGenerator = () => {
	const cardData = randomize();
	//console.log(cardData)
	//generate HTML
	cardData.forEach((item, index) => {
		//console.log(item);
		const card = document.createElement('div');
		const face = document.createElement('img')
		const back = document.createElement('div')
		card.classList = 'card';
		face.classList = 'face';
		back.classList = 'back';
		//attach info to cards
		face.src = item.imgSrc;
		card.setAttribute('name', item.name);
		//attach cards to the section
		section.appendChild(card);
		card.appendChild(face);
		card.appendChild(back);

		card.addEventListener('click', (e) => {
			card.classList.toggle('toggleCard');
			checkCards(e);
		})

	});

};

//check cards
const checkCards = (e) => {
	console.log(e)
	const clickedCard = e.target;
	clickedCard.classList.add('flipped');
	const flippedCards = document.querySelectorAll('.flipped');
	const toggleCard=document.querySelectorAll('.toggleCard')

	//logic
	if (flippedCards.length === 2) {
		if (flippedCards[0].getAttribute('name') === flippedCards[1].getAttribute('name')) {
			console.log('match');
			flippedCards.forEach((card) => {
				card.classList.remove('flipped');
				card.style.pointerEvents = 'none';
			})
		} else {
			console.log('wrong');
			flippedCards.forEach((card) => {
				card.classList.remove('flipped');
				setTimeout(() => card.classList.remove('toggleCard'), 2000);
			});
			playerLives--;
			playerLivesCount.textContent = playerLives;
			if (playerLives === 0) {
				restart('YOU LOSE!');
			}


		}
	}
	//run check to se if the we won the game
	if(toggleCard.length===16){
		restart('YOU WON!');
	}

};

//restart
const restart = (text) => {
	let cardData = randomize();
	let faces = document.querySelectorAll('.face');
	let cards = document.querySelectorAll('.card');
	section.style.pointerEvents = 'none'
	cardData.forEach((item, index) => {
		cards[index].classList.remove('toggleCard');
		//randomize
		setTimeout(() => {
			cards[index].style.pointerEvents = 'all';
			faces[index].src = item.imgSrc;
			cards[index].setAttribute('name', item.name);
			section.style.pointerEvents = 'all';
		}, 1000)


	});
	playerLives = 6;
	playerLivesCount.textContent = playerLives;
	setTimeout(() => window.alert(text), 100)
};

cardGenerator();