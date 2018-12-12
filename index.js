import Vec2 from './Vec2.js';
import TreeNode from './TreeNode.js';
import FormHelper from './FormHelper.js';

(function() {

	var generations = 8;
	var fullAngle = Math.PI / 2.5;
	var angleRand = Math.PI / 8;
	var lenghtRatio = 0.7;
	var lengthRand = 0.09;
	var widthRatio = 0.5;
	var widthRand = 0.05;
	var minChild=3, maxChild=5;

	var rootLength = 0.25;
	var rootWidth= 0.05;

	var canvas = document.createElement('canvas');
	canvas.style["background-color"]="transparent";
	canvas.style["position"]="fixed";
	canvas.style["top"]="0";
	canvas.style["left"]="0";
	canvas.style["z-index"]="-1"
	document.body.appendChild(canvas);

	var screen = new Vec2();
	var scrDim;
	var context = canvas.getContext('2d');
	var root;

	rebuild();

	var helper = new FormHelper();
	helper.button("Redraw", redraw, document.body);
	helper.button("Rebuild", ()=>{
			rebuild();
			redraw();
		}, document.body
	);
	helper.rangeInput("Generations", 1, 10, generations, (e)=>{generations = e.target.value; rebuild(); redraw();}, document.body);
	var minChildWidget = helper.rangeInput("Min. branching factor", 0, 7, minChild, (e)=>{
			minChild = e.target.value;
			rebuild();
			redraw();
		}, document.body
	);
	var maxChildWidget =  helper.rangeInput("Max. branching factor", 0, 7, maxChild, (e)=>{
			maxChild = e.target.value;
			rebuild(); 
			redraw();
		}, document.body
	);
	helper.rangeInput("Full angle of branches", 0, 359, rad2deg(fullAngle), (e)=>{fullAngle = deg2rad(e.target.value); rebuild(); redraw();}, document.body);
	helper.rangeInput("Angle max. random", 0, 359, rad2deg(angleRand), (e)=>{angleRand = deg2rad(e.target.value); rebuild(); redraw();}, document.body);
	helper.rangeInput("Root length", 0, 100, rootLength*100, (e)=>{rootLength = e.target.value/100; rebuild(); redraw();}, document.body);
	helper.rangeInput("Branch length ratio", 0, 100, lenghtRatio*100, (e)=>{lenghtRatio = e.target.value/100; rebuild(); redraw();}, document.body);
	helper.rangeInput("Length max. random", 0, 100, lengthRand*100, (e)=>{lengthRand = e.target.value/100; rebuild(); redraw();}, document.body);
	helper.rangeInput("Root width", 1, 200, rootWidth*1000, (e)=>{
			var originalWidth = rootWidth;
			rootWidth = e.target.value/1000;
			modifyWidth(root, rootWidth/originalWidth);
			redraw();
		}, document.body
	);
	helper.rangeInput("Branch width ratio", 0, 100, widthRatio*100, (e)=>{widthRatio = e.target.value/100; rebuild(); redraw();}, document.body);
	helper.rangeInput("Width max. random", 0, 200, widthRand*500, (e)=>{widthRand = e.target.value/500; rebuild(); redraw();}, document.body);

	window.onload = window.onresize = function() {
		initScreen();
		redraw();
	};

	function deg2rad(deg) {
		return Math.PI*deg/180;
	}

	function rad2deg(rad) {
		return 180*rad/Math.PI;
	}

	function initScreen() {
		screen.set(canvas.width=innerWidth, canvas.height=innerHeight);
		scrDim = Math.min(screen.x, screen.y);
		context.lineCap = 'round';
		context.strokeStyle = 'rgb(30,15,15)';
	}

	function rebuild() {
		root = new TreeNode(new Vec2(0,-0.47), 0.0, rootLength, rootWidth);
		buildTree(root, generations);
	}

	function redraw() {
		context.clearRect(0,0,canvas.width,canvas.height);
		drawTree(root);
	}
	
	
	function scrPos(point){
		return new Vec2(point.x*scrDim+screen.x/2, -1*point.y*scrDim+screen.y/2)
	}

	function buildTree(parent, level) {
		if (level<=0) {
			return;
		}
		var num = Math.round(rand(Math.min(minChild, maxChild), Math.max(minChild, maxChild)));
		for (var i=0; i<num; i++) {
			var idealAngle =  lint(-fullAngle/2, fullAngle/2, i, num-1);
			var origin = vLint(parent.p0, parent.p1, rand(1.0, 1), 1);
			parent.children.push(new TreeNode(origin, randAround(parent.angle+idealAngle, angleRand), parent.length*randAround(lenghtRatio,lengthRand), parent.width*randAround(widthRatio, widthRand)));
		}
		parent.children.forEach(function(child){buildTree(child, level-1);});
	}

	function modifyWidth(node, factor) {
		node.width *= factor;
		node.children.forEach((child)=>{modifyWidth(child, factor)});
	}

	function drawTree(node) {
		context.beginPath();
		var sp0 = scrPos(node.p0);
		var sp1 = scrPos(node.p1);

		var len = node.length * scrDim ;
		var numberOfSegments = Math.min(len/5, 12)

		context.moveTo(sp0.x, sp0.y);
		for (var i=1; i<numberOfSegments-1; i++) {
			var idealPos = vLint(sp0, sp1, i, numberOfSegments-1);
			var maxDist = len/numberOfSegments * 0.18;
			var actualPos = new Vec2(rand(-1,1), rand(-1,1)).normalize().scale(maxDist);
			actualPos.add(idealPos);
			context.lineTo(actualPos.x, actualPos.y)
		}
		context.lineTo(sp1.x, sp1.y);
		context.lineWidth=node.width*scrDim;
		context.stroke();

		node.children.forEach(function(child){drawTree(child)});
	}

	function rand(min, max) {
		return Math.random() * (max-min) + min;
	}

	function randAround(ideal, rnd) {
		return ideal + rand(-rnd, rnd);
	}

	function lint(lower, upper, t, maxT) {
		t = maxT==0 ? 1 : t/maxT;
		return (1.0-t)*lower + t*upper;
	}

	function vLint(lower, upper, t, maxT) {
		return new Vec2(lint(lower.x, upper.x, t, maxT), lint(lower.y, upper.y, t, maxT));
	}

})();
