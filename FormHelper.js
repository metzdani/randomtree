export default class FormHelper {
	
	button(text, onclick, parent) {
		var btn = document.createElement('button');
		btn.appendChild(document.createTextNode(text));
		btn.addEventListener("click", onclick);
		if (parent) {
			parent.appendChild(btn);
		}
		return btn;
	}

	rangeInput(label, min, max, actual, onchange, parent) {
		var cont = document.createElement('div');
		var i = document.createElement('input');
		i.type='range';
		i.min = min;
		i.max = max;
		i.value = actual;
		i.id = "range"+Math.random();
		this.label(label, i.id, cont);
		cont.appendChild(i);
		var actualLabel = this.label(actual, i.id, cont);
		i.addEventListener("input", (e)=>{actualLabel.innerHTML=e.target.value; onchange(e)});
		if (parent) {
			parent.appendChild(cont);
		}
		return i;
	}

	label(text, forId, parent) {
		var lab = document.createElement('label');
		lab.htmlFor = forId;
		lab.innerHTML = text;
		if (parent) {
			parent.appendChild(lab);
		}
		return lab;
	}

}