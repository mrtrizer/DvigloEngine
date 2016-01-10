import LeafCanvas from "./leaf_canvas.js";
import LeafCanvasObject from "./leaf_canvas_object.js";
import Leaf from "leaf.js"
import LeafDOM from "leaf_dom.js"
import LeafDOMObject from "leaf_dom_object.js"
import LeafCanvasGraphics from "./leaf_canvas_graphics.js";
import LeafCanvasFigure from "./leaf_canvas_figure.js";
import LeafCanvasRect from "./leaf_canvas_rect.js";
import LeafDOMElement from "leaf_dom_element.js";
import LeafInputCtrl from "leaf_input_ctrl.js";
import {loadTree} from "engine.js";
import {MathTools} from "tools.js";

class LeafPlayerCtrl extends LeafInputCtrl {
	input (e,args) {
		if (args.type === "onclick")
			this.neighbor("CanvasRect").fill_style = "black";
		if (args.type === "onmousemove") {
			this.neighbor("CanvasObject").x = args.e.clientX;
			this.neighbor("CanvasObject").y = args.e.clientY;
			let rects = this.object.parent("Canvas").children("CanvasRect");
			for (let rect of rects) {
				let rectLeaf = rect.leaf("CanvasRect");
				let canvasObjLeaf = rect.leaf("CanvasObject");
				if (MathTools.isInRect({x:args.e.clientX, y:args.e.clientY},canvasObjLeaf.rect))
					this.neighbor("CanvasRect").fill_style = rectLeaf.fill_style;
			}
		}
	}
}

var objectTreeSource = { 
	id: "root",leafs: [{lclass: "LeafDOM", data: {update_period:2000}}],
	objects: [
		{leafs: [{lclass: "LeafDOMElement", data: {type:"div",style:"width:100px; height:100px; background-color:#666; left: 300px; top: 0px; position:absolute"}}
			],
		objects: [
			{leafs: [{lclass: "LeafDOMElement",data: {type:"div", style:"width:50px; height:50px; background-color:#222; left: 0px; position:absolute"}}
			]}
		]},
		{id: "canvas",
		leafs: [{lclass: "LeafCanvas", data: {width: 500, height: 500}}
			],
		objects: [
				{id: "player",
				leafs: [{lclass: "LeafPlayerCtrl"},
						{lclass: "LeafCanvasObject", data: {x: 110,y: 110}},
						{lclass: "LeafCanvasRect",data: {x: 0,y: 0,	width: 50,height: 50,fill_style: "blue"	}}
						]},
				{id: "ball",
				leafs: [{lclass: "LeafCanvasObject", data: {x: 40,y: 70}},
						{lclass: "LeafCanvasRect",data: {x: 0,y: 0,	width: 50,height: 70,fill_style: "green"}},
						{lclass: "LeafCanvasRect",data: {x: 10,y: 10,width: 30,height: 50,fill_style: "red"},mode:"dev"}
						]},
				{id: "box",
				leafs: [{lclass: "LeafCanvasObject", data: {x: 70,y: 30}},
						{lclass: "LeafCanvasRect",data: {x: 0,y: 0,	width: 30,height: 30,fill_style: "#666"}}
						]}
			]},
		]
	};
	
export function main() {
	var classList = {
		"LeafCanvas":LeafCanvas, 
		"LeafCanvasGraphics":LeafCanvasGraphics, 
		"LeafCanvasFigure":LeafCanvasFigure, 
		"LeafCanvasRect":LeafCanvasRect, 
		"LeafCanvasObject":LeafCanvasObject, 
		"LeafCanvasImage":Leaf, 
		"LeafDOM":LeafDOM, 
		"LeafDOMObject":LeafDOMObject, 
		"LeafDOMElement":LeafDOMElement, 
		"LeafPlayerCtrl":LeafPlayerCtrl,
		"LeafInputCtrl":LeafInputCtrl,
		"Leaf":Leaf,
		"Canvas":LeafCanvas, 
		"CanvasGraphics":LeafCanvasGraphics, 
		"CanvasFigure":LeafCanvasFigure, 
		"CanvasRect":LeafCanvasRect, 
		"CanvasObject":LeafCanvasObject, 
		"CanvasImage":Leaf, 
		"DOM":LeafDOM, 
		"DOMObject":LeafDOMObject, 
		"DOMElement":LeafDOMElement, 
		"PlayerCtrl":LeafPlayerCtrl,
		"InputCtrl":LeafInputCtrl
		}
	var objectTree = loadTree(objectTreeSource, classList);
	console.log(objectTree.toJSON()); 
}
