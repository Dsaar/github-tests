'use strict';

import PositionElements from "./positionElements.js";

class DragDrop {
	constructor() {
		this.positionElements = new PositionElements();
		this.selected = null;
		this.points = { correct: 0, wrong: 0 };
		this.dragDropEvents();
		this.imageChange();
	}

	dragDropEvents() {
		const { draggableDivs, puzzleDivs, modal, modalText, modalBtn, attempt, cellsAmount } = this.positionElements.elements;

		// For each draggable piece
		draggableDivs.forEach((draggableDiv) => {

			// Desktop dragstart
			draggableDiv.addEventListener('dragstart', (e) => {
				this.selected = e.target;
			});

			// Tap to select (mobile + desktop)
			draggableDiv.addEventListener('click', (e) => {
				this.selected = e.target;
				draggableDivs.forEach(div => div.classList.remove('selected'));
				e.target.classList.add('selected');
			});
		});

		// For each puzzle slot
		puzzleDivs.forEach((puzzleDiv) => {

			// Desktop dragover
			puzzleDiv.addEventListener('dragover', (e) => e.preventDefault());

			// Desktop drop
			puzzleDiv.addEventListener('drop', () => {
				this.attemptMove(puzzleDiv);
			});

			// Tap to place (mobile & desktop)
			puzzleDiv.addEventListener('click', () => {
				this.attemptMove(puzzleDiv);
			});
		});
	}

	attemptMove(targetDiv) {
		const { draggableDivs } = this.positionElements.elements;

		if (!this.selected || targetDiv.children.length > 0) {
			return;  // Either no piece selected, or slot already occupied
		}

		this.movePieceTo(targetDiv);
		draggableDivs.forEach(div => div.classList.remove('selected'));
		this.selected = null;
	}

	movePieceTo(targetDiv) {
		const { puzzleDivs, modal, modalText, modalBtn, attempt, cellsAmount } = this.positionElements.elements;

		this.selected.style.top = '0';
		this.selected.style.left = '0';
		this.selected.style.border = 'none';
		this.selected.style.position = 'relative';  // Switch to relative when placed
		targetDiv.append(this.selected);

		// Check correctness
		if (this.selected.dataset.index === targetDiv.dataset.index) {
			this.points.correct = 0;
			puzzleDivs.forEach((div) => {
				if (div.firstElementChild && div.dataset.index === div.firstElementChild.dataset.index) {
					this.points.correct++;
				}
			});
		} else {
			this.points.wrong++;
		}

		console.log(this.points);

		// Victory
		if (this.points.correct === cellsAmount) {
			modal.style.cssText = 'opacity:1; visibility:visible;';
			attempt.textContent = this.points.wrong;
			modalBtn.onclick = () => location.reload();
		}

		// No more empty slots but not solved = loss
		const found = puzzleDivs.find((div) => !div.firstElementChild);
		if (!found && this.points.correct < cellsAmount) {
			modal.style.cssText = 'opacity:1; visibility:visible;';
			modalText.textContent = 'You Lost. Try Again';
			modalBtn.onclick = () => location.reload();
		}
	}

	imageChange() {
		const { finalImg, inputFile, draggableDivs } = this.positionElements.elements;

		inputFile.addEventListener('change', () => {
			const url = URL.createObjectURL(inputFile.files[0]);
			finalImg.style.backgroundImage = `url(${url})`;
			draggableDivs.forEach((div) => {
				div.style.backgroundImage = `url(${url})`;
			});

			this.points = { correct: 0, wrong: 0 };
		});
	}
}

export default DragDrop;
