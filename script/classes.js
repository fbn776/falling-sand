/*Constants*/
const Blocks_sand_can_pass = ["air", "water", "lava", "vapour", "smoke", "acid", "methane", "acid-vapour"];
const Blocks_liquid_can_pass = ["air", "vapour", "smoke", "acid-vapour"];


/*Basics ---------------------------------*/
class Air {
	constructor() {
		this.type = "air";
		this.color = "rgba(0,0,0,0)";
	}
}

/*Immovable Solids ---------------------------------*/
class Wall {
	constructor() {
		this.type = "wall";
		this.color = "#B71C1C";
	}
	update() {}
}

class Wood {
	constructor() {
		this.type = "wood";
		this.color = "#5D4037";
	}
	update(adj) {}
}

class FixedConcrete {
	constructor() {
		this.type = "fixed-concrete";
		this.color = "#616161";
	}
	update() {}
}

class Obsidian {
	/*Formed when lava touches water*/
	constructor() {
		this.type = "obsidian";
		this.color = ["rgba( 20, 29, 120,1 )", "rgba( 47, 25, 144, 1)"].randomItem();
	}
	update() {};
}

class Glass {
	/*Hardened glass, formed when lava touches sand*/
	constructor() {
		this.type = "glass";
		this.color = "rgba( 251, 192, 45, 0.4)";
	}
	update() {};
}


/*Falling objects ---------------------------------*/
class Sand {
	constructor() {
		this.type = "sand";
		this.color = ["#FBC02D", "#FFC107", "#FFB300"].randomItem();
		this.canPassThrough = Blocks_sand_can_pass;
	}
	update(adj) {
		SandBehavior(this, adj);
	}
}

class Charcoal {
	constructor() {
		this.type = "charcoal";
		this.color = ["#303030", "#414141", "#606060"].randomItem();
		this.canPassThrough = Blocks_sand_can_pass;
	}
	update(adj) {
		SandBehavior(this, adj);
	}
}

class Concrete {
	constructor() {
		this.type = "concrete";
		this.color = ["#9e9e9e", "rgb(166,166,166)", "#bdbdbd"].randomItem();
		this.canPassThrough = Blocks_sand_can_pass;
	}
	update(adj) {
		const hasWaterAsNeighbour = isNeighborCell(adj.o, "water");
		if (hasWaterAsNeighbour) {
			setCell(adj.o, new FixedConcrete());
			setCell(hasWaterAsNeighbour.pos, new Air());
		} else {
			SandBehavior(this, adj);
		}
	}
}


/*Liquids ---------------------------------*/
const Water_colors = ["rgb( 30, 147, 240 )", "rgb( 33, 150, 243 )", "rgb( 36, 153, 246 )"]
class Water {
	constructor() {
		this.type = "water";
		this.color = Water_colors.randomItem();
		this.canPassThrough = Blocks_liquid_can_pass;
		this.updates = 0;
		this.tick = Math.floor(random(15, 25));

	}
	update(adj) {
		if (this.updates % this.tick == 0) {
			this.color = Water_colors.randomItem();
			this.updates = 0;
		}
		LiquidBehavior(this, adj);
		this.updates++;
	}
}

const Lava_colors = ["#E64A19", "#FF5722", "#F4511E"];
class Lava {
	constructor() {
		this.type = "lava";
		this.color = Lava_colors.randomItem();
		this.canPassThrough = Blocks_liquid_can_pass;
		this.updates = 0;
		this.fireTick = Math.floor(random(5, 8));
	}
	update(adj) {
		if (this.updates % this.fireTick == 0) {
			this.color = Lava_colors.randomItem();
			LiquidBehavior(this, adj);

			const neighbor = surroundingCellIsOfType([adj.l, adj.r, adj.b, adj.u],
			["water", "wood", "sand"]);
			if (neighbor) {
				for (let a of neighbor) {
					if (a.type == "water") {
						setCell(adj.o, new Obsidian());
					} else if (a.type == "wood") {
						setCell(a.pos, new Fire(500));
					} else if (a.type == "sand") {
						setCell(a.pos, new Glass());
					}
				}
			}
			this.updates = 0;
		}
		this.updates++;
	}
}

const Acid_effect_blocks = ["lava", "water", "wood", "sand", "charcoal", "fire", "concrete", "fixed-concrete", "glass", "obsidian", "gun-powder"];
const Acid_colors = ["rgb( 115, 252, 0 )", "rgb( 118, 255, 3 )", "rgb( 121, 258, 6)"]
class Acid {
	constructor() {
		this.type = "acid";
		this.color = Acid_colors.randomItem();
		this.canPassThrough = Blocks_liquid_can_pass;
		this.updates = 0;
		this.fireTick = Math.floor(random(5, 8));
	}
	update(adj) {
		LiquidBehavior(this, adj);
		if (this.updates % this.fireTick == 0) {
			this.color = Acid_colors.randomItem();
			if (Math.random() < 0.001 && getCellType(adj.u) == "air") {
				setCell(adj.u, new AcidVapour())
			}
			const neighbor = surroundingCellIsOfType([adj.l, adj.r, adj.b, adj.u],
				Acid_effect_blocks);
			if (neighbor) {
				for (let a of neighbor) {
					if (a.type == "lava") {
						setCell(adj.o, new AcidVapour());
					} else if (strOfType(a.type, Acid_effect_blocks)) {
						setCell(a.pos, new Air());
						setCell(adj.o, new AcidVapour());
					}
				}
			}
			this.updates = 0;
		}
		this.updates++;
	}
}



/*Gases---------------------------------*/
class Methane {
	/*catches fire very quickly*/
	constructor() {
		this.type = "methane";
		this.color = "rgba(0, 137, 123, 0.4)";
		this.canPassThrough = ["air", "water"];
		this.birthTime = Date.now();
		this.lifespan = random(15000, 30000);
		this.updates = 0;
		this.updates2 = 0;
		this.fireTick = 5;
	}
	update(adj) {
		if (Date.now() - this.birthTime > this.lifespan) {
			setCell(adj.o, new Air());
		} else {
			if (this.updates2 % this.fireTick == 0) {
				const neighbor = surroundingCellIsOfType([adj.l, adj.r, adj.b, adj.u, adj.dul, adj.dur, adj.dbl, adj.dbr],
				["fire", "lava"], true);
				if (neighbor) {
					for (let a of neighbor) {
						setCell(adj.o, new Fire(500, Math.random() < 0.3));
					}
				}
				this.updates2 = 0;
			}
			this.updates2++;
			GasBehavior(this, adj, 3);
		}
	}
}
class Smoke {
	/*Disappears after sometime*/
	constructor() {
		this.type = "smoke";
		this.color = "rgba(187, 190, 200, 0.9)";
		this.canPassThrough = ["air", "water"];
		this.birthTime = Date.now();
		this.lifespan = random(5000, 10000);
		this.updates = 0;
	}
	update(adj) {
		if (Date.now() - this.birthTime > this.lifespan) {
			setCell(adj.o, new Air());
		} else {
			GasBehavior(this, adj, 3);
		}
	}
}

class Vapour {
	/*Falls to the ground as water after some time*/
	constructor() {
		this.type = "vapour";
		this.color = "rgba(129, 212, 250, 0.7)";
		this.canPassThrough = ["air", "water", "smoke"];
		this.birthTime = Date.now();
		this.lifespan = random(10000, 20000);
		this.updates = 0;
	}
	update(adj) {
		if (Date.now() - this.birthTime > this.lifespan) {
			setCell(adj.o, new Water());
		} else {
			GasBehavior(this, adj, 3);
		}
	}
}

class AcidVapour {
	constructor() {
		this.type = "acid-vapour";
		this.color = "rgba(118, 255, 3,0.4)";
		this.canPassThrough = ["air", "water", "smoke"];
		this.birthTime = Date.now();
		this.lifespan = random(1000, 5000);
		this.updates = 0;
	}
	update(adj) {
		if (Date.now() - this.birthTime > this.lifespan) {
			setCell(adj.o, new Air());
		} else {
			GasBehavior(this, adj, 3);
		}
	}
}

/*Others ---------------------------------*/
class Fire {
	constructor(lifespan, smoke = true) {
		this.type = "fire";
		this.color = ["#F44336", "#E53935", "#FF5722"].randomItem();
		this.lifespan = lifespan || random(20000, 50000);
		this.birthTime = Date.now();
		this.fireTick = Math.floor(random(8, 15));
		this.updates = 0;
		this.smoke = smoke;
	}
	update(adj) {
		this.updates++;
		if (Date.now() - this.birthTime > this.lifespan) {
			setCell(adj.o, this.smoke ? new Smoke() : new Air());
		} else {
			if (this.updates % this.fireTick == 0) {
				const neighbor = surroundingCellIsOfType([adj.l, adj.r, adj.b, adj.u],
				["water", "wood"]);

				if (neighbor) {
					for (let a of neighbor) {
						if (a.type == "water") {
							setCell(a.pos, new Vapour());
							setCell(adj.o, new Air());
						} else if (a.type == "wood") {
							setCell(adj.o, new Charcoal());
							setCell(a.pos, new Fire(500));
						}
					}
				}
				this.updates = 0;
			}
		}
	}
}

class GunPowder {
	constructor() {
		this.type = "gun-powder";
		this.color = ["#212121", "#252525"].randomItem();
		this.fireTick = 10;
		this.updates = 0;
	}
	update(adj) {
		this.updates++;
		if (this.updates % this.fireTick == 0) {
			const neighbor = surroundingCellIsOfType([adj.l, adj.r, adj.b, adj.u, adj.dul, adj.dur, adj.dbl, adj.dbr],
			["fire", "lava"], true);

			if (neighbor) {
				for (let a of neighbor) {
					setCell(adj.o, new Fire(500));
				}
			}
			this.updates = 0;
		}
	}
}