import LeafCanvas from "./leaf_canvas.js";
import LeafCanvasObject from "./leaf_canvas_object.js";
import Leaf from "leaf.js"
import LeafDOM from "leaf_dom.js"
import LeafDOMObject from "leaf_dom_object.js"
import LeafCanvasGraphics from "./leaf_canvas_graphics.js";
import LeafCanvasFigure from "./leaf_canvas_figure.js";
import LeafCanvasRect from "./leaf_canvas_rect.js";
import LeafDOMElement from "leaf_dom_element.js";

var objectTreeSource = { 
	id: "root",
	leafs: [
		{
			lclass: "LeafDOM",
			data: {
				update_period:2000}
		}
	],
	objects: [
		{
			leafs: [
				{
					lclass: "LeafDOMElement",
					data: {
						type:"div",
						style:"width:100px; height:100px; background-color:#666; left: 300px; top: 0px; position:absolute"}
				}
			],
			objects: [
					{
						leafs: [
							{
								lclass: "LeafDOMElement",
								data: {type:"div", 
									style:"width:50px; height:50px; background-color:#222; left: 0px; position:absolute"}
							}
						]
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
								x: 110,
								y: 110
							}
						},
						{
							lclass: "LeafCanvasRect",
							data: {
								x: 0,
								y: 0,
								width: 50,
								height: 50,
								fill_style: "blue"
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
						},
						{
							lclass: "LeafCanvasRect",
							data: {
								x: 0,
								y: 0,
								width: 70,
								height: 50,
								fill_style: "green"
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
		"LeafCanvasGraphics":LeafCanvasGraphics, 
		"LeafCanvasFigure":LeafCanvasFigure, 
		"LeafCanvasRect":LeafCanvasRect, 
		"LeafCanvasObject":LeafCanvasObject, 
		"LeafCanvasImage":Leaf, 
		"LeafDOM":LeafDOM, 
		"LeafDOMObject":LeafDOMObject, 
		"LeafDOMElement":LeafDOMElement, 
		"Leaf":Leaf}
	var objectTree = engine.loadTree(objectTreeSource, classList);
	console.log(objectTree.toJSON()); 
}
