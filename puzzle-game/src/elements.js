'use strict';

class Elements {
	constructor() {
		this.puzzle = document.querySelector('.puzzle');
		this.cellsAmount = 20;
		this.puzzleDivs = [];
		this.draggableDivs = [];
		this.cells=document.querySelector('.cells')
		this.modal=document.querySelector('.modal');
		this.modalText=document.querySelector('.modal-text');
		this.modalBtn=document.querySelector('.modal-btn');
		this.attempt=document.querySelector('.attempt');
		this.finalImg=document.querySelector('.final-img');
		this.inputFile=document.getElementById('input-file');
		this.loader=document.querySelector('.loader');
		this.randomBtn=document.querySelector('.random-btn')
		this.createElements()
	}

	createElements() {
		for (let i = 0; i < this.cellsAmount; i++) {
			const puzzleDiv = document.createElement('div');
			puzzleDiv.setAttribute('data-index', i);
			this.puzzle.append(puzzleDiv);
			this.puzzleDivs.push(puzzleDiv);

			const draggableDiv = document.createElement('div');
			draggableDiv.setAttribute('data-index', i);
			draggableDiv.setAttribute('draggable', true);
			this.draggableDivs.push(draggableDiv);
		}
		//console.log(this.puzzleDivs,this.draggableDivs)
	}
}

export default Elements