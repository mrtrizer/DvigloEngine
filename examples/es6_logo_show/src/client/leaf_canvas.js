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
		if (typeof(this.cx) === "object")
			this.emitChildren("LeafCanvasObject", "*", "render", {cx: this.cx});
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
