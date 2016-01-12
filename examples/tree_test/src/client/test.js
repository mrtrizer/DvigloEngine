import LeafInputCtrl from "leaf_input_ctrl.js";
import {loadTree} from "engine.js";
import {MathTools} from "tools.js";
import TemplateCanvasObj from "template_canvas_obj.js";

///@addtogroup TreeInit
///@{

var canvasObj = new TemplateCanvasObj({leafs: [{lclass: "CanvasRect",data: {width: 5,height: 5,fill_style: "red"}}]});

class LeafPlayerCtrl extends LeafInputCtrl {
	
	init() {
	}
	
	input (e,args) {
		if (args.type === "onclick")
			canvasObj.applyTo(this.object.parent("Canvas"), {x: args.x, y: args.y});
			//TODO: this.parent("Canvas").apply("RedBullet",{x: args.x, y: args.y});
		if (args.type === "onmousemove") {
			this.neighbor("CanvasObject").x = args.x;
			this.neighbor("CanvasObject").y = args.y;
			let rects = this.object.parent("Canvas").children("CanvasRect");
			for (let rect of rects) {
				let rectLeaf = rect.leaf("CanvasRect");
				let canvasObjLeaf = rect.leaf("CanvasObject");
				if (MathTools.isInRect({x:args.x, y:args.y},canvasObjLeaf.rect))
					this.neighbor("CanvasRect").fill_style = rectLeaf.fill_style;
			}
		}
	}
}

var objectTreeSource = { 
	id: "root",leafs: [{lclass: "DOM", data: {update_period:2000}}],
	objects: [
		{leafs: [{lclass: "DOMElement", data: {type:"div",style:"width:300px; height:30px; background-color:#666;"}}
			],
		objects: [
			{leafs: [{lclass: "DOMElement",data: {type:"div", style:"width:30px; height:30px; background-color:#222;"}}
			]}
		]},
		{id: "canvas",
		leafs: [{lclass: "Canvas", data: {width: 500, height: 500}}
			],
		objects: [
				{id: "player",
				leafs: [{lclass: "PlayerCtrl"},
						{lclass: "CanvasObject", data: {x: 110,y: 110}},
						{lclass: "CanvasRect",data: {width: 50,height: 50,fill_style: "blue"	}}
						]},
				{id: "ball",
				leafs: [{lclass: "CanvasObject", data: {x: 40,y: 70}},
						{lclass: "CanvasRect",data: {width: 30,height: 30,fill_style: "green"}},
						]},
				{id: "box",
				leafs: [{lclass: "CanvasObject", data: {x: 70,y: 30}},
						{lclass: "CanvasRect",data: {width: 30,height: 30,fill_style: "#666"}}
						]}
			]},
		]
	};
	
export function main() {
	var classList = {
		"PlayerCtrl":LeafPlayerCtrl
		}
	var objectTree = loadTree(objectTreeSource, classList);
	console.log(objectTree.toJSON()); 
}

///@} TreeInit
