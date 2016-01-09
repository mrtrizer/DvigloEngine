import LeafCanvas from "./leaf_canvas.js";
import LeafCanvasObject from "./leaf_canvas_object.js";
import Leaf from "leaf.js"
import LeafDOM from "leaf_dom.js"
import LeafDOMObject from "leaf_dom_object.js"

var objectTreeSource = { 
	id: "root",
	leafs: [
		{
			lclass: "LeafDOM",
			data: {}
		}
	],
	objects: [
		{
			leafs: [
				{
					lclass: "LeafDOMObject",
					data: {
						type:"div",
						style:"width:100px; height:100px, background-color:#666"}
				}
			]
		},
		{ 
			id: "canvas",
			leafs: [
				{
					lclass: "LeafCanvas",
					data: {width: 500, height: 500}
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
						}
					]
				},
				{
					id: "ball",
					leafs: [
						{
							lclass: "LeafCanvasObject",
							data: {
								x: 50,
								y: 50
							}
						}
					]
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
		"LeafDOMObject":LeafDOMObject, 
		"Leaf":Leaf}
	var objectTree = engine.loadTree(objectTreeSource, classList);
	
}
