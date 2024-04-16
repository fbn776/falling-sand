let stopped = false;
const { canvas, ctx, cx, cy, cw, ch } = setUpCanvas(s("#main"), width, height - 60);
const canvas_rect = canvas.getBoundingClientRect();


const gSize = 7;
var rows = Math.floor(cw / gSize),
	cols = Math.floor(ch / gSize);

cols = Math.abs(cols * gSize - ch) > 1 ? cols + 1 : cols;
rows = Math.abs(rows * gSize - cw) > 1 ? rows + 1 : rows;


var grid_arr = generateGrid(rows, cols);


/*{pos:[j,i],block:<block type>}*/
var source_block = [];
const MAX_SOURCE_BLOCKS = 10;

let currTile = "sand";
let allowSourceBlock = true;
let isMouseDown = false;

canvas.ontouchmove = placeTile;
canvas.onclick = placeTile;
canvas.onmousedown = placeTile;

canvas.onmousedown = () => {
	isMouseDown = true;
}

canvas.onmouseup = () => {
	isMouseDown = false;
}

function startAction(e) {
	if (isMouseDown) {
		placeTile(e);
		requestAnimationFrame(() => { startAction(e) });
	}
}

canvas.onmousemove = (e) => {
	startAction(e);
};

function draw() {
	ctx.clearRect(0, 0, cw, ch);

	//Make a deep copy of the grid array;
	let grid = grid_arr.map(inner => inner.slice());
	for (let j = grid.length - 1; j >= 0; j--) {
		let rows = grid[j];
		for (let i = 0; i < rows.length; i++) {
			let cell = grid[j][i];
			if (cell.type != "air") {
				cell.update({
					o: [j, i],
					u: [j - 1, i],
					b: [j + 1, i],
					l: [j, i - 1],
					r: [j, i + 1],
					dbl: [j + 1, i - 1],
					dbr: [j + 1, i + 1],
					dul: [j - 1, i - 1],
					dur: [j - 1, i + 1],
					rowlen: rows.length,
					grid: grid,
				});
			};
			ctx.fillStyle = cell.color;
			ctx.fillRect(i * gSize, j * gSize, gSize, gSize);
		}
	}

	for (let a of source_block) {
		if (source_block.length > MAX_SOURCE_BLOCKS) {
			source_block.splice(0, 1);
		}
		if (getCellType(a.pos) != a.block) {
			setCell(a.pos, createCurrTile(a.block));
		}
		ctx.beginPath();
		ctx.fillStyle = "rgba(0,0,0,0.1)";
		ctx.strokeStyle = "rgba(0,0,0,1)";
		ctx.rect(a.pos[1] * gSize, a.pos[0] * gSize, gSize, gSize);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();

	}

	window.requestAnimationFrame(draw);
};

s(".start-menu").onclick = function () {
	this.remove();
	draw();
}

function clearGrid() {
	grid_arr = generateGrid(rows, cols);
	source_block = [];
}
