'use strict';

import Elements from "./elements.js";

class PositionElements {
	constructor() {
		this.elements = new Elements();
		this.addDraggableDivs();
	}

	async addDraggableDivs() {
		const { cells, draggableDivs, finalImg, loader, randomBtn } = this.elements;

		loader.classList.add('active');
		await this.randomImage();
		loader.classList.remove('active');

		finalImg.style.backgroundImage = `url(${this.imageURL})`;

		// Get the correct background positions
		const bgPositions = this.bgPositions();

		// Create a shuffled order of indexes for placing tiles in random grid slots
		const placementOrder = this.shuffleArray(
			Array.from({ length: draggableDivs.length }, (_, i) => i)
		);

		// For each tile:
		draggableDivs.forEach((div, i) => {
			// Always assign correct data-index (for game logic)
			div.dataset.index = i;

			// Always assign correct background position (for correct image slice)
			div.style.backgroundImage = `url(${this.imageURL})`;
			div.style.backgroundPosition = `-${bgPositions[i][1]}vw -${bgPositions[i][0]}vw`;

			div.style.position = 'relative';
			div.style.left = '0';
			div.style.top = '0';
		});

		// --- Place the tiles in random grid positions ---
		placementOrder.forEach((index) => {
			cells.append(draggableDivs[index]);
		});

		randomBtn.onclick = () => location.reload();
	}

	bgPositions() {
		const positions = [];
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 5; col++) {
				positions.push([row * (24 / 4), col * (40 / 5)]);
			}
		}
		return positions;
	}

	shuffleArray(array) {
		return array.sort(() => Math.random() - 0.5);
	}

	async randomImage() {
		const response = await fetch('https://picsum.photos/1920/1080');
		this.imageURL = response.url;
	}
}

export default PositionElements;
