function LiquidBehavior(cls, adj) {
	if (cellTypeOf(adj.b, cls.canPassThrough)) {
		swap(adj.o, adj.b)
	} else if (Math.random() > 0.5 && adj.l[1] >= 0 && cellTypeOf(adj.l, cls.canPassThrough) && cellTypeOf(adj.dbl, cls.canPassThrough)) {
		swap(adj.o, adj.dbl);
	} else if (adj.r[1] < adj.rowlen && cellTypeOf(adj.r, cls.canPassThrough) && cellTypeOf(adj.dbr, cls.canPassThrough)) {
		swap(adj.o, adj.dbr);
	} else {
		const left = getLeftData(adj.o);
		const right = getRightData(adj.o);

		if (Math.random() > 0.5 && left.hole && left.hole != 0) {
			if (adj.l[1] >= 0 && cellTypeOf(adj.l, cls.canPassThrough)) {
				swap(adj.o, adj.l)
			}
		} else if (right.hole && right.hole != 0) {
			if (adj.r[1] < adj.rowlen && cellTypeOf(adj.r, cls.canPassThrough)) {
				swap(adj.o, adj.r)
			}
		} else if (left.d != 0) {
			if (adj.l[1] >= 0 && cellTypeOf(adj.l, cls.canPassThrough)) {
				swap(adj.o, adj.l)
			};
		} else if (right.d != 0 && left.d != 0) {
			if (adj.r[1] < adj.rowlen && cellTypeOf(adj.r, cls.canPassThrough)) {
				swap(adj.o, adj.r)
			}
		}
		if (adj.r[1] < adj.rowlen && adj.l[1] >= 0 && getCellType(adj.u) != "air" && getCellType(adj.l) == cls.type && right.d != 0) {
			if (adj.r[1] < adj.rowlen && cellTypeOf(adj.r, cls.canPassThrough)) {
				swap(adj.o, adj.r)
			}
		}
	}
};

function SandBehavior(cls, adj) {
	if (cellTypeOf(adj.b, cls.canPassThrough)) {
		swap(adj.o, adj.b);
	} else if (adj.l[1] >= 0 && Math.random() > 0.5 && cellTypeOf(adj.l, cls.canPassThrough) && cellTypeOf(adj.dbl, cls.canPassThrough)) {
		swap(adj.o, adj.dbl);
	} else if (adj.r[1] < adj.rowlen && cellTypeOf(adj.r, cls.canPassThrough) && cellTypeOf(adj.dbr, cls.canPassThrough)) {
		swap(adj.o, adj.dbr);
	}
};

/*Same as Liquid Behavior, but reversed in direction*/
function GasBehavior(cls, adj, ticks) {
	if (cls.updates % ticks == 0) {
		if (cellTypeOf(adj.u, cls.canPassThrough)) {
			swap(adj.o, adj.u)
		} else if (Math.random() > 0.5 && adj.l[1] >= 0 && cellTypeOf(adj.l, cls.canPassThrough) && cellTypeOf(adj.dul, cls.canPassThrough)) {
			swap(adj.o, adj.dul);
		} else if (adj.r[1] < adj.rowlen && cellTypeOf(adj.r, cls.canPassThrough) && cellTypeOf(adj.dur, cls.canPassThrough)) {
			swap(adj.o, adj.dur);
		} else {
			const left = getLeftData(adj.o, true);
			const right = getRightData(adj.o, true);
			if (left.hole && left.hole != 0) {
				if (adj.l[1] >= 0 && cellTypeOf(adj.l, cls.canPassThrough)) {
					swap(adj.o, adj.l)
				}
			} else if (right.hole && right.hole != 0) {
				if (adj.r[1] < adj.rowlen && cellTypeOf(adj.r, cls.canPassThrough)) {
					swap(adj.o, adj.r)
				}
			} else if (left.d != 0) {
				if (adj.l[1] >= 0 && cellTypeOf(adj.l, cls.canPassThrough)) {
					swap(adj.o, adj.l)
				};
			} else if (right.d != 0 && left.d != 0) {
				if (adj.r[1] < adj.rowlen && cellTypeOf(adj.r, cls.canPassThrough)) {
					swap(adj.o, adj.r)
				}
			}
			if (adj.r[1] < adj.rowlen && adj.l[1] >= 0 && getCellType(adj.b) != "air" && getCellType(adj.l) == cls.type && right.d != 0) {
				if (adj.r[1] < adj.rowlen && cellTypeOf(adj.r, cls.canPassThrough)) {
					swap(adj.o, adj.r)
				}
			}
		}
		cls.updates = 0;
	}
	cls.updates ++;
};
