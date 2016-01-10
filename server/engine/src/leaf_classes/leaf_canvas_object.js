import Leaf from "leaf.js";

export default class LeafCanvasObject extends Leaf
{
	static getPropList() {
		return {
			x: {type:"float", min: -10000, max: 10000, def: 0},
			y: {type:"float", min: -10000, max: 10000, def: 0}
		}
	}
	
	init() {
		this.isSelected = false;
	}
	
	render(e,args) {
		args.cx.save();
		args.cx.translate(this.x, this.y);
		for (let leaf of this.object.getLeafsByClass("LeafCanvasGraphics"))
			leaf.render(args.cx);
		args.cx.restore();
	}
	
	move(x,y) {
		this.x = x;
		this.y = y;
	}
	
	get rect() {
		var graphics = this.object.getLeafsByClass("LeafCanvasGraphics");
		if (graphics.length < 0)
			return {x:this.x, y:this.y, width:0, height:0}; 
		else {
			let rect = graphics[0].rect;
			return {x:this.x + rect.x, y:this.y + rect.y, width: rect.width, height: rect.height};
		}
	}
	
}
