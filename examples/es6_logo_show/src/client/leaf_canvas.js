import Leaf from "leaf.js";

export default class LeafCanvas extends Leaf
{
	static getPropList() {
		return {
			width: {type:"int", min: 1, max: 10000, def: 100},
			height: {type:"int", min: 1, max: 10000, def: 100}
		}
	}
	
	constructor ()
	{
		super();
	}
	
	init()
	{
		console.log("LeafCanvas initialized");
		console.log("w: " + this.width + " h: " + this.height);
		//var dom = this.findObjectUp("DOM").getLeaf("DOM");
		//this.cv = dom.document.createElement('canvas');
		//this.cv.id = this.getId();
		//this.cv.width = this.width;
		//this.cv.height = this.height;
		//dom.document.body.appendChild(canv);;
		//this.cx = cv.getContext("2d");
		//Start rendering here
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
