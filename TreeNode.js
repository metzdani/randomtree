import Vec2 from './Vec2.js'
export default class TreeNode {
	
	constructor(p0, angle, length, width) {
		this.p0 = p0;
		this.angle = angle;
		this.length = length;
		this.width = width;
		this.p1 = new Vec2(0,1).rotate(new Vec2(0,0), angle).scale(length).add(p0);
		this.children = [];
	}

	

}