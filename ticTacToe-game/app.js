'use strict';

//Variables
let cells = document.querySelectorAll('.cell');
let playerTurn = document.querySelector('.playerTurn');
let restart = document.querySelector('.restart');

let player = 'X';
let gameActive = true;

// Winning combinations
const winPatterns = [
	[0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
	[0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
	[0, 4, 8], [2, 4, 6]             // Diagonals
];

// Function to check if a player wins

function checkWinner() {
	for (let pattern of winPatterns) {
		let [a, b, c] = pattern;
		if (cells[a].innerText &&
			cells[a].innerText === cells[b].innerText &&
			cells[a].innerText === cells[c].innerText) {

			// Highlight the winning cells
			cells[a].style.backgroundColor = '#90EE90';
			cells[b].style.backgroundColor = '#90EE90';
			cells[c].style.backgroundColor = '#90EE90';

			playerTurn.innerText = `Winner: ${cells[a].innerText}!`;
			gameActive = false;
			return true;

		}
	}
	return false;
}

//Function for whose turn

function makeMove(cell) {
	if (!gameActive || cell.innerText !== '') return;


	cell.innerText = player
	if (checkWinner()) return;

	player = player === 'X' ? 'O' : 'X'
	playerTurn.innerText = `Turn: ${player}`;
}


cells.forEach((cell) => {
	cell.addEventListener('click', () => {
		makeMove(cell);
	})
});

//restart game
restart.addEventListener('click', () => {
	cells.forEach(cell => {
		cell.innerText = ""; // Clear all cells
		cell.style.backgroundColor ="#222";
	});
	player = 'X'; // Reset player to X
	playerTurn.innerText = 'Turn: X'; // Reset turn indicator
	gameActive = true;//reactivate game
});

//Option 2 for the X O turn
/* let count = 0;
function makeMove(cell) {
	if (cell.innerText === "") {
		if (count % 2 === 0) {
			cell.innerText = "X";
		} else {
			cell.innerText = "O";
		}
		count++;
	}
 }
/*
/* 
else {
	alert('chose another cell')
} */