import Leaf from "leaf.js";

export default class LeafCanvas extends Leaf
{
	static getPropList() {
		return {
			width: {type:"int", min: 1, max: 10000, def: 100},
			height: {type:"int", min: 1, max: 10000, def: 100}
		}
	}
	
	init()
	{
		console.log("LeafCanvas initialized");
		console.log("w: " + this.width + " h: " + this.height);
		var domObj = this.findObjByLeafClass("LeafDOM");
		if (typeof(domObj) !== "object")
			throw Error("No objects with a DOM leaf in the tree.");
		var dom = domObj.getLeaf("LeafDOM").document;
		this.cv = dom.document.createElement('canvas');
		this.cv.id = this.getId();
		this.cv.width = this.width;
		this.cv.height = this.height;
		dom.document.body.appendChild(canv);;
		this.cx = cv.getContext("2d");
	}
	
	render ()
	{
		this.genEvent("LeafCanvasObject", "render", {cx: this.cx});
	}
	
	mouse_event(arg)
	{
		if (arg.type === "press")
		{
			this.genEvent("canvas_object", "click", {x: arg.x, y: arg.y});
			var objects = this.getChildList("canvas_object");
			//Is selected objects?
		}
		arg.event.stop(); //Prevent passing to children 
	}
}
