import LeafCanvasGraphics from "leaf_canvas_graphics.js"

export default class LeafCanvasFigure extends LeafCanvasGraphics {
	static getPropList() {
		return {
			line_width: {type:"uint", def:1},
			line_style: {type:"str", def:"black"},
			fill_style: {type:"str", def:"black"}
		}
	}
	
	render(cx) {
		cx.lineWidth = this.line_width;
		cx.strokeStyle = this.line_style;
		cx.fillStyle = this.fill_style;
		cx.beginPath();
		this.drawFigure(cx);
		cx.closePath();
		cx.fill();
		cx.stroke();
	}
	
	drawFigure(cx) {
	}
}
