import Obj from "obj.js";

///@addtogroup Core
///@{

export default class Template {

	constructor() {
		
	}
	
	applyTo(obj, params) {
		if (!obj instanceof Obj)
			throw new Error("Invalid argument obj. It has to be Obj.");
		if (this.isFitToObj(obj, params))
			this.inflate(obj, params);
	}
	
	///Main template method. It inflates template in object. 
	///@details Template will modify target object by this method implemetation.
	///It is possible make true magic implementing this method.
	inflate(obj, params) {
		throw new Error("Inflate method is not implemented in the Template.");
	}

	isFitToObj(obj, params) {
		return false;
	}

}

///@}
