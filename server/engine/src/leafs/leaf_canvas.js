import LeafDOMObject from "leaf_dom_object.js";

export default class LeafCanvas extends LeafDOMObject
{
	static getPropList() {
		return {
			width: {type:"int", min: 1, max: 10000, def: 100},
			height: {type:"int", min: 1, max: 10000, def: 100}
		}
	}
	
	init() {
		this.cv = this.getDocument().createElement('canvas');
		this.cv.width = this.width;
		this.cv.height = this.height;
		this.cv.onclick = (e) => {this.emitChildren("InputCtrl", "*", "input", {type:"onclick", e:e});};
		this.cv.oncontextmenu = (e) => {this.emitChildren("InputCtrl", "*", "input", {type:"oncontextmenu", e:e});};
		this.cv.ondblclick = (e) => {this.emitChildren("InputCtrl", "*", "input", {type:"ondblclick", e:e});};
		this.cv.onmousedown = (e) => {this.emitChildren("InputCtrl", "*", "input", {type:"onmousedown", e:e});};
		this.cv.onmouseenter = (e) => {this.emitChildren("InputCtrl", "*", "input", {type:"onmouseenter", e:e});};
		this.cv.onmouseleave = (e) => {this.emitChildren("InputCtrl", "*", "input", {type:"onmouseleave", e:e});};
		this.cv.onmousemove = (e) => {this.emitChildren("InputCtrl", "*", "input", {type:"onmousemove", e:e});};
		this.cv.onmouseover = (e) => {this.emitChildren("InputCtrl", "*", "input", {type:"onmouseover", e:e});};
		this.cv.onmouseout = (e) => {this.emitChildren("InputCtrl", "*", "input", {type:"onmouseout", e:e});};
		this.cv.onmouseup = (e) => {this.emitChildren("InputCtrl", "*", "input", {type:"onmouseup", e:e});};
		this.parentElement.getElement().appendChild(this.cv);
		this.cx = this.cv.getContext("2d");
		this.onNewFrame();
	}
	
	onNewFrame() {
		this.renderCanvas();
		this.getWindow().requestAnimationFrame(() => this.onNewFrame());
	}
	
	///Special render method for canvas
	renderCanvas() {
		this.cx.clearRect(0, 0, this.cv.width, this.cv.height);
		if (typeof(this.cx) === "object")
			this.emitChildren("CanvasObject", "*", "render", {cx: this.cx});
	}
	
	///Render event listener
	render (e) {

	}
	
	mouse_event(arg) {
		if (arg.type === "press")
		{
			this.genEvent("canvas_object", "click", {x: arg.x, y: arg.y});
			var objects = this.getChildList("canvas_object");
			//Is selected objects?
		}
		arg.event.stop(); //Prevent passing to children 
	}
}
