import Common from "../common/common.js";
import LeafCanvas from "./leaf_canvas.js";
import LeafCanvasObject from "./leaf_canvas_object.js";
import Leaf from "leaf.js"
import LeafDOM from "leaf_dom.js"

var objectTreeSource = { 
	id: "root",
	leafs: [
		{
			lclass: "LeafDOM",
			data: {}
		},
		{
			lclass: "LeafCanvas",
			data: {
				width: 500,
				height: 400,
				context: "2d"
			}
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
		},
		{
			id: "ball",
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
	var classList = {
		"LeafCanvas":LeafCanvas, 
		"LeafCanvasObject":LeafCanvasObject, 
		"LeafCanvasImage":Leaf, 
		"LeafDOM":LeafDOM, 
		"Leaf":Leaf}
	var objectTree = engine.loadTree(objectTreeSource, classList);
	
}
