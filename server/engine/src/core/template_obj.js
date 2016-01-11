import Template from "template.js";
import Obj from "obj.js";

///@addtogroup Core
///@{

export default class TemplateObj extends Template {
	
	constructor (objSrc) {
		super();
		this.objSrc = objSrc;
	}
	
	inflate(obj) {
		obj.addChild(new Obj(obj.tree, this.objSrc, obj));
	}
	
	isFitToObj(obj) {
		return obj instanceof Obj;
	}
	
}

///@}
