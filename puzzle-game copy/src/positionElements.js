'use strict';

import Elements from "./elements.js";

class PositionElements {
	constructor() {
		this.elements = new Elements();
		this.leftPositions = [0, 8, 16, 24, 32];  // 5 columns
		this.topPositions = [0, 6, 12, 18];       // 4 rows
		this.addDraggableDivs();
	}

	shuffle(array) {
		return array.sort(() => Math.random() - 0.5);
	}

	shufflePositions() {
		return this.shuffle(this.leftPositions).map((leftPosition) => {
			return this.shuffle(this.topPositions).map((topPosition) => [leftPosition, topPosition]);
		}).reduce((positions, item) => [...positions, ...item]);
	}

	bgPositions() {
		return this.topPositions.map((topPosition) => {
			return this.leftPositions.map((leftPosition) => [topPosition, leftPosition]);
		}).reduce((positions, item) => [...positions, ...item]);
	}

	randomImage() {
		return fetch('https://picsum.photos/1920/1080').then((res) => {
			this.imageURL = res.url;
		});
	}

	async addDraggableDivs() {
		const { cells, draggableDivs, finalImg, loader, randomBtn } = this.elements;

		loader.classList.add('active');
		await this.randomImage();
		loader.classList.remove('active');

		finalImg.style.backgroundImage = `url(${this.imageURL})`;

		const bgPositions = this.bgPositions();
		const shufflePositions = this.shufflePositions();

		const isMobile = window.innerWidth <= 768;

		// Shuffle the ORDER of the piece indices
		let order = Array.from({ length: draggableDivs.length }, (_, i) => i);
		order = this.shuffle(order);

		// --- CRITICAL: clear previous divs to avoid duplicates ---
		cells.innerHTML = '';

		order.forEach((pieceIndex, i) => {

			// --- Instead of reusing old divs, create new ones in shuffled order ---
			const div = document.createElement('div');
			const [topPos, leftPos] = bgPositions[pieceIndex];

			div.style.backgroundImage = `url(${this.imageURL})`;
			div.style.backgroundPosition = `-${leftPos}vw -${topPos}vw`;

			// Assign correct data-index for game logic
			div.setAttribute('data-index', pieceIndex);
			div.setAttribute('draggable', true);

			if (isMobile) {
				// --- MOBILE ---
				div.style.position = 'relative';
				div.style.left = '0';
				div.style.top = '0';
				div.style.width = 'calc(var(--width)/5)';
				div.style.height = 'calc(var(--height)/4)';
			} else {
				// --- DESKTOP ---
				div.style.position = 'absolute';
				div.style.left = `${shufflePositions[i][0]}vw`;
				div.style.top = `${shufflePositions[i][1]}vw`;
				div.style.width = 'calc(var(--width)/5)';
				div.style.height = 'calc(var(--height)/4)';
			}

			div.style.backgroundSize = 'var(--width) var(--height)';
			div.style.backgroundRepeat = 'no-repeat';
			div.style.cursor = 'grab';

			cells.append(div);

		});

		//  IMPORTANT: update draggableDivs to reflect the new shuffled divs 
		this.elements.draggableDivs = Array.from(cells.children);

		randomBtn.onclick = () => location.reload();
	}
}

export default PositionElements;
