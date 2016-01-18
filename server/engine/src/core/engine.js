import Obj from "obj.js"
import ObjTree from "obj_tree.js"
import LeafCanvas from "leaf_canvas.js";
import LeafCanvasObject from "leaf_canvas_object.js";
import Leaf from "leaf.js"
import LeafDOM from "leaf_dom.js"
import LeafDOMObject from "leaf_dom_object.js"
import LeafCanvasGraphics from "leaf_canvas_graphics.js";
import LeafCanvasFigure from "leaf_canvas_figure.js";
import LeafCanvasRect from "leaf_canvas_rect.js";
import LeafDOMElement from "leaf_dom_element.js";
import LeafInputCtrl from "leaf_input_ctrl.js";

console.log("DVIGLO ENGINE v0.1.0");

///@addtogroup Core
///@{

///Loads an object tree from json
///@param objTreeSrc JSON object
///@param classList List of using classes
export function loadTree(objTreeSrc, extClassList, extResList) {

	var resList = Object.assign({
		"ModifierAddObj": ResModifierAddObj
	}, extResList);

	var classList = Object.assign({
		"LeafCanvas":LeafCanvas,
		"LeafCanvasGraphics":LeafCanvasGraphics,
		"LeafCanvasFigure":LeafCanvasFigure,
		"LeafCanvasRect":LeafCanvasRect,
		"LeafCanvasObject":LeafCanvasObject,
		"LeafCanvasImage":Leaf,
		"LeafDOM":LeafDOM,
		"LeafDOMObject":LeafDOMObject,
		"LeafDOMElement":LeafDOMElement,
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
		"InputCtrl":LeafInputCtrl
		}, extClassList);

	if (typeof(document) !== "object")
		throw Error("DOM is not loaded. Call loadTree() in main().");
	return new ObjTree(objTreeSrc, classList);
}

///@}
