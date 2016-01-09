import Leaf from "leaf.js";

export default class LeafCanvasObject extends Leaf
{
	static getPropList() {
		return {
			x: {type:"double", min: -10000, max: 10000, def: 0},
			y: {type:"double", min: -10000, max: 10000, def: 0}
		}
	}
	
	constructor ()
	{
		super();
	}
	
	init()
	{
		console.log("LeafCanvasObject initialized");
		console.log("x: " + this.x + " y: " + this.y);
		this.isSelected = false;
	}
	
	render(arg)
	{
	}
	
	move(arg)
	{
		this.x = arg.x;
		this.y = arg.y;
	}
	
	click(arg)
	{
		var size = {w:0,h:0};
		var leafs = getLeafs("*");
		for (var i in leafs) {
			var leaf = leafs[i];
			if (typeof(leaf.isSelecteble) === "function")
				if (leaf.isSelecteble({x:arg.x - this.x,y:arg.y - this.y}))
				{
					isSelected = true;
					break;
				}
		}
	}
	
	rectSelect(arg)
	{
		if (isInRect({x:x,y:y},arg.rect))
			isSelected = true;
		else
			isSelected = false;
	}
}
