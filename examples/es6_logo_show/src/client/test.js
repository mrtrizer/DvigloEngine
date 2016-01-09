import Common from "../common/common.js";
import LeafCanvas from "./leaf_canvas.js";
import LeafCanvasObject from "./leaf_canvas_object.js";
import Leaf from "leaf.js"
import LeafDOM from "leaf_dom.js"

var TOOLS = engine.tools;
var client = new TOOLS.HTTPClient(TOOLS.Network.detectHost(),0,0,0);

var objectTreeSource = { 
	id: "root",
	leafs: [
		{
			lclass: "LeafCanvas",
			data: {
				width: 500,
				height: 400,
				context: "2d"
			}
		},
		{
			lclass: "LeafDOM",
			data: {}
		}
	],
	objects: [
		{
			id: "player",
			leafs: [
				{
					lclass: "LeafCanvasObject",
					data: {
						x: 100,
						y: 100
					}
				},
				{
					lclass: "LeafCanvasImage",
					data: {
						path: "image.png"
					}
				}
			]
		}
	]
};

export function main() {
	var classList = {"LeafCanvas":LeafCanvas, "LeafCanvasObject":LeafCanvasObject, "LeafCanvasImage":Leaf, "LeafDOM":LeafDOM}
	var objectTree = engine.loadTree(objectTreeSource, classList);
	
}
