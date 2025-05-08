'use strict';

import PositionElements from "./positionElements.js";

class DragDrop {
	constructor() {
		this.positionElements = new PositionElements();
		this.selectedPiece = null; // for select & place
		this.points = { correct: 0, wrong: 0 };
		this.setupSelectAndPlace();
		this.imageChange();
	}

	setupSelectAndPlace() {
		const { draggableDivs, puzzleDivs, modal, modalText, modalBtn, attempt, cellsAmount } = this.positionElements.elements;

		// Select piece from scrambled area
		draggableDivs.forEach(div => {
			div.addEventListener('click', () => this.selectPiece(div));
		});

		// Place piece into the puzzle grid or pick up existing
		puzzleDivs.forEach(div => {
			div.addEventListener('click', () => {
				if (this.selectedPiece) {
					this.placePiece(div);
					this.checkWinCondition(puzzleDivs, cellsAmount, modal, modalText, modalBtn, attempt);
				} else if (div.firstElementChild) {
					this.selectPiece(div.firstElementChild);
				}
			});
		});
	}

	selectPiece(div) {
		// Remove highlight from previous selection
		if (this.selectedPiece) {
			this.selectedPiece.style.outline = 'none';
		}

		this.selectedPiece = div;
		this.selectedPiece.style.outline = '3px solid yellow'; // highlight selected piece
	}

	placePiece(slot) {
		if (slot.children.length === 0) {
			// Empty slot, place the piece
			slot.appendChild(this.selectedPiece);
			this.selectedPiece.style.top = 0;
			this.selectedPiece.style.left = 0;
			this.selectedPiece.style.border = 'none';
			this.selectedPiece.style.outline = 'none';
			this.selectedPiece = null;
		} else {
			// Slot occupied — for now do nothing. Could add swap logic later.
		}
	}

	checkWinCondition(puzzleDivs, cellsAmount, modal, modalText, modalBtn, attempt) {
		let correctCount = 0;

		puzzleDivs.forEach(div => {
			if (div.firstElementChild && div.dataset.index === div.firstElementChild.dataset.index) {
				correctCount++;
			}
		});

		if (correctCount === cellsAmount) {
			modal.style.cssText = 'opacity:1; visibility:visible;';
			attempt.textContent = this.points.wrong;
			modalText.textContent = 'You Won!';
			modalBtn.onclick = () => location.reload();
		} else {
			// If grid full but not correct, optionally trigger loss modal
			const emptySlot = puzzleDivs.find(div => !div.firstElementChild);
			if (!emptySlot && correctCount < cellsAmount) {
				modal.style.cssText = 'opacity:1; visibility:visible;';
				modalText.textContent = 'You Lost. Try Again';
				modalBtn.onclick = () => location.reload();
			}
		}
	}

	imageChange() {
		const { finalImg, inputFile, draggableDivs } = this.positionElements.elements;

		inputFile.addEventListener('change', () => {
			const url = URL.createObjectURL(inputFile.files[0]);

			finalImg.style.backgroundImage = `url(${url})`;

			draggableDivs.forEach(div => {
				div.style.backgroundImage = `url(${url})`;
			});

			this.points = { correct: 0, wrong: 0 };
		});
	}
}

export default DragDrop;
