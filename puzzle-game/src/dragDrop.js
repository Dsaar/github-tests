'use strict';

import PositionElements from "./positionElements.js";

class DragDrop {
	constructor() {
		this.positionElements = new PositionElements()
		this.selected = null;
		this.dropTarget = null;
		this.points = { correct: 0, wrong: 0 };
		this.dragDropEvents()
		this.imageChange()
	}

	dragDropEvents() {
		const { draggableDivs, puzzleDivs, modal, modalText, modalBtn, attempt, cellsAmount } = this.positionElements.elements;

		draggableDivs.forEach((draggableDiv, i) => {

			// --- DESKTOP EVENTS ---
			draggableDiv.addEventListener('dragstart', (e) => {
				this.selected = e.target;
				console.log('dragstart');
			});

			puzzleDivs[i].addEventListener('dragover', (e) => {
				e.preventDefault();
				console.log('dragover');
			});

			puzzleDivs[i].addEventListener('drop', () => {
				if (puzzleDivs[i].children.length === 0) {
					this.movePieceTo(puzzleDivs[i]);
				}
			});

			puzzleDivs[i].addEventListener('dragenter', () => {
				puzzleDivs[i].classList.add('active');
			});

			puzzleDivs[i].addEventListener('dragleave', () => {
				puzzleDivs[i].classList.remove('active');
			});

			// --- MOBILE TOUCH EVENTS ---
			draggableDiv.addEventListener('touchstart', (e) => {
				this.selected = e.target;
				console.log('touchstart');
			}, { passive: true });

			puzzleDivs[i].addEventListener('touchmove', (e) => {
				e.preventDefault();
				const touch = e.touches[0];
				const target = document.elementFromPoint(touch.clientX, touch.clientY);
				if (target && target.closest('.puzzle div')) {
					this.dropTarget = target.closest('.puzzle div');
					puzzleDivs.forEach(div => div.classList.remove('active'));
					this.dropTarget.classList.add('active');
				}
			}, { passive: false });

			puzzleDivs[i].addEventListener('touchend', () => {
				if (this.selected && this.dropTarget && this.dropTarget.children.length === 0) {
					this.movePieceTo(this.dropTarget);
				}
				this.selected = null;
				this.dropTarget = null;
				puzzleDivs.forEach(div => div.classList.remove('active'));
			});
		});
	}

	movePieceTo(targetDiv) {
		const { puzzleDivs, modal, modalText, modalBtn, attempt, cellsAmount } = this.positionElements.elements;

		this.selected.style.top = 0;
		this.selected.style.left = 0;
		this.selected.style.border = 'none';
		targetDiv.append(this.selected);

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

		if (this.points.correct === cellsAmount) {
			modal.style.cssText = 'opacity:1; visibility:visible;';
			attempt.textContent = this.points.wrong;
			modalBtn.onclick = () => location.reload();
		}

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
