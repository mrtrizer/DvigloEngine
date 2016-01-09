import Leaf from "leaf.js";
import MathTools from "tools.js";

export default class LeafCanvasGraphics extends Leaf {
	
	static getPropList() {
		return {
		}
	}
	
	render(cx) {
		cx.lineWidth = "6";
		cx.strokeStyle = "red";
		cx.rect(this.x - 5,this.y - 5, 10,10);
		cx.stroke(); 
	}
	
	selectPoint(e) {
		if (MathTools.isInRect(e.args.pos, {x: this.x - 5, y: this.y - 5, width: 10, height: 10})) {
			object.getLeafByClass("LeafCanvasObject").selected = true;
		}
	}
}
