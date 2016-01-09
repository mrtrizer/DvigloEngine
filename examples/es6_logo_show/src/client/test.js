import LeafCanvas from "./leaf_canvas.js";
import LeafCanvasObject from "./leaf_canvas_object.js";
import Leaf from "leaf.js"
import LeafDOM from "leaf_dom.js"
import LeafDOMObject from "leaf_dom_object.js"
import LeafCanvasGraphics from "./leaf_canvas_graphics.js";
import LeafCanvasFigure from "./leaf_canvas_figure.js";
import LeafCanvasRect from "./leaf_canvas_rect.js";

var objectTreeSource = { 
	id: "root",
	leafs: [
		{
			lclass: "LeafDOM",
			data: {
				update_period:500}
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
						},
						{
							lclass: "LeafCanvasRect",
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
						},
						{
							lclass: "LeafCanvasRect",
							data: {
								x: 100,
								y: 100
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
		"Leaf":Leaf}
	var objectTree = engine.loadTree(objectTreeSource, classList);
	
}
