import Template from "template.js";
import Obj from "obj.js";
import Leaf from "leaf.js";

///@addtogroup CanvasExtention
///@{

export default class TemplateCanvasObj extends Template {
	
	constructor (defaultParams) {
		super();
		this.objSrc = { leafs: [ {lclass: "CanvasObject", data: {x: 0,y: 0}} ]};
		this.defaultParams = defaultParams;
	}
	
	///Creates child object and appends leafs passed through params
	///@param obj parent object
	///@param params array of leafs
	inflate(obj,params = {x:0, y:0}) {
		var object = new Obj(obj.tree, this.objSrc, obj);
		object.leaf("CanvasObject").x = params.x;
		object.leaf("CanvasObject").y = params.y;
		Object.assign(params, this.defaultParams);
		if (Array.isArray(params.leafs)) {
			for (let leafSrc of params.leafs) {
				let leaf = Leaf.createLeaf(obj,leafSrc);
				object.addLeaf(leaf);
			}
		}
		obj.addChild(object);
	}
	
	isFitToObj(obj) {
		return true; //TODO: check is object in canvas tree?
	}
	
}

///@}
