export default class Vec2 {
	
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	add(other) {
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	sub(other) {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

	scale(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	length() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}

	normalize() {
		return this.scale(1/this.length());
	}

	rotate(around, angle) {
		var toOrigin = new Vec2(this.x-around.x, this.y-around.y);
		var sna = Math.sin(angle);
		var csa = Math.cos(angle);
		this.x = csa*toOrigin.x - sna*toOrigin.y + around.x;
		this.y = sna*toOrigin.x + csa*toOrigin.y + around.y;
		return this;
	};


	round() {
		return this.set((this.x+0.5)|0, (this.y+0.5)|0);
	}

	clone(to) {
		return to ? to.set(this.x, this.y) : new Vec2(this.x, this.y);
	}

	reset() {
		this.x = 0;
		this.y = 0;
	}

}