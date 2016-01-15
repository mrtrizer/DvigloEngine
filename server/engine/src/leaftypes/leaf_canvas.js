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
		this.cv.onclick = (e) => {this.mouseEvent("onclick",e);};
		this.cv.oncontextmenu = (e) => {this.mouseEvent("oncontextmenu", e);};
		this.cv.ondblclick = (e) => {this.mouseEvent("ondblclick", e);};
		this.cv.onmousedown = (e) => {this.mouseEvent("onmousedown", e);};
		this.cv.onmouseenter = (e) => {this.mouseEvent("onmouseenter", e);};
		this.cv.onmouseleave = (e) => {this.mouseEvent("onmouseleave", e);};
		this.cv.onmousemove = (e) => {this.mouseEvent("onmousemove", e);};
		this.cv.onmouseover = (e) => {this.mouseEvent("onmouseover", e);};
		this.cv.onmouseout = (e) => {this.mouseEvent("onmouseout", e);};
		this.cv.onmouseup = (e) => {this.mouseEvent("onmouseup", e);};
		this.parentElement.getElement().appendChild(this.cv);
		this.cx = this.cv.getContext("2d");
		this.onNewFrame();
	}
	
	onNewFrame() {
		this.renderCanvas();
		this.getWindow().requestAnimationFrame(() => this.onNewFrame());
	}
	
	mouseEvent(type, e) {
		var boundRect = this.cv.getBoundingClientRect();
		var args = {
			type:type, 
			e:e, 
			x:e.clientX - boundRect.left, 
			y:e.clientY - boundRect.top};
		this.emitChildren("InputCtrl", "*", "input", args);
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
