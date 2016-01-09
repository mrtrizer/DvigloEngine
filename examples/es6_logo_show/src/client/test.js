import Common from "../common/common.js";
import LeafCanvas from "./leaf_canvas.js";
import LeafCanvasObject from "./leaf_canvas_object.js";
import Leaf from "leaf.js"
import LeafDOM from "leaf_dom.js"
import LeafDOMElement from "leaf_dom_element.js"

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
					lclass: "LeafDOMElement",
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
						}
					]
				},
				{
					id: "ball",
					leafs: [
						{
							lclass: "LeafCanvasObject",
							data: {
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
		"LeafDOMElement":LeafDOMElement, 
		"Leaf":Leaf}
	var objectTree = engine.loadTree(objectTreeSource, classList);
	
}
