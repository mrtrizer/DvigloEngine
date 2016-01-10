import LeafCanvasFigure from "./leaf_canvas_figure.js";

export default class LeafCanvasRect extends LeafCanvasFigure {

	static getPropList() {
		return {
			x: {type:"int", def:0},
			y: {type:"int", def:0},
			width: {type:"int", def:0},
			height: {type:"int", def:0},
		}
	}

	drawFigure(cx) {
		cx.rect(this.x,this.y,this.width,this.height);
	}
	
	get rect() {
		return {x:this.x, y:this.y, width:this.width, height: this.height};
	}
}
