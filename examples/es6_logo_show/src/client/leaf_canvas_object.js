import Leaf from "leaf.js";

export default class LeafCanvasObject extends Leaf
{
	static getPropList() {
		return {
			x: {type:"double", min: -10000, max: 10000, def: 0},
			y: {type:"double", min: -10000, max: 10000, def: 0}
		}
	}
	
	init() {
		this.isSelected = false;
	}
	
	render(e) {
		e.args.cx.save();
		e.args.cx.translate(this.x, this.y);
		for (let leaf of this.object.getLeafsByClass("LeafCanvasGraphics"))
			leaf.render(e.args.cx);
		e.args.cx.restore();
	}
	
	move(arg) {
		this.x = arg.x;
		this.y = arg.y;
	}
	
	click(arg) {
		var size = {w:0,h:0};
		var leafs = getLeafs("*");
		for (let leaf of leafs) {
			if (typeof(leaf.isSelecteble) === "function")
				if (leaf.isSelecteble({x:arg.x - this.x,y:arg.y - this.y}))
				{
					isSelected = true;
					break;
				}
		}
	}
	
	rectSelect(arg) {
		if (isInRect({x:x,y:y},arg.rect))
			isSelected = true;
		else
			isSelected = false;
	}
}
