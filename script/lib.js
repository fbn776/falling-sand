function fullscreen(el) {
	if (el.webkitRequestFullScreen) {
		el.webkitRequestFullScreen();
	}
	else {
		el.mozRequestFullScreen();
	}
}

function generateGrid(rows, cols) {
	let arr = [];
	for (let i = 0; i < cols; i++) {
		let row = []
		for (let j = 0; j < rows; j++) {
			row.push(new Air());
		}
		arr.push(row);
	}
	return arr;
}

let width = window.innerWidth;
let height = window.innerHeight;

function setUpCanvas(c, w, h) {
	c.width = w;
	c.height = h;
	return {
		canvas: c,
		ctx: c.getContext("2d"),
		cw: c.width,
		ch: c.height,
		cx: c.width / 2,
		cy: c.height / 2
	}
}

function random(x, y, round = false) {
	let r = round ? Math.floor(Math.random()) : Math.random();
	return x + r * (y - x);
}

Array.prototype.randomItem = function() {
	return this[Math.floor(Math.random() * this.length)];
};

function s(elm) {
	return document.querySelector(elm);
}


function createCurrTile(tileName) {
	return eval(`new ${tileName.charAt(0).toUpperCase() + tileName.slice(1)}()`);
}


function changeTile(t, elm, allowSource = true) {
	currTile = t;
	allowSourceBlock = allowSource;
	for (let a of elm.parentElement.children) {
		a.classList.remove("active")
	};
	elm.classList.add("active");
}

function placeTile(e) {
	let x = (e.touches ? e.touches[0].clientX : e.clientX) - canvas_rect.left;
	let y = (e.touches ? e.touches[0].clientY : e.clientY) - canvas_rect.top;
	if (x > 0 && x < rows * gSize && y > 0 && y < cols * gSize) {
		let i = parseInt(x / gSize);
		let j = parseInt(y / gSize);

		for (let k = 0; k < source_block.length; k++) {
			const curr = source_block[k].pos;
			if (j == curr[0] && i == curr[1]) {
				source_block.splice(k, 1);
			}
		}
		if (allowSourceBlock) {
			if (setAsSource.checked) {
				source_block.push({ pos: [j, i], block: currTile });
			}
		}
		grid_arr[j][i] = createCurrTile(currTile);
	}
}


function getCell(pos) {
	return ((grid_arr[pos[0]] || [])[pos[1]]) || {};
};

function getCellType(cell) {
	return getCell(cell).type;
}

function setCell(pos, val) {
	grid_arr[pos[0]][pos[1]] = val;
};

function swap(a, b) {
	const og = getCell(a);
	setCell(a, getCell(b));
	setCell(b, og)
}

function cellTypeOf(pos, arr) {
	const type = getCell(pos);
	for (let a of arr) {
		if (a == type) {
			return true;
		}
	}
	return false;
}

function isAir(pos) {
	return getCellType(pos) == "air";
}

function cellTypeOf(pos, types) {
	for (let a of types) {
		if (getCellType(pos) == a) {
			return true;
		}
	}
	return false;
}



function getLeftData(pos, up = false) {
	const d_u = up ? -1 : 1;
	const data = { d: pos[1] };
	for (let i = pos[1] - 1; i >= 0; i--) {
		if (getCellType([pos[0], i]) != "air") {
			data.d = pos[1] - i - 1;
			break;
		}
		if (getCellType([pos[0] + d_u, i]) == "air") {
			data.hole = pos[1] - i - 1;
			break;
		}
	}
	return data;
}

function getRightData(pos, up = false) {
	const d_u = up ? -1 : 1;
	const rowlen = grid_arr[pos[0]].length;
	const data = { d: rowlen - pos[1] };

	for (let i = pos[1] + 1; i < rowlen; i++) {
		if (getCellType([pos[0], i]) != "air") {
			data.d = i - pos[1] - 1;
			break;
		}
		if (getCellType([pos[0] + d_u, i]) == "air") {
			data.hole = i - pos[1] - 1;
			break;
		}
	}
	return data;
}


function surroundingCellIsOfType(pos_arr, types, getAll) {
	let data = [];
	for (let pos of pos_arr) {
		for (let type of types) {
			if (getCellType(pos) == type) {
				data.push({ pos: pos, type: type });
				if (!getAll) { break };
			}
		}
	}
	return data.length == 0 ? false : data;
}

function isNeighborCell(p, type) {
	const a = p[0],
		b = p[1];
	const pos = [
		[a + 1, b],
		[a - 1, b],
		[a, b + 1],
		[a, b - 1],
	];
	const data = surroundingCellIsOfType(pos, [type]);
	return data ? data[0] : false;
}

function strOfType(str, types) {
	for (let a of types) {
		if (a == str) {
			return true;
		}
	}
	return false;
}
