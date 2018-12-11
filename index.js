import Vec2 from './Vec2.js';
import TreeNode from './TreeNode.js';

(function() {

	var generations = 8;
	var fullAngle = Math.PI / 2.5;
	var angleRand = Math.PI / 7;
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

	var screen = new Vec2(canvas.width=innerWidth, canvas.height=innerHeight);
	var context = canvas.getContext('2d');
	context.lineCap = 'round'
	context.strokeStyle = 'rgb(20,10,10)';

	var redrawBtn = document.createElement('button');
	redrawBtn.appendChild(document.createTextNode("Redraw"));
	redrawBtn.addEventListener("click", function(){
		context.clearRect(0,0,canvas.width,canvas.height);
		drawTree(root);
	});
	var rebuildBtn = document.createElement('button');
	rebuildBtn.appendChild(document.createTextNode("Rebuild"));
	rebuildBtn.addEventListener("click", function(){
		root = new TreeNode(new Vec2(0,-0.47), 0.0, rootLength, rootWidth);
		context.clearRect(0,0,canvas.width,canvas.height);
		buildTree(root, generations)
		drawTree(root);
	});
	document.body.appendChild(canvas);
	document.body.appendChild(redrawBtn);
	document.body.appendChild(rebuildBtn);


	var root = new TreeNode(new Vec2(0,-0.47), 0.0, rootLength, rootWidth);
	buildTree(root, generations);
	drawTree(root);
	
	function scrPos(point){
		return new Vec2((point.x*screen.x)*screen.y/screen.x+screen.x/2, -1*point.y*screen.y+screen.y/2);
	}

	function buildTree(parent, level) {
		if (level<=0) {
			return;
		}
		var num = Math.round(rand(minChild, maxChild));
		for (var i=0; i<num; i++) {
			var idealAngle =  lint(-fullAngle/2, fullAngle/2, i, num-1);
			var origin = vLint(parent.p0, parent.p1, rand(1.0, 1), 1);
			parent.children.push(new TreeNode(origin, randAround(parent.angle+idealAngle, angleRand), parent.length*randAround(lenghtRatio,lengthRand), parent.width*randAround(widthRatio, widthRand)));
		}
		parent.children.forEach(function(child){buildTree(child, level-1);});
		
	}

	function drawTree(node) {
		context.beginPath();
		var sp0 = scrPos(node.p0);
		var sp1 = scrPos(node.p1);

		var len = new Vec2(sp0.x-sp1.x, sp0.y-sp1.y).length();
		var numberOfSegments = len/10;

		context.moveTo(sp0.x, sp0.y);
		for (var i=1; i<numberOfSegments-1; i++) {
			var idealPos = vLint(sp0, sp1, i, numberOfSegments-1);
			var maxDist = len/numberOfSegments * 0.2;
			var posAdd = new Vec2(rand(-1,1), rand(-1,1)).normalize().scale(maxDist);
			idealPos.add(posAdd);
			context.lineTo(idealPos.x, idealPos.y)
		}
		context.lineTo(sp1.x, sp1.y);

		//context.moveTo(sp0.x, sp0.y);
		//context.lineTo(sp1.x, sp1.y);

		context.lineWidth=node.width*screen.y;
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
